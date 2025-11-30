const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration, bcryptRounds } = require('../config/env');

// Hash de password
async function hashPassword(password) {
  return bcrypt.hash(password, bcryptRounds);
}

// Comparar password
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// RF-3: Generar token JWT
function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
}

// Verificar token JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};