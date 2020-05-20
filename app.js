// Requires
var express = require('express');

var mongoose = require('mongoose');


// Inicializar variables
var app = express(); // defino mi servidor express



// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {

    if (error) throw error; // Si se ejecuta el script se detiene

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});
// hospitalDB es el nombre de la base de datos, si no está creada se creará


// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});

// Escuchar peticiones al servidor express
app.listen(3000, () => console.log('Express server running on port 3000: \x1b[32m%s\x1b[0m', 'online')); // puerto 3000