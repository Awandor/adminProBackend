## MEAN

Vamos a crear un backend server en Node para que de servicios a nuestra app adminPro en Angular

Para ello usaremos el servidor Express que corre en Node y usaremos la base de datos no relacional Mongo

Creamos una nueva carpeta de proyecto y dentro de ella ejecutamos:

`npm init`

Nos hace una serie de preguntas, todas se pueden cambiar después, se pueden
tomar las que se ofrecen por defecto

se crea un package.json con la configuración, podemos editar a gusto este archivo y guardar

Instalamos `express.js`

Vamos a usar este servidor porque es muy fácil hacer peticiones o servicios Rest en el lado de Node

Node es sencillamente js corriendo de lado del servidor.

Todo nuestro js va a poder correr en este servidor express

`npm install express --save`

Creamos un archivo app.js es muy importante poque es el punto de entrada a nuestra aplicación y donde va estar
la mayor parte del código

En el back-end las variables son case sensitive


Para arrancar el servidor `node app`


## COLORES PARA LA CONSOLA

Colores para la consola
Reset = "\x1b[0m"

Bright = "\x1b[1m"

Dim = "\x1b[2m"

Underscore = "\x1b[4m"

Blink = "\x1b[5m"

Reverse = "\x1b[7m"

Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"

FgRed = "\x1b[31m"

FgGreen = "\x1b[32m"

FgYellow = "\x1b[33m"

FgBlue = "\x1b[34m"

FgMagenta = "\x1b[35m"

FgCyan = "\x1b[36m"

FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"

BgRed = "\x1b[41m"

BgGreen = "\x1b[42m"

BgYellow = "\x1b[43m"

BgBlue = "\x1b[44m"

BgMagenta = "\x1b[45m"

BgCyan = "\x1b[46m"

BgWhite = "\x1b[47m"


## CAMBIOS EN EL BACK END

Cada vez que hacemos un cambio en el back-end tenemos que bajar y levantar el servidor de nuevo

Para ello instalamos una librería nodemon de forma global desde una consola con permisos de Administrador

`npm install -g nodemon`

Editamos package.json y en scripts añadimos línea `"start": "nodemon app.js",`

Bajamos el servidor y lo levantamos con el nuevo script `npm start`

y ya lo recarga automáticamente cada vez que guardemos un cambio.


## MONGO DB

Documentación: `https://docs.mongodb.com/manual/installation/`

Nos vamos a `Install MongoDB Community Edition on Windows` y lo instalamos como servicio windows

Una vez instalado creamos carpeta en la unidad `c:\data\db`

Ejecutamos desde otra consola con permisos de Administrador `"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"`


## ROBO 3T

Instalamos Robo 3T que no ayudará a trabajar con la base de datos Mongo
`https://robomongo.org/download`


## MONGOOSE

Nos ayda a conectar node a la bbdd Mongo
Instalamos Mongoose.js de `https://mongoosejs.com/`

Getting started > `npm install mongoose --save` --save porque es una dependencia obligatoria para la app


## GIT

Creamos un repositorio remoto en Github

Iniciamos el repositorio local > `git init`

Añadimos todos los cambios al stage > `git add .`

Vemos el status > `git status`

Se han añadido demasiado archivos

Sacamos todo del stage > `git reset`

Creamos el archivo `.gitignore` y añadimos la carpeta node_modules

Añadimos todos los cambios al stage > `git add .`

Realizamos el primer commit `git commit -m "Primer commit"`

Enlazamos el repositorio local al repositorio remoto `git remote add origin https://github.com/Awandor/adminProBackend.git`

Subimos los cambios al repositorio remoto `git push -u origin master`

Creamos un tag > `git tag -a v0.0.1 -m "Instalaciones y configuraciones básicas"`

Subimos el tag al repositorio remoto > `git push --tags`

Creamos un Release en Github


## CREAR BASE DE DATOS Y PRIMERA COLECCION

Ejecutamos desde otra consola con permisos de Administrador `"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"` para arrancar Mongo

Abrimos `Robo 3T`, nos conectamos a `Localhost`, creamos base de datos `hospitalDB` y en ella creamos colección `usuarios` para crear un
nuevo registro vamos a `insertar documento`. Lo que se inserta son objetos JSON, guardamos y para ver el registro doble click en la colección,
si se ha hecho alguna modificación en la colección que no vemos damos al botón play


## CREAR MODELO DE USUARIOS EN EL BACK-END

Los modelos son controladores de la base de datos. Gracias a Mongoose tenemos cantidades de métodos que nos facilitan esto.

Creamos una carpeta `models` y dentro un archivo `usuario.js`


# CREAR RUTAS DE LOS SERVICIOS DEL USUARIO

Creamos carpeta `routes` y en ella vamos a ir creando archivos con las rutas para ir modulando la app.

Creamos archivo `app.route.js`

Levantamos la app con `npm start` y comprobamos en Postman también que todo funciona


## ARCHIVO JSHint

Para evitar los warnings de ES6 de
creamos archivo `.jshintrc`


## BODY PARSER NODE

Node.js body parsing middleware.
Instalamos desde `https://www.npmjs.com/package/body-parser`

`npm install body-parser --save`

Importamos la librería en `app.js`

De la parte de Ejemplos tomamos la que dice // parse application/x-www-form-urlencoded

## MONGOOSE UNIQUE VALIDATOR

Instalamos el plug-in de Mongoose

`npm install mongoose-unique-validator --save`

Utilizamos este plug-in en el modelo usuario


## NODE BCYPT

Instalamos la librería node.bcrypt.js de `https://www.npmjs.com/package/bcrypt` que encripta en una sóla via, no se puede recontruir.

`npm install bcrypt --save`

Importamos la librería en `usuario.route.js`


## POSTMAN

Al hacer pruebas de POST (añadir), PUT (actualizar) hay que seleccionar en `Body` la opción `x-www-form-urlencoded`


## JSON WEB TOKEN

Instalamos la librería jsonwebtoken de `https://www.npmjs.com/package/jsonwebtoken`

`npm install jsonwebtoken --save`

Importamos la librería en `login.route.js`

Para ver cómo funciona el token podemos copiar el token generado e ir a `https://jwt.io` y pegarlo ahí. Vemos las partes del token y la
información que contiene. Copiamos nuestro seed y lo pegamos en Verify Signature.

Creamos carpeta `config` y dentro un archivo nuevo `config.js` ahí copiamos nuestro seed. Lo importamos a `login.route.js`

Vamos a optimizar nuestro middleware para darle flexibilidad, primero lo modulamos creamos carpeta `middlewares` y dentro archivo nuevo `autenticacion.js`
y lo importamos en `usuario.route.js`