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
    console.log(err);
    customError(err, 'es', (miError) => {
        console.log('miError:', miError);
        res.json({success: false, error: miError});
        return;
    });
});

module.exports = router;