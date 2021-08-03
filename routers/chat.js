/*
Post Routes
/api/posts
*/

const {Router} = require('express');
const {check} = require('express-validator');


const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validat-jwt');
const {listarChat,listarMessage, listarMiembros} = require('../controllers/chat');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
// const { coleccionesPermitidas } = require('../helpers');




const router = Router();

// Todas tienen que pasar por la validacion de JWT
router.use(validarJWT);

//obtener chats
router.get('/', listarChat);

//obtener messages
router.get('/message/:chat', listarMessage);

//obtener miembros
router.get('/miembros/:chat', listarMiembros)

module.exports = router;
