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

    error = new Error('AUTH FAIL');
    error.code = 'AUTH FAIL';

    return customError(error, idioma)
      .then((miError) => {
        res.json({success: false, error: miError})
      })
      .catch((err) => {
        next(err);
      });
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

    error = new Error('TOKEN EXPIRED');
    error.code = 'TOKEN EXPIRED';

    return customError(error, idioma)
      .then((miError) => {
        res.json({ success: false, error: miError })
      })
      .catch((err) => {
        next(err);
      });

  } else if (!payload) {

      error = new Error('TOKEN INCORRECT');
      error.code = 'TOKEN INCORRECT';

      return customError(error, idioma)
        .then((miError) => {
          res.json({ success: false, error: miError })
        })
        .catch((err) => {
          next(err);
        });
  }
/* -------------------------------------------------------------------------------- */

  req.usuario = payload.sub;
  next();
};