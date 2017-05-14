'use strict';

module.exports = (req, res, next) => {
    // Ejemplo de paso de objeto a la vista
    res.render('errorAPI', {
        title: 'Express',
        valor: '<script>alert("cuidado!")</script>',
        condicion: {
        segundo: segundo,
        estado: segundo % 2 === 0
        },
        users: [
        { name: 'Smith', age: 42},
        { name: 'Thomas', age: 32},
        { name: 'Jones', age: 25}
        ]
    });
};