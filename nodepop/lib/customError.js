'use strict';

const fs = require('fs');

module.exports = (error, idioma, callback) => {

    let miError = '¿?';

    fs.readFile('./lib/errors.json', 'utf-8', (err, data) => {
            
            if (err) { 
                console.log('>> Error al leer el JSON.'); 
                return (err);
            }

            try {

                var anuncioJSON = JSON.parse(data);

            } catch (e) {
                console.log('>> Error al parsear el JSON.');
                return e;
            }

            const keys = Object.keys(anuncioJSON);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (key === error.code) {
                    console.log('>> ' + anuncioJSON[key][idioma]);
                    miError = String(anuncioJSON[key][idioma]);
                    callback(miError);
                }
            }

            callback(miError);
    });
};
