const mongoose = require('mongoose')

const NatayeSchema = new mongoose.Schema({
    amazina: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    akarere: {
        type: String,
        required: true
    },
    umurenge: {
        type: String,
        required: true
    },
    akagari: {
        type: String,
        required: true
    },
    umudugudu: {
        type: String,
        required: true
    },
    ubwoko: {
        type: String,
        required: true
    },
    indangamuntu: {
        type: String,
        required: true
    },
    icyangombwa: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const Nataye = mongoose.model('Nataye', NatayeSchema)

module.exports = Nataye