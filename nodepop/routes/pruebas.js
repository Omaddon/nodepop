'use strict';

const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const Anuncio = require('../models/Anuncio');

/* ---------------------------- GET ---------------------------- */

router.get('/', (req, res, next) => {
    Anuncio.find({}).exec((err, anuncios) => {
        if (err) { return next(err) };

        res.json({success: true, result: anuncios});
    });
});


/* ---------------------------- POST ---------------------------- */

router.post('/', (req, res, next) => {
    const anuncio = new Anuncio(req.body);

    anuncio.save((err, anuncioGuardado) => {
        if (err) { return next(err) };

        res.json({success: true, result: anuncioGuardado});
    });
});


module.exports = router;