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

        res.send({ success: true, result: service.createToken(nuevoUsario) });
    });
};


/*  POST /authlogin  */
module.exports.emailLogin = (req, res, next) => {

  Usuario.find({ email: req.body.email}, (err, usuarios) => {
    if (err) { return next(err) }

    if ((usuarios) && (usuarios.clave === req.body.clave)) {
      return res.send({success: true, result: service.createToken(usuarios)});
    }

    return res.send({success: false, result: 'El usuario no existe. Debe estar registrado.'});
  });
};


/* ---------------------------- err ---------------------------- */

router.use((err, req, res, next) => {
    console.log(err);
    customError(err, 'es', (miError) => {
        console.log('miError:', miError);
        res.json({success: false, error: miError});
        return;
    });
});