// ==================================
// Requires
// ==================================

var express = require( 'express' );

var mongoose = require( 'mongoose' );

var bodyParser = require( 'body-parser' );


// ==================================
// Inicializar variables
// ==================================

var app = express(); // defino mi servidor express

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// parse application/json
app.use( bodyParser.json() );


// ==================================
// Conexión a la base de datos
// ==================================

mongoose.connection.openUri( 'mongodb://localhost:27017/hospitalDB', ( error, response ) => {

  if ( error ) throw error; // Si se ejecuta el script se detiene

  console.log( 'Base de datos: \x1b[32m%s\x1b[0m', 'online' );

} );
// hospitalDB es el nombre de la base de datos, si no está creada se creará

// ==================================
// Serer Index config
// ==================================

var serveIndex = require( 'serve-index' );

app.use( express.static( __dirname + '/' ) );

app.use( '/uploads', serveIndex( __dirname + '/uploads' ) );

// De esta manera no se controla la capeta de imágenes, un usuario tendría acceso a todas las imágenes si conoce la ruta



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
var appRoute = require( './routes/app.route' );

var usuarioRoute = require( './routes/usuario.route' );

var loginRoute = require( './routes/login.route' );

var hospitalRoute = require( './routes/hospital.route' );

var medicoRoute = require( './routes/medico.route' );

var busquedaRoute = require( './routes/busqueda.route' );

var uploadRoute = require( './routes/upload.route' );

var imagenRoute = require( './routes/imagen.route' );


// Ahora para utilizar appRoute vamos a declarar un middleware que es algo que se ejecuta antes de que se resuelvan otras rutas

app.use( '/usuario.route', usuarioRoute ); // Cuando cualquier petición coincida con la ruta quiero que se ejecute usuarioRoutes
app.use( '/login.route', loginRoute );
app.use( '/hospital.route', hospitalRoute );
app.use( '/medico.route', medicoRoute );
app.use( '/busqueda.route', busquedaRoute );
app.use( '/upload.route', uploadRoute );
app.use( '/imagen.route', imagenRoute );

app.use( '/', appRoute ); // Tiene que ser la última ruta

// ==================================
// Escuchar peticiones al servidor express
// ==================================

app.listen( 3000, () => console.log( 'Express server running on port 3000: \x1b[32m%s\x1b[0m', 'online' ) ); // puerto 3000
