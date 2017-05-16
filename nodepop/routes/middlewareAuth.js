'use strict';

const jwt = require('jsonwebtoken');
const config = require('../lib/config');
const moment = require('moment');
const customError = require('../lib/customError');


// Middleware para comprobar la autorización en rutas privadas
module.exports.ensureAuthenticated = async(req, res, next) => {
  
  let idioma = 'es';
  let error;

  if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
    idioma = req.headers.language;
  }

/* ---------------------------- ERRORES DE FALTA DE AUTH ---------------------------- */
  if ((!req.headers.token) && (!req.body.token) && (!req.query.token)) {

    switch (idioma) {
      case 'es':
        return res.json({ success: false, result: 'Error. Tu petición no tiene cabecera de autorización.' });
      case 'en':
        return res.json({ success: false, result: 'Error. Your request has no authorization header.' });
    }

  }
  /* -------------------------------------------------------------------------------- */

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


/* ------------------------------ ERRORES DE DECODE ------------------------------ */
  if ((payload) && (payload.exp <= moment().unix())) {

    switch (idioma) {
      case 'es':
        return res.send({ success: false, result: 'Error. El token ha expirado.' });
      case 'en':
        return res.send({ success: false, result: 'Error. The token has expired.' });
    }

  } else if (!payload) {

    switch (idioma) {
      case 'es':
        return res.send({ success: false, result: 'Error. El token es incorrecto.' });
      case 'en':
        return res.send({ success: false, result: 'Error. The token is incorrect.' });
    }
  }

  req.usuario = payload.sub;
  next();
};