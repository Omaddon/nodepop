'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');      // Para el formateo de fechas y demás
const config = require('./config');     // Nuestro token secreto para el jwt


module.exports.createToken = (usuario) => {
    const payload = {
        sub: usuario._id,
        iat: moment().unix(),
        exp: moment().add(5, "minutes").unix()
    };

    return jwt.sign(payload, config.Token_Secret);
};