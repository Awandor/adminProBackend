var express = require( 'express' );

var app = express(); // defino mi servidor express


// Traemos la ruta principal de app.js

app.get( '/', ( req, res, next ) => {

  res.status( 200 ).json( {
    ok: true,
    mensaje: 'Petición realizada correctamente'
  } );

} );

// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
