const express = require( 'express' );

const Medico = require( '../models/medico' );

const middlewareAutenticacion = require( '../middlewares/autenticacion' );

const app = express(); // defino mi servidor express


// ==================================
// Obetener todos los medicos
// ==================================

app.get( '/', ( req, res, next ) => {

  // find es un método de Mongoose

  // Esto busca entre todas las propiedades {} y nos devuelve todas las propiedades de cada hospital

  // Podemos especificar qué propiedades queremos recibir dentro de {}

  // Con la función populate podemos pedir de la colección usario tomar los valores nombre y email

  let desde = req.query.desde || 0;

  desde = Number( desde );

  Medico.find( {} ).skip( desde ).limit( 5 ).populate( 'usuario', 'nombre email' ).populate( 'hospital' ).exec( ( err, medicos ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos cargando médico',
        errors: err
      } );

    }

    // Vamos a contar el total de registros

    Medico.count( {}, ( err, conteo ) => {

      res.status( 200 ).json( {
        ok: true,
        medicos: medicos, // En ES6 se puede poner sólo hospitales
        total: conteo
      } );

    } );

  } );

} );


// ==================================
// Crear un nuevo medico
// ==================================

// Añadimos la funcion verificaToken del middleware pero sin ejecutarla como segundo argumento
app.post( '/', middlewareAutenticacion.verificaToken, ( req, res ) => {

  // body es de body parser, extraemos el body

  const body = req.body;

  // Creamos un nuevo objeto de tipo Usuario definido en models

  const medico = new Medico( {
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id,
    hospital: body.hospital
  } );

  medico.save( ( err, medicoGuardado ) => {

    if ( err ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: 'Error en base de datos creando medico',
        errors: err
      } );

    }

    // Podemos añadir los datos del usuario que está creando nuevo medico que nos viene añadido al req desde el middleware

    req.usuario.password = ':)';

    res.status( 201 ).json( {
      ok: true,
      usuario: medicoGuardado,
      usuarioToken: req.usuario
    } );

  } );

} );


// ==================================
// Actualizar un medico por id
// ==================================

app.put( '/:id', middlewareAutenticacion.verificaToken, ( req, res ) => {

  const id = req.params.id;

  const body = req.body;

  Medico.findById( id, ( err, medico ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos al buscar medico',
        errors: err
      } );

    }

    if ( !medico ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: `El médico con id ${id} no existe`,
        errors: { message: 'No existe un médico con ese id' }
      } );

    }

    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save( ( err, medicoGuardado ) => {

      if ( err ) {

        return res.status( 400 ).json( {
          ok: false,
          mensaje: 'Error en base de datos al actualizar médico',
          errors: err
        } );

      }

      // En este punto el medico ya ha sido guardado

      res.status( 201 ).json( {
        ok: true,
        medico: medicoGuardado
      } );

    } );

  } );

} );


// ==================================
// Borrar un medico por id
// ==================================

app.delete( '/:id', middlewareAutenticacion.verificaToken, ( req, res ) => {

  const id = req.params.id;

  Medico.findByIdAndRemove( id, ( err, medicoBorrado ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error en base de datos borrando médico',
        errors: err
      } );

    }

    if ( !medicoBorrado ) {

      return res.status( 400 ).json( {
        ok: false,
        mensaje: `El médico con id ${id} no existe`,
        errors: { message: 'No existe un medico con ese id' }
      } );

    }

    res.status( 200 ).json( {
      ok: true,
      id: id,
      medico: medicoBorrado
    } );

  } );

} );


// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
