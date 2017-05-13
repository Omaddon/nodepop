'use strict';

const mongoose = require('mongoose');

 /* --------------------------------- ANUNCIO --------------------------------- */

const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

anuncioSchema.statics.deleteAll = function (callback) {
    Anuncio.remove({}, err => {
        if (err) { return callback(err); }

        console.log('>> Éxito!! nodepop inicializada correctamente.');
        callback(null);
    });
}

// Crear método estático de búsqueda para los anuncios:
/*

anuncioSchema.statics.list = function (..., callback) {

};

*/

var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;