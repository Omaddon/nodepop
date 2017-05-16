'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const customError = require('../../lib/customError');

/* ---------------------------- GET ---------------------------- */

router.get('/', (req, res, next) => {

    console.log(req.usuario);
    console.log(process.env.TOKENEXP);

    const filter = {};

    const tag = req.query.tag;
    const venta = req.query.venta;
    const nombre = req.query.nombre;
    const precio = req.query.precio;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.start);
    const sort = req.query.sort;

//localhost:3000/apiv1/anuncios?tag=mobile&venta=false&precio=50&limit=2&sort=precio

    // TAG (falla con 2 tags)
    if ((tag === 'work') || (tag === 'lifestryle') || (tag === 'motor') || (tag === 'mobile')) {
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
    

    Anuncio.list(filter, limit, skip, sort, fields, (err, anuncios) => {
        if (err) { 
            console.log('\n\n >>> ERROR AL LEER DE LA BD:\n' + err + '\n\n');
            return next(err) 
        }

        res.json({ success: true, result: anuncios });
    });
});


router.get('/tags', (req, res, next) => {
    const tags = ['work', 'lifestyle', 'motor', 'mobile'];
    res.send({success: true, tags: tags});
});


/* ---------------------------- POST ---------------------------- */

router.post('/', (req, res, next) => {
    const nuevoAnuncio = new Anuncio(req.body);

    nuevoAnuncio.save((err, anuncioGuardado) => {
        if (err) { return next(err) };

        res.json({success: true, result: anuncioGuardado});
    });
});


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


module.exports = router;