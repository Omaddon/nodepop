'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Anuncio = require('../models/Anuncio');
const fs = require('fs');
const path = require('path');


mongoose.connect('mongodb://localhost/nodepop');

/* --------------------------------- Funciones Aux --------------------------------- */

function guardar (anuncio) {
    return new Promise((resolve, reject) => {
        
        const anuncioNuevo = new Anuncio(anuncio);
        anuncioNuevo.save((err, anuncioGuardado) => {

            if (err){
                reject(err);
            }

            // console.log('Anuncio ' + anuncioNuevo + ' guardado.');
            resolve(anuncioGuardado);
            });
    });
}


async function guardarTodos(anuncios) {

    for (let i = 0; i < anuncios.length; i++) {
        await guardar(anuncios[i]);
    }

}



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
        console.log('...Parseado del JSON: OK');

        guardarTodos(anuncios)
            .then((anuncioGuardado) => {
                console.log('...db cargada con JSON: OK\n' 
                + anuncios.length + ' anuncios guardados.\n'
                + ">> 'nodepop' inicializada correctamente.\n");
                mongoose.connection.close();
            })
            .catch((err) =>{
                console.log('>> Error al guardar datos en la db desde el JSON.\n', err);
                mongoose.connection.close();
            });
       
    });

});
