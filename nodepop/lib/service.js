'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');       // Para el formateo de fechas y demás
const config = require('./config');     // Nuestro token secreto para el jwt

let tiempo = process.env.TIME || 5;
let tipo = process.env.TYPE || 'm';

// Comprobamos variables de entorno personalizadas para ajustar la duración de validez
// de los Token generados. En caso de variables de entorno no válidas, la validez
// por defecto será de 5 minutos
if ((tipo !== 'y') && (tipo !== 'M') && (tipo !== 'w') && (tipo !== 'd') && (tipo !== 'h')
    && (tipo !== 'm') && (tipo !== 's') && (tipo !== 'ms') && (tipo !== 'Q')
    || (tiempo <= 0)) {
    
    tiempo = 5;
    tipo = 'm';
}
module.exports.createToken = (usuario) => {
    const payload = {
        sub: usuario._id,
        iat: moment().unix(),
        exp: moment().add(tiempo, tipo).unix()
    };

    return jwt.sign(payload, config.Token_Secret);
};