require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'clave_secreta',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  nodeEnv: process.env.NODE_ENV || 'development'
};