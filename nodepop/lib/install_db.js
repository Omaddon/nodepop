'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Anuncio = require('../models/Anuncio');
const Usuario = require('../models/Usuario');
const fs = require('fs');
const path = require('path');
const service = require('./service');
const local_config = require('./local_config');


mongoose.connect(local_config.mongodbPath);

/* --------------------------------- Funciones Aux --------------------------------- */

function guardarAnuncio (anuncio) {
    return new Promise((resolve, reject) => {
        
        const anuncioNuevo = new Anuncio(anuncio);
        anuncioNuevo.save((err, anuncioGuardado) => {

            if (err){
                reject(err);
            }

            resolve(anuncioGuardado);
        });
    });
}

function guardarUsuario(usuario) {
    return new Promise((resolve, reject) => {

        const usuarioNuevo = new Usuario(usuario);
        usuarioNuevo.save((err, usuarioGuardado) => {

            if (err) { reject(err) }

            const token = service.createToken(usuario);

            resolve(token);
        });

    });
}


async function guardarTodos(anuncios) {

    for (let i = 0; i < anuncios.length; i++) {
        await guardarAnuncio(anuncios[i]);
    }
}



/* --------------------------------- BORRADO --------------------------------- */

Anuncio.deleteAll(err => {
    if (err) {
        return console.log('>> Error al inicializar la db de Anuncios. Error al borrar: ', err);
    }

    console.log('...Borrado de la db Anuncios: OK');

    Usuario.deleteAll(err => {

        if (err) {
            return console.log('>> Error al inicializar la db de Usuarios. Error al borrar: ', err);
        }

        console.log('...Borrado de la db Usuarios: OK');

        // TOKEN: ver consola
        guardarUsuario(local_config.testUser)
            .then((token) => {
                console.log('...db cargada con Usuario de prueba: OK');
                console.log('TOKEN:\n' + 'userTest ' + token);
            })
            .catch((err) => {
                console.log('>> Error al cargar el usuario de prueba en la db.\n', err);
            });

    });

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
            .then((usuarioCargado) => {
                console.log('...db cargada con JSON: OK\n' 
                + anuncios.length + ' anuncios guardados.\n'
                + "\n\n>> 'nodepop' inicializada correctamente.\n");
                mongoose.connection.close();
            })
            .catch((err) =>{
                console.log('>> Error al guardar datos en la db desde el JSON.\n', err);
                mongoose.connection.close();
            });
    });
});
