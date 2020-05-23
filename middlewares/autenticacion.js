const jwt = require( 'jsonwebtoken' );

const SEED = require( '../config/config' ).SEED;



// ==================================
// Verificar token
// ==================================

// Para poder usar este archivo fuera necesito exportarlo

exports.verificaToken = ( req, res, next ) => {

  const token = req.query.token;

  jwt.verify( token, SEED, ( err, decoded ) => {

    if ( err ) {

      return res.status( 401 ).json( {
        ok: false,
        mensaje: 'Error en base de datos cargando usuario',
        errors: err
      } );

    }

    req.usuario = decoded.usuario;

    // next() permite que el código siga de lo contrario se queda parado en el middleware

    next();

    /* res.status( 200 ).json( {
      ok: true,
      decoded: decoded
    } ); */

  } );

}
