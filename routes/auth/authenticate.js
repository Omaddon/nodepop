'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const service = require('../../lib/service')
const customError = require('../../lib/customError');
const isEmail = require('isemail');
const hash = require('hash.js');


/* ---------------------------- POST ---------------------------- */

/*  POST /auth/signup  */
module.exports.emailSignup = (req, res, next) => {
    
    let idioma = 'es';
    let error = {};
    const claveUsuario = req.body.clave;

    if ((req.query.language === 'es') || (req.query.language === 'en')) {
        idioma = req.query.language;
    } else if ((req.body.language === 'es') || (req.body.language === 'en')) {
        idioma = req.body.language;
    } else if ((req.headers.language === 'es') || (req.headers.language === 'en')) {
        idioma = req.headers.language;
    } else if ((typeof(req.query.language) == 'undefined')
            || (typeof(req.body.language) == 'undefined') 
            || (typeof(req.headers.language) == 'undefined')) {

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

    let claveHash = hash.sha256().update(claveUsuario).digest('hex');

    const nuevoUsario = new Usuario({
        'nombre': req.body.nombre,
        'email': req.body.email,
        'clave': claveHash
    });

    nuevoUsario.save((err, usuarioGuardado) => {
        if (err) { return next(err); }

        return res.json({ success: true, result: service.createToken(nuevoUsario) });
    });
};


/*  POST /authlogin  */
module.exports.emailLogin = (req, res, next) => {

    let idioma = 'es';

    if ((req.query.language === 'es') || (req.query.language === 'en')) {
        idioma = req.query.language;
    } else if ((req.body.language === 'es') || (req.body.language === 'en')) {
        idioma = req.body.language;
    } else if ((req.headers.language === 'es') || (req.headers.language === 'en')) {
        idioma = req.headers.language;
    } else if ((typeof(req.query.language) == 'undefined')
            || (typeof(req.body.language) == 'undefined') 
            || (typeof(req.headers.language) == 'undefined')) {

        /* ---------------------------- ERRORES DE IDIOMA NO SOPOARTADO ---------------------------- */
        const error = new Error('IDIOM_NOT_FOUND');
        error.code = 'IDIOM_NOT_FOUND';

        return customError(error, idioma)
            .then((miError) => {
                res.json({ success: false, codeError: miError.code, error: miError.message });
            })
            .catch((err) => {
                next(err);
            });
    }

  Usuario.findOne({ email: req.body.email}, (err, usuario) => {
    if (err) { return next(err) }

    let error;
    const claveUsuario = req.body.clave;
    const claveHash = hash.sha256().update(claveUsuario).digest('hex');

    if (usuario) {
        if ((usuario.clave) === claveHash) {
            return res.json({ success: true, result: service.createToken(usuario) });
        } else {
            error = new Error('PASS_FAIL');
            error.code = 'PASS_FAIL';
            return next(error);
        }
    }

    error = new Error('USER_NOT_FOUND');
    error.code = "USER_NOT_FOUND";
    return next(error);
  });
};


/* ---------------------------- err ---------------------------- */

router.use((err, req, res, next) => {

    let idioma = 'es';
    console.log('\n' + err + '\n');

    if ((req.query.language === 'es') || (req.query.language === 'en')) {
      idioma = req.query.language;
    } else if ((req.body.language === 'es') || (req.body.language === 'en')) {
      idioma = req.body.language;
    } else if ((req.headers.language === 'es') || (req.headers.language === 'en')) {
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