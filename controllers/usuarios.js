const { response } = require('express');
// import moment from 'moment';
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

//LISTAR

const listarUsuarios = async(req, res = response) => {

    const usuario = await Usuarios.find()


    res.json({
        ok: true,
        usuario
    })
}



const buscarUsuarios = async(req, res = response) => {

    const usuario = await Usuarios.find()


    res.json({
        ok: true,
        usuario
    })
}

const listaCumpleaños = async(req, res = response) => {
    fecha = new Date();
    filtra = fecha.toLocaleDateString();

    const publicaciones = await Usuarios.findOne({ "nacimiento": /.*06-23*./ })
        // /.*0{4-30}.*/
    res.json({
        ok: true,
        publicaciones
    })
}

//CREAR

const crearUsuario = async(req, res = response) => {
    console.log("crearusaurio")
    const usuario = new Usuarios(req.body);
    console.log(usuario)
    try {
        if (req.files) {
            const { tempFilePath } = req.files.imgusuario;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { resource_type: "auto" });
            usuario.imgusuario = secure_url;
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(usuario.password, salt);
            const usuarioGuardado = await usuario.save();
            console.log(usuarioGuardado)
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        } else {
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(usuario.password, salt);
            const usuarioGuardado = await usuario.save();
            console.log(usuarioGuardado)
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administradorr'
        });
    }
}


const actualizarUsuario = async(req, res = response) => {
    const publicacionId = req.body.id;
    console.log(req.files)
    try {
        if (req.files) {
            console.log(req.files)
            const { tempFilePath } = req.files.imgusuario;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { resource_type: "auto" });
            const usuario = await Usuarios.findById(publicacionId);
            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe publicacion con esa ID'
                })
            }
            if (usuario.imgusuario) {
                console.log("usuario.imgusuari")
                const nombreArr = usuario.imgusuario.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [public_id] = nombre.split('.');
                cloudinary.uploader.destroy(public_id);
            }
            const nuevaPublicacion = {
                ...req.body,
                imgusuario: secure_url
            }
            const salt = bcrypt.genSaltSync();
            nuevaPublicacion.password = bcrypt.hashSync(req.body.password, salt);
            const publicacionActualizado = await Usuarios.findByIdAndUpdate(publicacionId, nuevaPublicacion, { new: true });
            res.json({
                ok: true,
                usuario: publicacionActualizado
            })
        } else {
            console.log("Llegue aquiiiiii")
            const usuario = await Usuarios.findById(publicacionId);
            console.log(usuario)
            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe publicacion con esa ID'
                })
            }
            const nuevaPublicacion = {
                ...req.body,
            }
            console.log("llllllllll")
            const salt = bcrypt.genSaltSync();
            nuevaPublicacion.password = bcrypt.hashSync(req.body.password, salt);
            console.log(nuevaPublicacion.password)
            const publicacionActualizado = await Usuarios.findByIdAndUpdate(publicacionId, nuevaPublicacion, { new: true });
            console.log("ssssssssssssssssssssss")
            res.json({
                ok: true,
                usuario: publicacionActualizado
            })
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administradora'
        })
    }
}

const eliminarUsuario = async(req, res = response) => {
    const usuarioId = req.params.id;
    try {

        if (publicacion.multimedia) {
            const nombreArr = publicacion.multimedia.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
        const ususario = await Usuarios.findByIdAndDelete(usuarioId);
        if (!ususario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe publicacion con esa ID'
            })
        }
        await Usuarios.findByIdAndDelete(usuarioId);

        res.json({
            ok: true,
            ususario
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administradorq'
        })
    }
}

module.exports = {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    listaCumpleaños,
    buscarUsuarios
}