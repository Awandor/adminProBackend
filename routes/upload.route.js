const express = require( 'express' );

const fileUpload = require( 'express-fileupload' );

const Hospital = require( '../models/hospital' );

const Medico = require( '../models/medico' );

const Usuario = require( '../models/usuario' );

const fs = require( 'fs' ); // File system tool

const app = express(); // defino mi servidor express


// default options
app.use( fileUpload() );

/* app.post( '/upload.route', function( req, res ) {
  if ( !req.files || Object.keys( req.files ).length === 0 ) {
    return res.status( 400 ).send( 'No files were uploaded.' );
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv( '/somewhere/on/your/server/filename.jpg', function( err ) {
    if ( err )
      return res.status( 500 ).send( err );

    res.send( 'File uploaded!' );
  } );
} ); */

app.put( '/:tipo/:id', ( req, res, next ) => {

  const tipo = req.params.tipo;

  const id = req.params.id;

  const tiposColeccionValidos = [ 'usuarios', 'hospitales', 'medicos' ];

  if ( tiposColeccionValidos.indexOf( tipo ) < 0 ) {

    return res.status( 400 ).json( {
      ok: false,
      mensaje: 'Tipo colección no válido',
      error: { message: `Los tipos de colección válidos son: ${tiposColeccionValidos.join(', ')}` }
    } );

  }

  if ( !id ) {

    return res.status( 400 ).json( {
      ok: false,
      mensaje: 'Tiene que especificar un id',
      error: { message: 'No hay id' }
    } );

  }

  if ( !req.files ) {

    return res.status( 400 ).json( {
      ok: false,
      mensaje: 'No ha seleccionado imagen',
      errors: { message: 'Debe seleccionar una imagen' }
    } );

  }



  // Obtener nombre del archivo

  const archivo = req.files.imagen;

  const arregloNombreArchivo = archivo.name.split( '.' );

  const extensionArchivo = arregloNombreArchivo[ arregloNombreArchivo.length - 1 ];

  // Validamos extensiones

  const extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg' ];

  if ( extensionesValidas.indexOf( extensionArchivo ) < 0 ) {

    return res.status( 400 ).json( {
      ok: false,
      mensaje: `Tipo de imagen no válida: ${ extensionArchivo }`,
      errors: { message: `Los tipo de imágenes permitidas son: ${ extensionesValidas.join(', ') }` }
    } );

  }

  // Personalizamos el nombre para que sea único y no sobreescriba algún otro

  const nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

  // Mover el archivo del temporal a un path

  const path = `./uploads/${ tipo }/${ nombreArchivo }`;

  // La función mv (move)

  archivo.mv( path, ( err ) => {

    if ( err ) {

      return res.status( 500 ).json( {
        ok: false,
        mensaje: 'Error al mover el archivo',
        errors: err
      } );

    }

    subirPorTipo( tipo, id, nombreArchivo, res );

    /* res.status( 200 ).json( {
      ok: true,
      mensaje: 'Archivo guardado',
      extension: extensionArchivo,
      nombre: nombreArchivo,
      path: path
    } ); */

  } );

} );

function subirPorTipo( tipo, id, nombreArchivo, res ) {

  const tiposColeccion = [ {
      coleccion: 'usuarios',
      modelo: Usuario,
      nombre: 'usuario'
    },
    {
      coleccion: 'medicos',
      modelo: Medico,
      nombre: 'medico'
    },
    {
      coleccion: 'hospitales',
      modelo: Hospital,
      nombre: 'hospital'
    },
  ];

  tiposColeccion.forEach( ( value ) => {

    if ( tipo === value.coleccion ) {

      // res.send( typeof tiposColeccion[ 0 ].modelo );

      value.modelo.findById( id, ( err, obj ) => {

        if ( err ) {

          return res.status( 500 ).json( {
            ok: false,
            mensaje: `Error al buscar ${value.nombre}`,
            errors: {
              message: `Error trying to get _id property of object ${value.nombre}. ${err}`,
              reason: `The object with _id ${value.nombre} does not exist. ${err.reason}`
            }
          } );

        }

        const pathViejo = `./uploads/${value.coleccion}/${obj.img}`;

        // Borrar si existe imagen anterior
        if ( fs.existsSync( pathViejo ) ) {

          fs.unlinkSync( pathViejo );

        }

        obj.img = nombreArchivo;

        obj.save( ( err, objActualizado ) => {

          if ( err ) {

            return res.status( 500 ).json( {
              ok: false,
              mensaje: 'Error al guardar el archivo',
              errors: {
                message: `Error saving file ${nombreArchivo}. ${err}`,
                reason: `Internal Server Error`
              }
            } );

          }

          objActualizado.password = ':)';

          return res.status( 200 ).json( {
            ok: true,
            mensaje: 'Archivo guardado',
            nombre: nombreArchivo,
            pathViejo: pathViejo,
            [ value.nombre ]: objActualizado
          } );

        } );

      } );


    }

  } );

}

// Para poder usar este archivo fuera necesito exportarlo

module.exports = app;
