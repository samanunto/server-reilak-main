const { Schema, model } = require('mongoose');

const EventSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    tipo: {
        type: String,
    },
    reunion: [{
        type: [String],
        default: [],
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

EventSchema.method('toJSON', function() {
    const { __v, _id, ...Object } = this.toObject();
    Object.id = _id;
    return Object;
})


module.exports = model('Evento', EventSchema);