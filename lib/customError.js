'use strict';

const fs = require('fs');

module.exports = (error, idioma) => {

    console.log('\nERROR en customError:', error.code);

    return new Promise((resolve, reject) => {

        let miError = {message: 'Error inesperado.', code: '501'};

        // fs.readFile('./lib/errors.json', 'utf-8', (err, data) => {
        fs.readFile('/home/node/nodepop/lib/errors.json', 'utf-8', (err, data) => {
                
                if (err) { 
                    console.log('>> Error al leer el JSON.'); 
                    return reject(err);
                }

                try {

                    var errJSON = JSON.parse(data);

                } catch (e) {
                    console.log('>> Error al parsear el JSON.');
                    return reject(e);
                }

                // Para captar el código de error de duplicada en db (necesita ser un String)
                if (error.code === 11000) {
                    error.code = String(11000);
                }

                const keys = Object.keys(errJSON);

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];

                    if (key === error.code) {
                        console.log('\n>> ' + errJSON[key][idioma] + ' code: ' + errJSON[key]['code'] + '\n');
                        miError.message = String(errJSON[key][idioma]);
                        miError.code = String(errJSON[key]['code']);
                        return resolve(miError);
                    }
                }

                resolve(miError);
        });
    });
};
