'use strict';

const mongoose = require('mongoose');



/* --------------------------------- USUARIO --------------------------------- */

const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;