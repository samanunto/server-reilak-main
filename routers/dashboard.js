/*
Rutas de Dashboard /users
host + /api/dashboard
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validat-jwt');

const { contarUsuarios, usuariosOnline, usuariosOffline, publicacionesSemanales, eventosSemanales, conexionesDiarias } = require('../controllers/dashboard');

const router = Router();

// Todas tienen que pasar por la validacion de JWT
router.use(validarJWT);

//Cantidad de Usuarios
router.get('/userscount', contarUsuarios);

//Usuarios Online
router.get('/usersonline', usuariosOnline);

//Usuarios Offline
router.get('/usersoffline', usuariosOffline);

//Publicaciones de la semana
router.get('/potw/:tiempos', publicacionesSemanales);

//Eventos de la semana
router.get('/eotw/:tiempos', eventosSemanales);

//Eventos de la semana
router.get('/conexionesdiarias/:tiempos', conexionesDiarias);

module.exports = router;