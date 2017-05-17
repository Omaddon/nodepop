'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const tags = require('../../lib/tags');
const customError = require('../../lib/customError');

/* ---------------------------- GET /apiv1/anuncios ---------------------------- */

router.get('/', (req, res, next) => {

    const filter = {};

    const tag = req.query.tag;
    const venta = req.query.venta;
    const nombre = req.query.nombre;
    const precio = req.query.precio;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.start);
    const sort = req.query.sort;
    const includeTotal = req.query.includeTotal;

    // TAG (falla con 2 tags)
    if (tags.indexOf(tag) >= 0) {
        filter.tags = tag;
    }

    // VENTA
    if ((venta === 'true') || (venta === 'false')) {
        filter.venta = venta;
    }

    // NOMBRE
    if (nombre) { 
        filter.nombre = new RegExp('^' + req.query.nombre, "i"); 
    }
    
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

    // Fields (para eliminar _id y __v)
    const fields = { '_id': 0, '__v': 0 };    

    // INCLUDETOTAL
    let numAnuncios;

    if (includeTotal === 'true') {
        numAnuncios = Anuncio.list(filter);
    } 

    const buscar = Anuncio.list(filter, limit, skip, sort, fields);

    Promise.all([numAnuncios, buscar])
        .then(result => {
            if (numAnuncios) {
                res.json({
                    success: true,
                    result: { numAnuncios: result[0].length, anuncios: result[1] }
                });
            } else {
                res.json({
                    success: true,
                    result: { anuncios: result[1] }
                });
            }
        })
        .catch(error => {
            return res.json({ success: false, codeError: error.code, error: error.message });
        });
});


/* ---------------------------- GET /apiv1/anuncios/tags ---------------------------- */

router.get('/tags', (req, res, next) => {
    return res.json({success: true, tags: tags});
});


/* ---------------------------- POST /apiv1/anuncios ---------------------------- */

router.post('/', (req, res, next) => {
    const nuevoAnuncio = new Anuncio(req.body);

    nuevoAnuncio.save((err, anuncioGuardado) => {
        if (err) { return next(err) };

        return res.json({success: true, result: anuncioGuardado});
    });
});


/* ---------------------------- err ---------------------------- */

router.use((err, req, res, next) => {
    
    let idioma = 'es';

    if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
        idioma = req.headers.language;
    }
   
    return customError(err, idioma)
      .then((miError) => {
        return res.json({ success: false, codeError: miError.code, error: miError.message });
      })
      .catch((err) => {
        return next(err);
      });
});


module.exports = router;