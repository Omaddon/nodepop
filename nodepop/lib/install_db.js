'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Anuncio = require('../models/Anuncio');

mongoose.connect('mongodb://localhost/nodepop');

Anuncio.deleteAll(err => {
    if (err) {
        console.log('Error al inicializar la db de Anuncios. Error al borrar: ', err);
    }
    mongoose.connection.close();
});

