'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

/* ---------------------------- GET ---------------------------- */

router.get('/', (req, res, next) => {

    const filter = {};

    const tag = req.query.tag;
    const venta = req.query.venta;
    const nombre = req.query.nombre;
    const precio = req.query.precio;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const sort = req.query.sort;

    // REVISAR Tags... así no, mediante condiciones (.find({ tag: { $in: ["A", "D"] }))
    if ((tag) && ((tag === 'work') || (tag === 'lifestyle') || (tag === 'motor') || (tag === 'mobile'))) {
        filter.tags = tag;
    }

    if ((venta === 'true') || (venta === 'false')) {
        filter.venta = venta;
    }

    // REVISAR nombre... así no, mediante (filter.nombre = new RegExp('^' + req.query.nombre, "i"))
    if (nombre) { filter.nombre = nombre; }
    
    if (precio) { filter.precio = precio; }


    // Llamada al filto
    Anuncio.list(filter, limit, skip, sort, (err, anuncios) => {
        if (err) { return next(err) }

        res.json({ success: true, result: anuncios });
    });

});

// router.get('/', (req, res, next) => {
//     Anuncio.find({}).exec((err, anuncios) => {
//         if (err) { return next(err) };

//         res.json({success: true, result: anuncios});
//     });
// });


/* ---------------------------- POST ---------------------------- */

router.post('/', (req, res, next) => {
    const nuevoAnuncio = new Anuncio(req.body);

    nuevoAnuncio.save((err, anuncioGuardado) => {
        if (err) { return next(err) };

        res.json({success: true, result: anuncioGuardado});
    });
});


module.exports = router;