## Vamos a crear un backend server en node

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

Nos vamos a `Install MongoDB Community Edition on Windows`

Una vez instalado creamos carpeta en la unidad `c:\data\db`

Ejecutamos desde consola con permisos de Administrador `"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\data\db"`

Ejecutamos desde otra consola con permisos de Administrador `"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"`


Instalamos Robo 3T 
`https://robomongo.org/download`


## MONGOOSE

Nos ayda a conectar node a la bbdd Mongo
Instalamos Mongoose.js de `https://mongoosejs.com/`

Getting started > `npm install mongoose --save` --save porque es una dependencia obligatoria para la app


## GIT

Iniciamos el repositorio local > `git init`

Añadimos todos los cambios al stage > `git add .`

Vemos el status > `git status`

Se han añadido demasiado archivos

Sacamos todo del stage > `git reset`

Creamos el archivo `.gitignore` y añadimos la carpeta node_modules