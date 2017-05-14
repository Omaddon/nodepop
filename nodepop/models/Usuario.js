'use strict';

const mongoose = require('mongoose');



/* --------------------------------- USUARIO --------------------------------- */

const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});



usuarioSchema.statics.deleteAll = function (callback) {
    Usuario.remove({}, err => {
        if (err) { return callback(err); }
        
        callback(null);
    });
}


var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;