const { response } = require("express");
const Chat = require("../models/Chat");
const path = require("path");
const util = require("util");
const fs = require("fs");
const Message = require("../models/message");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
const Usuarios = require("../models/Usuarios");
cloudinary.config(process.env.CLOUDINARY_URL);

const listarChat = async (req, res = response) => {
  const uid = req.uid;
  let chat = await Chat.find({ members: uid }).sort({ fecha: -1 });

  for (let i = 0; i < chat.length; i++) {
    // console.log("lista chat", chat[i].tipo);
    if (chat[i].tipo === "personal") {
      // console.log("es personal");
      // console.log(chat[i].members);
      for (let j = 0; j < chat[i].members.length; j++) {      
        if (JSON.stringify(chat[i].members[j]) !== JSON.stringify(uid)) {
          // console.log(chat[i].members[j]);
          const user = await Usuarios.findById(chat[i].members[j]);        
          chat[i].user=user;
        }
      }
    }
  }

  // chat.forEach(async(element,i) => {
  //   if(element.tipo==="personal"){
  //     element.members.forEach(async(data,i)=>{
  //       if(JSON.stringify(data)!==JSON.stringify(uid)){
  //         const user = await Usuarios.findById(data);

  //         chat.user=user
  //         console.log('object',chat)
  //       }
  //     })
  //   }
  // });

  res.json({
    ok: true,
    chat,
  });
};
const buscarChat = async (payload) => {
  console.log("ver ", payload);
  const chat = await Chat.findById(payload.to);


  return chat;
};
const findUserChatPersonal = async (payload) => {
  const userPersonal = await Usuarios.findById(payload.to);
  return userPersonal;
};
const findMeUserChat =async(payload) =>{
  const meUserChat = await Usuarios.findById(payload.from);
  return meUserChat;
}
const listarMessage = async (req, res = response) => {
  const sala = req.params.chat;
  const message = await Message.aggregate([
    {
      $lookup: {
        from: "usuarios",
        localField: "from",
        foreignField: "_id",
        as: "userMessage",
      },
    },
    { $unwind: "$userMessage" },
    { $match: { to: ObjectId(sala) } },
    { $sort: { fecha: -1 } },
    { $limit: 10 },

    {
      $project: {
        name: "$userMessage.name",
        segundoNombre: "$userMessage.segundoNombre",
        apellidoPaterno: "$userMessage.apellidoPaterno",
        apellidoMaterno: "$userMessage.apellidoMaterno",
        imgusuario: "$userMessage.imgusuario",
        to: 1,
        from: 1,
        message: 1,
        fecha: 1,
      },
    },
  ]);
  res.json({
    ok: true,
    message,
  });
};

const listarMiembros = async (req, res = response) => {
  const idChat = req.params.chat;
  const miembros = await Chat.aggregate([
    {
      $lookup: {
        from: "usuarios",
        localField: "members",
        foreignField: "_id",
        as: "miembros",
      },
    },
    { $unwind: "$miembros" },
    { $match: { _id: ObjectId(idChat) } },
    { $sort: { "miembros.online": -1 } },
    {
      $project: {
        name: "$miembros.name",
        segundoNombre: "$miembros.segundoNombre",
        apellidoPaterno: "$miembros.apellidoPaterno",
        apellidoMaterno: "$miembros.apellidoMaterno",
        imgusuario: "$miembros.imgusuario",
        admin: 1,
        idusuario: "$miembros._id",
        online: "$miembros.online",
      },
    },
  ]);

  res.json({
    ok: true,
    miembros,
  });
};

module.exports = {
  listarChat,
  listarMessage,
  listarMiembros,
  buscarChat,
  findUserChatPersonal,
  findMeUserChat,
};
