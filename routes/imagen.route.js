const express = require( 'express' );

const path = require( 'path' ); // Ya viene con node

const fs = require( 'fs' ); // Ya viene con node, file system tiene varias funciones

const app = express(); // defino mi servidor express


// Traemos la ruta principal de app.js

app.get( '/:tipo/:img', ( req, res, next ) => {

  const tipo = req.params.tipo;

  const img = req.params.img;

  // __dirname nos indica la ruta en este momento, no importa si en local o en servidor

  const pathImagen = path.resolve( __dirname, `../uploads/${tipo}/${img}` );


  if ( fs.existsSync( pathImagen ) ) {

    // res.send( pathImagen );

    res.sendFile( pathImagen );

  } else {

    const pathNoImagen = path.resolve( __dirname, '../assets/no-img.jpg' );

    // res.send( pathNoImagen );

    res.sendFile( pathNoImagen );

  }

  /* res.status( 200 ).json( {
    ok: true,
    mensaje: 'Petición realizada correctamente'
  } ); */

} );

// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
