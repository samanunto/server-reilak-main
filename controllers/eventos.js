const { response } = require('express');
const Evento = require('../models/Eventos');
const { body } = require('express-validator');
const Notificacion = require('../models/Notificacion');

const listarEventos = async(req, res = response) => {

    const eventos = await Evento.find()
        .sort({ fecha: -1 });
    res.json({
        ok: true,
        eventos
    })
}

const listarEventosCercanos = async(req, res = response) => {

    const eventos = await Evento.find()
        .sort({ fecha: -1 })
        .limit(3);

    res.json({
        ok: true,
        eventos
    })
}


const crearEvento = async(req, res = response) => {

    const eventos = new Evento(req.body);
    const notificacion = new Notificacion(req.body);
    console.log(eventos);
    try {

        eventos.usuario = req.uid;
        const eventoGuardado = await eventos.save();
        res.json({
            ok: true,
            evento: eventoGuardado
        })
        notificacion.descripcion = "Ha creado un nuevo evento";
        notificacion.tipo = "evento";

        console.log("hola")
        await notificacion.save();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administradorr'
        });
    }

}


const actualizarEvento = async(req, res = response) => {

    const eventoId = req.body.id;
    const uid = req.uid;

    try {

        const eventos = await Evento.findById(eventoId);

        if (!eventos) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe publicacion con esa ID'
            })
        }
        if (eventos.usuario.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene previlegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            evento: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const eventos = await Evento.findByIdAndDelete(eventoId);

        if (!eventos) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe publicacion con esa ID'
            })
        }
        if (eventos.usuario.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene previlegio de eliminar este evento'
            })
        }



        await Evento.findByIdAndDelete(eventoId);

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    listarEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    listarEventosCercanos
}