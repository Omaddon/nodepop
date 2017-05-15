'use strict';

const fs = require('fs');

module.exports = (error, idioma, callback) => {

    console.log('>>>\n\nERROR:\n' + error.code + '\n\n');

    let miError = '¿?';

    fs.readFile('./lib/errors.json', 'utf-8', (err, data) => {
            
            if (err) { 
                console.log('>> Error al leer el JSON.'); 
                callback(err);
                return;
            }

            try {

                var anuncioJSON = JSON.parse(data);

            } catch (e) {
                console.log('>> Error al parsear el JSON.');
                callback(e);
                return;
            }

            const keys = Object.keys(anuncioJSON);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (key === error.code) {
                    console.log('>> ' + anuncioJSON[key][idioma]);
                    miError = String(anuncioJSON[key][idioma]);
                    callback(miError);
                    return;
                }
            }

            callback(miError);
    });
};
