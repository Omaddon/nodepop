'use strict';

const jwt = require('jsonwebtoken');
const config = require('../lib/config');
const moment = require('moment');

// Middleware para comprobar la autorización en rutas privadas
module.exports.ensureAuthenticated = (req, res, next) => {

  if (!req.headers.authorization) {
    return res.send({success: false, result: 'Error. Tu petición no tiene cabecera de autorización.'});
  }

  // Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbsciOiJIUzI1NiJ9.eyJzdWIiOiIWeR.......
  const token = req.headers.authorization.split(" ")[1];
  const payload = jwt.decode(token, config.Token_Secret);

  if (payload.exp <= moment().unix()) {
    return res.send({success: false, result: 'Error. El token ha expirado o es incorrecto'});
  }

  req.usuario = payload.sub;
  next();
};