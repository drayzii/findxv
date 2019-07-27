const mongoose = require('mongoose')

const IbyabonetseSchema = new mongoose.Schema({
    amazina: {
        type: String,
        required: true
    },
    ubwoko: {
        type: String,
        required: true
    },
    icyangombwa: {
        type: String,
        required: true
    }
})

const Ibyabonetse = mongoose.model('Ibyabonetse', IbyabonetseSchema)

module.exports = Ibyabonetse