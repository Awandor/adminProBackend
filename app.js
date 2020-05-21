// ==================================
// Requires
// ==================================

var express = require( 'express' );

var mongoose = require( 'mongoose' );

var bodyParser = require( 'body-parser' )


// ==================================
// Inicializar variables
// ==================================

var app = express(); // defino mi servidor express

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) )

// parse application/json
app.use( bodyParser.json() )


// ==================================
// Conexión a la base de datos
// ==================================

mongoose.connection.openUri( 'mongodb://localhost:27017/hospitalDB', ( error, response ) => {

  if ( error ) throw error; // Si se ejecuta el script se detiene

  console.log( 'Base de datos: \x1b[32m%s\x1b[0m', 'online' );

} );
// hospitalDB es el nombre de la base de datos, si no está creada se creará


// ==================================
// Rutas
// ==================================

// Hemos modulado la ruta ahora tenemos que importarla
/* app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

}); */
var appRoutes = require( './routes/app.route' );

var usuarioRoutes = require( './routes/usuario.route' );

var loginRoutes = require( './routes/login.route' );

// Ahora para utilizar appRoutes vamos a declarar un middleware que es algo que se ejecuta antes de que se resuelvan otras rutas

app.use( '/', appRoutes ); // Cuando cualquier petición coincida con la ruta quiero que se ejecute appRoutes
app.use( '/usuario.route', usuarioRoutes ); // Cuando cualquier petición coincida con la ruta quiero que se ejecute usuarioRoutes
app.use( '/login.route', loginRoutes ); // Cuando cualquier petición coincida con la ruta quiero que se ejecute appRoutes


// ==================================
// Escuchar peticiones al servidor express
// ==================================

app.listen( 3000, () => console.log( 'Express server running on port 3000: \x1b[32m%s\x1b[0m', 'online' ) ); // puerto 3000
