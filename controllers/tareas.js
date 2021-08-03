const {response} = require('express');
const Publicacion = require('../models/Posts');
const path = require('path');
const util = require('util')
const fs   = require('fs');
const Reaccion = require('../models/Reaccion'); 
const { body } = require('express-validator');
const Tareas = require('../models/Tareas');



const listarTareas = async(req, res= response) => {
    const uid = req.uid
 

    const tareas = await Tareas.find({"usuario":uid}).sort("estado")
                                            
    
    res.json({
        ok: true,
        tareas
    })
}

const listarImagenes = async(req, res= response) => {
    const uid = req.uid
 

    const tareas = await Tareas.find({"usuario":uid}).sort("estado")
                                            
    
    res.json({
        ok: true,
        tareas
    })
}




const estadoTareas = async(req, res= response) => {

    const tareasId = req.params.id;
    console.log("body",req.body)
    const uid = req.uid;
    console.log(uid)
    console.log(tareasId)
    console.log(req.params)
    console.log('llego a actualizar publicacion controlador')
    try{


            
            const tareas = await Tareas.findById(tareasId);
            // console.log(publicacionId)
            if(!tareas){
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe tarea con esa ID'
                })
            }
            if(tareas.usuario.toString() !== uid){
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene previlegio de editar este evento'
                })
            }
           
            const nuevaTareas = {
                ...req.body,
                usuario: uid
            }
            
            if(tareas.estado  === false){
                console.log("falso es");
                const tareasActualizado = await Tareas.findByIdAndUpdate(tareasId,{$set:{estado:true}} , {new: true});
                res.json({
                    ok: true,
                    tareas: tareasActualizado
                })
            }else if(tareas.estado  === true){
                const tareasActualizado = await Tareas.findByIdAndUpdate(tareasId,{$set:{estado:false}} , {new: true});

                res.json({
                    ok: true,
                    tareas: tareasActualizado
                })

            }
            
    
            
    
 
        
   

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }


}

const crearTareas = async(req, res= response) => {
    const tareas = new Tareas(req.body);
    try{


                  
     
             tareas.usuario = req.uid;
            //  publicacion.reaccion= req.uid;
             const tareasGuardada = await tareas.save();
              res.status(201).json({
                 ok: true,
                 tareas: tareasGuardada
             })

       

        
     

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const actualizarTareas = async(req, res= response) => {

    const tareasId = req.body._id;
    console.log("body",req.body)
    const uid = req.uid;
    console.log(uid)
    console.log(tareasId)
 
    try{


            
            const tareas = await Tareas.findById(tareasId);
            // console.log(publicacionId)
            if(!tareas){
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe tarea con esa ID'
                })
            }
            if(tareas.usuario.toString() !== uid){
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene previlegio de editar este evento'
                })
            }
           
            const nuevaTareas = {
                ...req.body,
                usuario: uid
            }
    
            const tareasActualizado = await Tareas.findByIdAndUpdate(tareasId, nuevaTareas, {new: true});
    
            res.json({
                ok: true,
                tareas: tareasActualizado
            })
        
   

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }


}

const eliminarTareas = async(req, res= response) => {

    const tareasId = req.params.id;
    const uid = req.uid;
    console.log("tareasId",tareasId)
    console.log("se elimino")
    console.log(req.params)
    try{
     
        const tareas = await Tareas.findById(tareasId);

        if(!tareas){
            return res.status(404).json({
                ok: false,
                msg:tareasId ,
                tareasId:tareasId
            })
        }
        if(tareas.usuario.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene previlegio de eliminar este evento'
            })
        }



        await Tareas.findByIdAndDelete(tareasId);

        res.json({
            ok: true,
            tareas
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    listarTareas,
    crearTareas,
    actualizarTareas,
    eliminarTareas,
    estadoTareas,
    listarImagenes
    
}