const express = require( 'express' );

const Usuario = require( '../models/usuario' );

const bcrypt = require( 'bcrypt' );

const jwt = require( 'jsonwebtoken' );

const SEED = require( '../config/config' ).SEED;

const CLIENT_ID = require( '../config/config' ).CLIENT_ID;

const { OAuth2Client } = require( 'google-auth-library' );

const client = new OAuth2Client( CLIENT_ID );

const app = express(); // defino mi servidor express


// ==================================
// Login con cuenta de Google
// ==================================

// async de ES8 indica que la función va a retornar una promesa así que podemos usar el then y catch

async function verify( token ) {
  const ticket = await client.verifyIdToken( {
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  } );

  const payload = ticket.getPayload();

  // const userid = payload[ 'sub' ];

  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };

}


app.post( '/google', async( req, res ) => {

  const token = req.body.token; // key del Postman

  const googleUser = await verify( token ).catch( err => {

    return res.status( 403 ).json( {
      ok: false,
      mensaje: 'Token no válido'
    } );

  } );

  // Creamos un registro en nuestra colección de usuarios

  Usuario.findOne( { email: googleUser.email }, ( err, usuarioDB ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos al buscar usuario',
        errors: err
      } );

    }

    if ( usuarioDB ) {

      if ( usuarioDB.google === false ) {

        return res.status( 400 ).json( {
          ok: false,
          mensaje: 'Debe usar su autenticación normal'
        } );

      }

      // Crear token

      const token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 28800 } ); // 8 horas

      // No queremos enviar password

      usuarioDB.password = ':)';

      res.status( 200 ).json( {
        ok: true,
        mensaje: 'login con Google correcto',
        usuario: usuarioDB,
        id: usuarioDB.id,
        token: token
      } );

    } else {

      // El usuario no existe, hay que crearlo, añadimos propiedad google al modelo Usuario

      const usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save( ( err, usuarioDB ) => {

        if ( err ) {

          return res.status( 500 ).json( {
            ok: false,
            mensaje: 'Error en base de datos al guardar usuario',
            errors: err
          } );

        }

        // Crear token

        const token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 28800 } ); // 8 horas

        res.status( 200 ).json( {
          ok: true,
          mensaje: 'usuario añadido a base de datos, login con Google correcto',
          usuario: usuarioDB,
          id: usuarioDB._id,
          img: usuarioDB.img,
          token: token
        } );

      } );

    }

  } );

  /* return res.status( 200 ).json( {
    ok: true,
    mensaje: 'login Google correcto',
    googleUser: googleUser
  } ); */

} );


// ==================================
// Login normal
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

    const token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 28800 } ); // 8 horas

    // No queremos enviar password

    usuarioDB.password = ':)';

    res.status( 200 ).json( {
      ok: true,
      mensaje: 'login correcto',
      usuario: usuarioDB,
      id: usuarioDB.id,
      token: token
    } );

  } );

} );



// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
