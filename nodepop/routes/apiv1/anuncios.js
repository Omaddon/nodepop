'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

/* ---------------------------- GET ---------------------------- */

router.get('/', (req, res, next) => {
    Anuncio.find({}).exec((err, anuncios) => {
        if (err) { return next(err) };

        res.json({success: true, result: anuncios});
    });
});


/* ---------------------------- POST ---------------------------- */

router.post('/', (req, res, next) => {
    const nuevoAnuncio = new Anuncio(req.body);

    nuevoAnuncio.save((err, anuncioGuardado) => {
        if (err) { return next(err) };

        res.json({success: true, result: anuncioGuardado});
    });
});


module.exports = router;