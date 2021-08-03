const Usuario = require('../models/Usuarios');
const {response} = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/message');
const ObjectId = require('mongoose').Types.ObjectId;
const Conexion = require('../models/conexion');

// const Mensaje = require('../models/mensaje');

const usuarioConectado = async( uid ) => {
    const usuario = await Usuario.findById(uid);
    
    // usuario.online = true;
    await Usuario.findByIdAndUpdate(uid, {$set:{online:true}}, {new: true});
    // await usuario.save();
    

    return usuario;
}
const iniciarConexion = async(uid)=>{
    const conexion = new Conexion( ObjectId(uid) );
    conexion.usuario=uid;
    await conexion.save();

    return conexion
}
const findUsuariosConectados = async(uid)=>{
    console.log(uid);
    const usuario = await Usuario.find({online:true});
    return usuario;
}
const usuarioDesconectado = async( uid ) => {
    const usuario = await Usuario.findById(uid);

    // usuario.online = true;
    await Usuario.findByIdAndUpdate(uid, {$set:{online:false}}, {new: true});
    // await usuario.save();
    
    return usuario;
}
const terminarConexion = async(uid)=>{
    const conexion = await Conexion.findOne({"usuario":ObjectId(uid)}).sort({"_id":-1});
   
    conexion.fechatermino=Date.now();
    await Conexion.findByIdAndUpdate(conexion._id, conexion, {new: true},);
    
    return conexion
}
const getNotificacion = async()=>{

}


// const getUsuarios = async() => {

//     const usuarios = await Usuario
//         .find()
//         .sort('-online');

//     return usuarios;
// }

const grabarSala = async( payload ) => {
    console.log('60',payload)
    try {
        if(payload.data===undefined){
            const sala = new Chat( payload.data );
            sala.tipo="personal";
            sala.members.push(payload.from);
            sala.members.push(payload.to)
            console.log('es personal')
            console.log('payload', payload)
            await sala.save();
            return sala;
        }
            const sala = new Chat( payload.data );
            console.log('payload', payload)
            await sala.save();
            return sala;



    } catch (error) {
        console.log(error);
        return false;
    }

}
const grabarMessage = async( payload ) => {
    
    try {
        const message = new Message( payload );
        await message.save();
       const userMessage = await Message.aggregate(
            [
              {
                $lookup:
                  {
                    from: 'usuarios',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'userMessage'
                  }
             },
             {$unwind:"$userMessage"},
             { $match : { _id: ObjectId(message._id)} }, 
        
             {
                 $project: 
                   {
                        name : '$userMessage.name',
                        segundoNombre : '$userMessage.segundoNombre',
                        apellidoPaterno : '$userMessage.apellidoPaterno',
                        apellidoMaterno : '$userMessage.apellidoMaterno',
                        imgusuario : '$userMessage.imgusuario',
                        to:1,
                        from:1,
                        message:1,
                        fecha:1,
                    }
            },
        
            ]
          )
          userMessage.map(()=>{})
        return userMessage;

    } catch (error) {
        console.log(error);
        return false;
    }

}

const findMembers = async(payload)=>{
    const sala = await Chat.findById(payload);
    return sala;
}

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    // getUsuarios,
     grabarSala,
     findMembers,
     grabarMessage,
     iniciarConexion,
     terminarConexion,
     findUsuariosConectados,
}
