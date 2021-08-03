const {response} = require('express');
const Publicacion = require('../models/Posts');
const path = require('path');
const util = require('util')
const fs   = require('fs');
const Reaccion = require('../models/Reaccion'); 
const { body } = require('express-validator');

const cloudinary = require('cloudinary').v2;
const Notificacion = require('../models/Notificacion');
cloudinary.config(process.env.CLOUDINARY_URL);

const listarPublicaciones = async(req, res= response) => {

    const publicaciones = await Publicacion.find()
                                            .sort({ fecha: -1 });
    
    res.json({
        ok: true,
        publicaciones
    })
}


const crearPublicacion = async(req, res= response) => {
    const publicacion = new Publicacion(req.body);
    const notificacion = new Notificacion(req.body);
    try{
        if (req.files) {
            console.log(req.files.multimedia)
            const {tempFilePath} = req.files.multimedia;
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath, { resource_type: "auto" });
            // console.log(resp)
            // const file = req.files.multimedia;
            // const fileName = file.name;
            // const size = file.data.length;
            // const extension = path.extname(fileName);
            
            // const allowedExtensions = /png|PNG|jpeg|jpg|gif|mp4|MP4/;
         
            // if(!allowedExtensions.test(extension)) throw "Unsupported extension!";
            // if(size>5000000) throw "File must be less than 5MB";
            // const md5 = file.md5;
            // const url = "/server" + md5 +extension;
            // await util.promisify(file.mv)("./uploads" + url);
         
            // const multimedia = "http://localhost:4000/" + url;
     
             publicacion.usuario = req.uid;
             publicacion.multimedia = secure_url;
             const publicacionGuardada = await publicacion.save();

             
             res.status(201).json({
                 ok: true,
                 publicacion: publicacionGuardada
             })
             const reaccion = new Reaccion(req.body);
             reaccion.publicacion = publicacion.id;
             await reaccion.save();

             notificacion.descripcion="Se ha realizado una nueva publicación";
             notificacion.tipo="post";
             notificacion.usuario=req.uid;
             notificacion.vistopor=req.uid;
             
             await notificacion.save();

        }else{
                  
     
             publicacion.usuario = req.uid;
            //  publicacion.reaccion= req.uid;
             const publicacionGuardada = await publicacion.save();

              res.status(201).json({
                 ok: true,
                 publicacion: publicacionGuardada
             })

             notificacion.descripcion="Se ha realizado una nueva publicación";
             notificacion.tipo="post";
             notificacion.usuario=req.uid;
             notificacion.vistopor=req.uid;
             
             await notificacion.save();

        }
     

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const actualizarPublicacion = async(req, res= response) => {

    const publicacionId = req.body.id;
    const uid = req.uid;
    console.log(uid)
    console.log(publicacionId)

    try{

        if (req.files) {
            
            const {tempFilePath} = req.files.multimedia;
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath, { resource_type: "auto" });
            // const file = req.files.multimedia;
            // const fileName = file.name;
            // const size = file.data.length;
            // const extension = path.extname(fileName);
            
            // const allowedExtensions = /png|PNG|jpeg|jpg|gif|mp4|MP4/;
         
            // if(!allowedExtensions.test(extension)) throw "Unsupported extension!";
            // if(size>5000000) throw "File must be less than 5MB";
            // const md5 = file.md5;
            // const url = "/server" + md5 +extension;
            // await util.promisify(file.mv)("./uploads" + url);
         
            // const multimedia = "http://localhost:4000/" + url;
     
            // publicacion.usuario = req.uid;
            // publicacion.multimedia = multimedia;
            
            const publicacion = await Publicacion.findById(publicacionId);
            // console.log(publicacionId)
            if(!publicacion){
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe publicacion con esa ID'
                })
            }
            if(publicacion.usuario.toString() !== uid){
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene previlegio de editar este evento'
                })
            }
             if(publicacion.multimedia){
                const nombreArr = publicacion.multimedia.split('/');
                const nombre    = nombreArr[ nombreArr.length - 1 ];
                const [ public_id ] = nombre.split('.');
                cloudinary.uploader.destroy( public_id );
             }
     
             const nuevaPublicacion = {
                 ...req.body,
                 multimedia:secure_url,
                 usuario: uid
             }
     
             const publicacionActualizado = await Publicacion.findByIdAndUpdate(publicacionId, nuevaPublicacion, {new: true});
     
             res.json({
                 ok: true,
                 publicacion: publicacionActualizado
             })
        }else{
            
            const publicacion = await Publicacion.findById(publicacionId);
            // console.log(publicacionId)
            if(!publicacion){
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe publicacion con esa ID'
                })
            }
            if(publicacion.usuario.toString() !== uid){
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene previlegio de editar este evento'
                })
            }
           
            const nuevaPublicacion = {
                ...req.body,
                usuario: uid,
                reaccion: uid
            }
    
            const publicacionActualizado = await Publicacion.findByIdAndUpdate(publicacionId, nuevaPublicacion, {new: true});
    
            res.json({
                ok: true,
                publicacion: publicacionActualizado
            })
        }
   

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }


}
const actualizarReaccion = async(req, res= response) => {

    const publicacionId = req.body.id;
    const uid = req.uid;
    console.log(uid)
    console.log(publicacionId)
  
    try{

            
            const publicacion = await Publicacion.find({"reaccion":uid,"_id":publicacionId});
            console.log('dada',publicacion)
            if(!publicacion){
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe publicacion con esa ID'
                })
            }
    
           
            const nuevaPublicacion = {
                ...req.body,
                usuario: uid,
                reaccion: uid
            }
    if(publicacion<=0){
        const publicacionActualizado = await Publicacion.findByIdAndUpdate(publicacionId, {$push:{reaccion:req.uid}}, {new: true});
        res.json({
            ok: true,
            publicacion: publicacionActualizado
        })
    }else{
        const publicacionActualizado = await Publicacion.findByIdAndUpdate(publicacionId, {$pull:{reaccion:req.uid}}, {new: true});
        res.json({
            ok: true,
            publicacion: publicacionActualizado
        })
    }
            
    
           
        
   

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }


}
const eliminarPublicacion = async(req, res= response) => {

    const publicacionId = req.params.id;
    const uid = req.uid;
    console.log(publicacionId)
    try{
        console.log('llego aqui eliminar')
        const publicacion = await Publicacion.findById(publicacionId);
     
        if(!publicacion){
            return res.status(404).json({
                ok: false,
                msg: 'No existe publicacion con esa ID'
            })
        }
        if(publicacion.usuario.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene previlegio de eliminar este evento'
            })
        }

        if(publicacion.multimedia){
            console.log("llego a eliminar multimedia")
            const nombreArr = publicacion.multimedia.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            console.log(public_id)
            await cloudinary.uploader.destroy( public_id );
         }

        await Publicacion.findByIdAndDelete(publicacionId);

        res.json({
            ok: true,
            publicacion
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}
const listarNotificaciones = async(req, res= response) => {

    const notificacion = await Notificacion.find({usuario:{$ne:req.uid}})
                                            .sort({ fecha: -1 })
                                            
    
    res.json({
        ok: true,
        notificacion
    })
}

const actualizarNotificacion = async(req, res= response) => {

    const notificacionId = req.body.id;
    const uid = req.uid;
    console.log(uid)
    console.log(notificacionId)
 
    try{

            
            const notificacion = await Notificacion.find({"vistopor":uid,"_id":notificacionId});
            console.log('dada',notificacion)
            if(!notificacion){
                console.log('no existe')
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe publicacion con esa ID'
                })
            }
    
           
            const nuevaPublicacion = {
                ...req.body,
                usuario: uid,
                reaccion: uid
            }

    if(notificacion<=0){

        const publicacionActualizado = await Notificacion.findByIdAndUpdate(notificacionId, {$push:{vistopor:req.uid}}, {new: true});
        res.json({
            ok: true,
            publicacion: publicacionActualizado
        })
    }

            
    
           
        
   

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }


}


module.exports = {
    listarPublicaciones,
    crearPublicacion,
    actualizarPublicacion,
    eliminarPublicacion,
    actualizarReaccion,
    listarNotificaciones,
    actualizarNotificacion
}