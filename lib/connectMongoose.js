'use strict';

const mongoose = require('mongoose');
const connection = mongoose.connection;
const local_config = require('./local_config');

mongoose.Promise = global.Promise;

connection.on('error', (err) => {
    console.log('Error de conexión', err);
    process.exit(1);
});

connection.once('open', () => {
    console.log('Conectado a MongoDB.');
});

// db: nodepop | 2 collections: anuncios + users
mongoose.connect(local_config.mongodbPath);