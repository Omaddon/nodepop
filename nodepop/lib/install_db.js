'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Anuncio = require('../models/Anuncio');
const fs = require('fs');
const path = require('path');


mongoose.connect('mongodb://localhost/nodepop');

/* --------------------------------- BORRADO --------------------------------- */

Anuncio.deleteAll(err => {
    if (err) {
        return console.log('>> Error al inicializar la db de Anuncios. Error al borrar: ', err);
    }

    console.log('...Borrado de la db: OK');

    /* --------------------------------- CARGA JSON --------------------------------- */

    fs.readFile('./lib/anuncios.json', 'utf-8', (err, data) => {
        
        if (err) { return console.log('>> Error al leer el JSON.'); }

        try {

            var anuncioJSON = JSON.parse(data);

        } catch (err) {
            
            return console.log('>> Error al parsear el JSON.');
        }

        const anuncios = anuncioJSON.anuncios || '';
        console.log('...Parseado del JSON: OK')

        for (let i = 0; i < anuncios.length; i++) {
            const nuevoAnuncio = new Anuncio(anuncios[i]);
            nuevoAnuncio.save((err, anuncioGuardado) => {
                
                if (err) { return console.log('Error al guardar en la db:', err) };                
            });
        }

        console.log('...db cargada con el JSON: OK\n' + anuncios.length + ' anuncios guardados.\n');

    });

});





mongoose.connection.close();