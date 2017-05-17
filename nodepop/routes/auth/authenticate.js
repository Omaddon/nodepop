'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const service = require('../../lib/service')
const customError = require('../../lib/customError');
const isEmail = require('isemail');


/* ---------------------------- POST ---------------------------- */

/*  POST /auth/signup  */
module.exports.emailSignup = (req, res, next) => {
    
    let idioma = 'es';
    let error = {};

    console.log(!isEmail.validate(req.body.email));

    if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
        idioma = req.headers.language;
    } else if (req.headers.language) {

        /* ---------------------------- ERRORES DE IDIOMA NO SOPOARTADO ---------------------------- */
        error = new Error('IDIOM_NOT_FOUND');
        error.code = 'IDIOM_NOT_FOUND';

        return customError(error, idioma)
            .then((miError) => {
                res.json({ success: false, codeError: miError.code, error: miError.message });
            })
            .catch((err) => {
                next(err);
            });
    }

    /* ---------------------------- VERIFICACIÓN DE EMAIL ---------------------------- */
    if ((!isEmail.validate(req.body.email)) || (req.body.nombre === '') || (req.body.clave.length < 4)) {

        if (!isEmail.validate(req.body.email)) {
            error = new Error('EMAIL_FAIL');
            error.code = 'EMAIL_FAIL';
        } else if (req.body.nombre === '') {
            error = new Error('NAME_FAIL');
            error.code = 'NAME_FAIL';
        } else if (req.body.clave.length < 4){
            error = new Error('PASS_FAIL');
            error.code = 'PASS_FAIL';
        }

        console.log('Error en verificación de mail:', error.code);

        return customError(error, idioma)
            .then((miError) => {
                res.json({ success: false, codeError: miError.code, error: miError.message });
            })
            .catch((err) => {
                next(err);
            });
     }
     /* ----------------------------------------------------------- */

    const nuevoUsario = new Usuario({
        'nombre': req.body.nombre,
        'email': req.body.email,
        'clave': req.body.clave
    });

    nuevoUsario.save((err, usuarioGuardado) => {
        if (err) { return next(err) }

        return res.json({ success: true, result: service.createToken(nuevoUsario) });
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