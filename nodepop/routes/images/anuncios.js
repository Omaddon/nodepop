'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const customError = require('../../lib/customError');

/* ---------------------------- GET ---------------------------- */

router.get('/:foto', (req, res, next) => {
    const ruta = path.join(__dirname, '../../public/images', req.params.foto);
    
    res.sendFile(ruta);
});


/* ---------------------------- err ---------------------------- */

router.use((err, req, res, next) => {

    let idioma = 'es';
    console.log('\n' + err + '\n');

    if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
        idioma = req.headers.language;
    }
    
    customError(error, idioma)
      .then((miError) => {
        res.json({success: false, error: miError})
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;