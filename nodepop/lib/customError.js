'use strict';

const fs = require('fs');

module.exports = (error, idioma) => {

    console.log('\nERROR:', error.code);

    return new Promise((resolve, reject) => {

        let miError = '¿?';

        fs.readFile('./lib/errors.json', 'utf-8', (err, data) => {
                
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

                const keys = Object.keys(errJSON);

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];

                    if (key === error.code) {
                        console.log('\n>> ' + errJSON[key][idioma] + '\n');
                        miError = String(errJSON[key][idioma]);
                        return resolve(miError);
                    }
                }

                resolve(miError);
        });
    });
};
