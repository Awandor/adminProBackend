const express = require( 'express' );

const Hospital = require( '../models/hospital' );

const middlewareAutenticacion = require( '../middlewares/autenticacion' );

const app = express(); // defino mi servidor express


// ==================================
// Obetener todos los usuarios
// ==================================

app.get( '/', ( req, res, next ) => {

  // find es un método de Mongoose

  // Esto busca entre todas las propiedades {} y nos devuelve todas las propiedades de cada hospital

  // Podemos especificar qué propiedades queremos recibir dentro de {}

  // Con la función populate podemos pedir de la colección usario tomar los valores nombre y email

  let desde = req.query.desde || 0;

  desde = Number( desde );

  Hospital.find( {} ).skip( desde ).limit( 5 ).populate( 'usuario', 'nombre email' ).exec( ( err, hospitales ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos cargando hospital',
        errors: err
      } );

    }

    // Vamos a contar el total de registros

    Hospital.count( {}, ( err, conteo ) => {

      res.status( 200 ).json( {
        ok: true,
        hospitales: hospitales, // En ES6 se puede poner sólo hospitales
        total: conteo
      } );

    } );

  } );

} );


// ==================================
// Crear un nuevo hospital
// ==================================

// Añadimos la funcion verificaToken del middleware pero sin ejecutarla como segundo argumento
app.post( '/', middlewareAutenticacion.verificaToken, ( req, res ) => {

  // body es de body parser, extraemos el body

  const body = req.body;

  // Creamos un nuevo objeto de tipo Usuario definido en models

  const hospital = new Hospital( {
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id
  } );

  hospital.save( ( err, hospitalGuardado ) => {

    if ( err ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: 'Error en base de datos creando hospital',
        errors: err
      } );

    }

    // Podemos añadir los datos del usuario que está creando nuevo hospital que nos viene añadido al req desde el middleware

    req.usuario.password = ':)';

    res.status( 201 ).json( {
      ok: true,
      usuario: hospitalGuardado,
      usuarioToken: req.usuario
    } );

  } );

} );


// ==================================
// Actualizar un hospital por id
// ==================================

app.put( '/:id', middlewareAutenticacion.verificaToken, ( req, res ) => {

  const id = req.params.id;

  const body = req.body;

  Hospital.findById( id, ( err, hospital ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos al buscar hospital',
        errors: err
      } );

    }

    if ( !hospital ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: `El hospital con id ${id} no existe`,
        errors: { message: 'No existe un hospital con ese id' }
      } );

    }

    hospital.nombre = body.nombre;
    hospital.img = body.img;
    hospital.usuario = req.usuario._id;

    hospital.save( ( err, hospitalGuardado ) => {

      if ( err ) {

        return res.status( 400 ).json( {
          ok: false,
          mensaje: 'Error en base de datos al actualizar hospital',
          errors: err
        } );

      }

      // En este punto el hospital ya ha sido guardado

      res.status( 201 ).json( {
        ok: true,
        hospital: hospitalGuardado
      } );

    } );

  } );

} );


// ==================================
// Borrar un hospital por id
// ==================================

app.delete( '/:id', middlewareAutenticacion.verificaToken, ( req, res ) => {

  const id = req.params.id;

  Hospital.findByIdAndRemove( id, ( err, hospitalBorrado ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos borrando hospital',
        errors: err
      } );

    }

    if ( !hospitalBorrado ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: `El hospital con id ${id} no existe`,
        errors: { message: 'No existe un hospital con ese id' }
      } );

    }

    res.status( 200 ).json( {
      ok: true,
      id: id,
      hospital: hospitalBorrado
    } );

  } );

} );


// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
