const express = require( 'express' );

const Usuario = require( '../models/usuario' );

const bcrypt = require( 'bcrypt' );

const jwt = require( 'jsonwebtoken' );

const SEED = require( '../config/config' ).SEED;

const app = express(); // defino mi servidor express

// ==================================
// Login
// ==================================

app.post( '/', ( req, res ) => {

  const body = req.body;

  Usuario.findOne( { email: body.email }, ( err, usuarioDB ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos al buscar usuario',
        errors: err
      } );

    }

    if ( !usuarioDB ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: 'Credenciales incorrectas - email',
        errors: err
      } );

    }

    if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: 'Credenciales incorrectas - password',
        errors: err
      } );

    }

    // Crear token

    const token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 14400 } ); // 4 horas

    // No queremos enviar password

    usuarioDB.password = ':)';

    res.status( 200 ).json( {
      ok: true,
      mensaje: 'login post correcto',
      usuario: usuarioDB,
      id: usuarioDB.id,
      token: token
    } );






  } );


} );



// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
