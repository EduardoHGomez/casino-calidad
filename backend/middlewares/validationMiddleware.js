const { ValidationError } = require('../utils/errorTypes');
const { MIN_BET, MAX_BET } = require('../config/constants');

// Validar datos de registro
function validateRegister(req, res, next) {
  const { name, age, email, password } = req.body;

  if (!name || !age || !email || !password) {
    return next(new ValidationError('Todos los campos son obligatorios'));
  }

  if (age < 18) {
    return next(new ValidationError('Debes tener al menos 18 años'));
  }

  if (password.length < 6) {
    return next(new ValidationError('La contraseña debe tener al menos 6 caracteres'));
  }

  // Email básico regex
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return next(new ValidationError('Email inválido'));
  }

  next();
}

// Validar datos de login
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Email y contraseña son obligatorios'));
  }

  next();
}

// Validar apuesta (genérico para juegos)
function validateBet(req, res, next) {
  const { amount } = req.body;

  if (!amount) {
    return next(new ValidationError('El monto de la apuesta es obligatorio'));
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return next(new ValidationError('El monto debe ser un número mayor a 0'));
  }

  if (amount < MIN_BET) {
    return next(new ValidationError(`La apuesta mínima es ${MIN_BET}`));
  }

  if (amount > MAX_BET) {
    return next(new ValidationError(`La apuesta máxima es ${MAX_BET}`));
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateBet
};