const mongoose = require( 'mongoose' );

const uniqueValidator = require( 'mongoose-unique-validator' );

const Schema = mongoose.Schema;

const rolesValidos = {
  values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
  message: '{VALUE} no es un rol permitido'
};

const usuarioSchema = new Schema( {
  nombre: { type: String, required: [ true, 'El nombre es obligatorio' ] },
  email: { type: String, unique: true, required: [ true, 'El email es obligatorio' ] },
  password: { type: String, required: [ true, 'La contraseña es obligatoria' ] },
  img: { type: String, required: false },
  role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
} );

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} ya existe en la base de datos' } ); // {PATH} es el nombre de la propiedad


// Para usar nuestro usuarioSchema fuera de este archivo usamos module de Node

module.exports = mongoose.model( 'Usuario', usuarioSchema );
