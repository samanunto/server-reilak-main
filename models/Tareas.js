const {Schema, model} = require('mongoose');

const TareasSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },

    fecha:{
        type: Date,
       
        

    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
       default:  false
    },

});




module.exports = model('Tareas', TareasSchema);