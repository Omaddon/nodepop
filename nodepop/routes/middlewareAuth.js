'use strict';

const jwt = require('jsonwebtoken');
const config = require('../lib/config');
const moment = require('moment');

// Middleware para comprobar la autorización en rutas privadas
module.exports.ensureAuthenticated = (req, res, next) => {

  if ((!req.headers.token) && (!req.body.token) && (!req.query.token)) {
    return res.send({ success: false, result: 'Error. Tu petición no tiene cabecera de autorización.' });
  }

  let token = '';
  let payload = '';

  // Token: Bearer eyJ0eXAiOiJKV1QiLCJhbsciOiJIUzI1NiJ9.eyJzdWIiOiIWeR.......
  if (req.headers.token) {
    token = req.headers.token.split(" ")[1];

  } else if (req.body.token) {
    token = req.body.token.split(" ")[1];

  } else if (req.query.token) {
    token = req.query.token.split(" ")[1];
  }

  // Decodificamos el Token con nuestro Token_Secret
  payload = jwt.decode(token, config.Token_Secret);

  if ((payload) && (payload.exp <= moment().unix())) {
    return res.send({ success: false, result: 'Error. El token ha expirado.' });
  } else if (!payload) {
    return res.send({ success: false, result: 'Error. El token es incorrecto.' })
  }

  req.usuario = payload.sub;
  next();
};