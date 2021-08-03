const { response } = require('express');
//MODELS
const Usuarios = require('../models/Usuarios');
const Publicacion = require('../models/Posts');
const Evento = require('../models/Eventos');
const conexion = require('../models/conexion');

//CONTAR USUARIOS
const contarUsuarios = async(req, res = response) => {
    const usuario = await Usuarios.count()
    res.json({
        ok: true,
        usuario
    })
}

//USUARIOS ONLINE
const usuariosOnline = async(req, res = response) => {
    const usuario = await Usuarios.find({ online: true }).count()
    res.json({
        ok: true,
        usuario
    })
}

//USUARIOS OFFLINE
const usuariosOffline = async(req, res = response) => {
    const usuario = await Usuarios.find({ online: false }).count()
    res.json({
        ok: true,
        usuario
    })
}

//PUBLICACIONES SEMANALES
const publicacionesSemanales = async(req, res = response) => {
    fechaInicio = req.params.tiempos
        // const fechaFin
        // const usuario = await Publicacion.find({ "created_on": { "$gte": fechaFin, "$lt": fechaFin } }).count()
    const usuario = await Publicacion.find({ "fecha": { "$gte": fechaInicio } }).count()
    console.log(usuario)
    res.json({
        ok: true,
        usuario
    })
}

//EVENTOS SEMANALES
const eventosSemanales = async(req, res = response) => {
    fechaInicio = req.params.tiempos
        // const fechaFin
        // const usuario = await Publicacion.find({ "created_on": { "$gte": fechaFin, "$lt": fechaFin } }).count()
    const usuario = await Evento.find({ "fecha": { "$gte": fechaInicio } }).count()
    console.log(usuario)
    res.json({
        ok: true,
        usuario
    })
}

//CONEXIONES DIARIAS
const conexionesDiarias = async(req, res = response) => {
    fechaInicio = req.params.tiempos
        // const fechaFin
        // const usuario = await Publicacion.find({ "created_on": { "$gte": fechaFin, "$lt": fechaFin } }).count()
    const usuario = await Evento.find({ "fecha": { "$gte": fechaInicio } }).count()

    console.log("Conectados", await conexion.distinct("usuario", { "fechainicio": { "$gte": fechaInicio } }).count())
    console.log(usuario)
    res.json({
        ok: true,
        usuario
    })
}

//MODULOS EXPORTADOS
module.exports = {
    contarUsuarios,
    usuariosOnline,
    usuariosOffline,
    publicacionesSemanales,
    eventosSemanales,
    conexionesDiarias
}