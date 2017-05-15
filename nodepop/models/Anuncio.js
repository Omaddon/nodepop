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
        
        callback(null);
    });
}

anuncioSchema.statics.list = function(filter, limit, skip, sort, callback) {
    
    console.log('Filtro en llamada:', filter);

    const query = Anuncio.find(filter);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);

    query.exec(callback);
};


var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;