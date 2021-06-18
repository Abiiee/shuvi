const mongoose = require('mongoose');

const niveles = mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    xp: {
        type: Number,
        default: 0
    },
    nivel: {
        type: Number,
        default: 1
    },
    tag: String

})
module.exports = mongoose.model('niveles', niveles )
