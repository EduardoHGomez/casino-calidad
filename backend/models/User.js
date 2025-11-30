const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { MIN_AGE, MAX_AGE, INITIAL_BALANCE } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  age: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [MIN_AGE, `Debes tener al menos ${MIN_AGE} años`],
    max: [MAX_AGE, `La edad máxima es ${MAX_AGE} años`]
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // Rendimiento: índice para búsquedas rápidas
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  balance: {
    type: Number,
    default: INITIAL_BALANCE,
    min: [0, 'El balance no puede ser negativo']
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// PATRÓN: Hook Pre-Save para hashear password
// Seguridad: RF-1 - Contraseñas cifradas con bcrypt
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const { bcryptRounds } = require('../config/env');
    this.password = await bcrypt.hash(this.password, bcryptRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords (para login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para ocultar password en respuestas JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // No enviar password al cliente
  return user;
};

module.exports = mongoose.model('User', userSchema);