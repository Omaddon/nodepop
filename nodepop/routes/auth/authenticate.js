'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const service = require('../../lib/service')


/* ---------------------------- POST ---------------------------- */

/*  POST /auth/signup  */
module.exports.emailSignup = (req, res, next) => {
    const nuevoUsario = new Usuario({
        'nombre': req.body.nombre,
        'email': req.body.email,
        'clave': req.body.clave
    });

    nuevoUsario.save((err, usuarioGuardado) => {
        if (err) { return next(err) }

        res.json({ success: true, result: service.createToken(nuevoUsario) });
    });
};


/*  POST /authlogin  */
module.exports.emailLogin = (req, res, next) => {

  Usuario.find({ email: req.body.email}, (err, usuarios) => {
    if (err) { return next(err) }

    if (usuarios.length > 0) {
        if (((usuarios)[0].clave) === req.body.clave) {
            return res.json({ success: true, result: service.createToken(usuarios) });
        }
    }

    const error = new  Error('USER_NOT_FOUND');
    error.code = "USER_NOT_FOUND";
    next(error);
  });
};


/* ---------------------------- err ---------------------------- */

router.use((err, req, res, next) => {

    let idioma = 'es';
    console.log('\n' + err + '\n');

    if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
        idioma = req.headers.language;
    }
    
    return customError(err, idioma)
      .then((miError) => {
        res.json({ success: false, codeError: miError.code, error: miError.message });
      })
      .catch((err) => {
        next(err);
      });
});