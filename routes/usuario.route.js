const express = require( 'express' );

const Usuario = require( '../models/usuario' );

const bcrypt = require( 'bcrypt' );

// const jwt = require( 'jsonwebtoken' );

// const SEED = require( '../config/config' ).SEED;

const middlewareAutenticacion = require( '../middlewares/autenticacion' );

const app = express(); // defino mi servidor express

// Traemos la ruta principal de app.js

// ==================================
// Obetener todos los usuarios
// ==================================

app.get( '/', ( req, res, next ) => {

  // find es un método de Mongoose

  /* Usuario.find({}, (err, usuarios) => {

      if (err) {

          return res.status(500).json({
              ok: false,
              mensaje: 'Error en base de datos cargando usuario',
              errors: err
          });

      }

      res.status(200).json({
          ok: true,
          usuarios: usuarios // En ES6 se puede poner sólo usuarios
      });

  }); */

  // Esto busca entre todas las propiedades {} y nos devuelve todas las propiedades de cada usuario

  // Podemos especificar qué propiedades queremos recibir

  Usuario.find( {}, 'nombre email img role' ).exec( ( err, usuarios ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos cargando usuario',
        errors: err
      } );

    }

    res.status( 200 ).json( {
      ok: true,
      usuarios: usuarios // En ES6 se puede poner sólo usuarios
    } );

  } );

} );


// ==================================
// Crear un nuevo usuario
// ==================================

// Añadimos la funcion verificaToken del middleware pero sin ejecutarla como segundo argumento
app.post( '/', middlewareAutenticacion.verificaToken, ( req, res ) => {

  // body es de body parser, extraemos el body

  const body = req.body;

  // Creamos un nuevo objeto de tipo Usuario definido en models

  const usuario = new Usuario( {
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10 ), // Encriptamos contraseña
    img: body.img,
    role: body.role
  } );

  usuario.save( ( err, usuarioGuardado ) => {

    if ( err ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: 'Error en base de datos creando usuario',
        errors: err
      } );

    }

    // Podemos añadir los datos del usuario que está creando nuevo usuario que nos viene añadido al req desde el middleware

    res.status( 201 ).json( {
      ok: true,
      usuario: usuarioGuardado,
      usuarioToken: req.usuario
    } );

  } );

} );


// ==================================
// Verificar token
// ==================================

/* app.use( '/', ( req, res, next ) => {

  const token = req.query.token;

  jwt.verify( token, SEED, ( err, decoded ) => {

    if ( err ) {

      return res.status( 401 ).json( {
        ok: false,
        mensaje: 'Error en base de datos cargando usuario',
        errors: err
      } );

    }

    // next() permite que el código siga de lo contrario se queda parado en el middleware

    next();

  } );

} ); */

// Pero esta no es la manera adecuada de hacerlo pues no ofrece mucha flexibilidad pues siempre se va a aplicar
// A veces queremos validar el token y otras veces no. Lo modulamos para poder llamarlo cuando queramos


// ==================================
// Actualizar un usuario por id
// ==================================

app.put( '/:id', middlewareAutenticacion.verificaToken, ( req, res ) => {

  const id = req.params.id;

  const body = req.body;

  Usuario.findById( id, ( err, usuario ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos al buscar usuario',
        errors: err
      } );

    }

    if ( !usuario ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: `El usuario con id ${id} no existe`,
        errors: { message: 'No existe un usuario con ese id' }
      } );

    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save( ( err, usuarioGuardado ) => {

      if ( err ) {

        return res.status( 400 ).json( {
          ok: false,
          mensaje: 'Error en base de datos al actualizar usuario',
          errors: err
        } );

      }

      // En este punto el usuario ya ha sido guardado

      // En la respuesta no queremos mostrar la contraseña encriptada

      usuarioGuardado.password = ':)';

      res.status( 201 ).json( {
        ok: true,
        usuario: usuarioGuardado
      } );

    } );

  } );

} );


// ==================================
// Borrar un usuario por id
// ==================================

app.delete( '/:id', middlewareAutenticacion.verificaToken, ( req, res ) => {

  const id = req.params.id;

  Usuario.findOneAndRemove( id, ( err, usuarioBorrado ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos borrando usuario',
        errors: err
      } );

    }

    if ( !usuarioBorrado ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: `El usuario con id ${id} no existe`,
        errors: { message: 'No existe un usuario con ese id' }
      } );

    }

    res.status( 200 ).json( {
      ok: true,
      usuario: usuarioBorrado
    } );

  } );

} );


// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
