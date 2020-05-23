const express = require( 'express' );

const Hospital = require( '../models/hospital' );

const Medico = require( '../models/medico' );

const Usuario = require( '../models/usuario' );

const app = express(); // defino mi servidor express


// ==================================
// Búsqueda por colección
// ==================================

app.get( '/coleccion/:coleccion/:busqueda', ( req, res ) => {

  const coleccion = req.params.coleccion;

  const busqueda = req.params.busqueda;

  const regex = new RegExp( busqueda, 'i' );

  /* if ( coleccion === 'hospitales' ) {

    Hospital.find( { nombre: regex }, ( err, hospitales ) => {

      return res.status( 200 ).json( {

        ok: true,
        hospitales: hospitales,

      } );

    } );

  } else if ( coleccion === 'medicos' ) {

    Medico.find( { nombre: regex }, ( err, medicos ) => {

      return res.status( 200 ).json( {

        ok: true,
        medicos: medicos,

      } );

    } );

  } else if ( coleccion === 'usuarios' ) {

    Usuario.find( { nombre: regex }, ( err, usuarios ) => {

      return res.status( 200 ).json( {

        ok: true,
        usuarios: usuarios,

      } );

    } );

  } else {
    
    return res.status( 400 ).json( {
      ok: false,
      mensaje: 'Los tipos de búsqueda sólo son: usuarios, médicos y hospitales'
    } );

  }  */

  // Otra manera de hacerlo es utilizar las promesas que ya tenemos y en vez de encadenarlas usamos un switch

  let promesa;

  switch ( coleccion ) {

    case 'usuarios':
      promesa = buscarUsuarios( busqueda, regex );
      break;

    case 'hospitales':
      promesa = buscarHospitales( busqueda, regex );
      break;

    case 'medicos':
      promesa = buscarMedicos( busqueda, regex );
      break;

    default:
      return res.status( 400 ).json( {
        ok: false,
        mensaje: 'Los tipos de búsqueda sólo son: usuarios, médicos y hospitales',
        error: { message: 'Tipo colección no válido' }
      } );
  }

  promesa.then( resultado => {

    // INTERESANTE usamos propiedades computadas, al usar [] ese nombre es una variable

    res.status( 200 ).json( {
      ok: true,
      [ coleccion ]: resultado
    } );

  } );

} );




// ==================================
// Búsqueda general
// ==================================

app.get( '/todo/:busqueda', ( req, res, next ) => {

  const busqueda = req.params.busqueda;

  // Cuando usamos /nombre/i indicamos que contenga la palabra y con i no tiene en cuenta mayúsculas

  // Hospital.find( { nombre: /san/i }, ( err, hospitales ) => {

  const regex = new RegExp( busqueda, 'i' );

  /* Hospital.find( { nombre: regex }, ( err, hospitales ) => {

    res.status( 200 ).json( {
      ok: true,
      hospitales: hospitales
    } );

  } ); */

  // Con Promise.all( [] ) podemos encadenar promesas en un arreglo y al final disparar un único then que será un arreglo de respuestas

  Promise.all( [ buscarHospitales( busqueda, regex ), buscarMedicos( busqueda, regex ), buscarUsuarios( busqueda, regex ) ] ).then( resultado => {

    res.status( 200 ).json( {
      ok: true,
      hospitales: resultado[ 0 ],
      medicos: resultado[ 1 ],
      usuarios: resultado[ 2 ]
    } );

  } );

  /* buscarHospitales( busqueda, regex ).then( hospitales => {

    res.status( 200 ).json( {
      ok: true,
      hospitales: hospitales
    } );

  } );

  buscarMedicos( busqueda, regex ).then( medicos => {

    res.status( 200 ).json( {
      ok: true,
      medicos: medicos
    } );

  } );

  buscarUsuarios( busqueda, regex ).then( usuarios => {

    res.status( 200 ).json( {
      ok: true,
      usuarios: usuarios
    } );

  } ); */

} );

// Para poder realizar múltiples búsquedas lo realizamos de forma asíncrona con promesas

function buscarHospitales( busqueda, regex ) {

  return new Promise( ( resolve, reject ) => {

    Hospital.find( { nombre: regex } ).populate( 'usuario', 'nombre email' ).exec( ( err, hospitales ) => {

      if ( err ) {

        reject( 'Error al cargar hospitales', err );

      } else {

        resolve( hospitales );

      }

    } );

  } );

}

function buscarMedicos( busqueda, regex ) {

  return new Promise( ( resolve, reject ) => {

    Medico.find( { nombre: regex } ).populate( 'usuario', 'nombre email' ).populate( 'hospital' ).exec( ( err, medicos ) => {

      if ( err ) {

        reject( 'Error al cargar médicos', err );

      } else {

        resolve( medicos );

      }

    } );

  } );

}

function buscarUsuarios( busqueda, regex ) {

  return new Promise( ( resolve, reject ) => {

    // Vamos a buscar simultáneamente en dos propiedades de la colección nombre e email
    // para ello usamos la función or que recibe un arreglo de objetos de condiciones

    Usuario.find( {}, 'nombre email role' ).or( [ { 'nombre': regex }, { 'email': regex } ] ).exec( ( err, usuarios ) => {

      if ( err ) {

        reject( 'Error al cargar médicos', err );

      } else {

        resolve( usuarios );

      }

    } );

  } );

}

// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
