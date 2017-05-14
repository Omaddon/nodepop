'use strict';

module.exports = (err, idioma) => {

    let mensaje = '';

    switch (err.code) {
        case 'ENOENT':
            console.log('\n>> ERROR:\n\n' + err.message + '\n');
            if (idioma === 'es') {
                mensaje = 'No existe la imagen que busca.';
                break;
            } else {
                mensaje = "The image you are looking for doesn't exist.";
                break;
            }
        default: 
            if (idioma === 'es') {
                mensaje = 'Error inesperado.';
                break;
            } else {
                mensaje = "Unexpecred error.";
                break;
            }
    }

    return mensaje;
};