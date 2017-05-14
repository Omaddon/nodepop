'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

/* ---------------------------- GET ---------------------------- */

router.get('/:foto', (req, res, next) => {
    const ruta = path.join(__dirname, '../../public/images', req.params.foto);
    
    res.sendFile(ruta);
});

module.exports = router;