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

//tag=mobile&venta=false&nombre=iPhone%203GS&precio=50&limit=2&sort=precio

    // TAG*
    // filter.tags = {'$in': [tag]};

    // VENTA
    if ((venta === 'true') || (venta === 'false')) {
        filter.venta = venta;
    }

    // NOMBRE*
    if (nombre) { filter.nombre = nombre; }
    
    // PRECIO
    if (typeof(precio) !== 'undefined') { 
        if (precio.endsWith('-')){
            filter.precio = { '$gte': parseInt(precio.replace('-','')) }; 
        } else if (precio.startsWith('-')) {
            filter.precio = { '$lte': parseInt(precio.replace('-','')) }; 
        } else if (!precio.includes('-')) {
            filter.precio = parseInt(precio);
        } else {
            const precioArray = precio.split('-');
            filter.precio = { '$gte': precioArray[0], '$lte': precioArray[1] };
        }
    }


    Anuncio.list(filter, limit, skip, sort, (err, anuncios) => {
        if (err) { return next(err) }

        res.json({ success: true, result: anuncios });
        return;
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