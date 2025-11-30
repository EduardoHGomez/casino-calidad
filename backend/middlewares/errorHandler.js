const { HTTP_STATUS } = require('../config/constants');

// Middleware global de manejo de errores
// Debe ser el ÚLTIMO middleware en server.js
function errorHandler(err, req, res, next) {
  // Log del error (en producción usar Winston)
  console.error('❌ Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Determinar status code
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;

  // Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
      // Solo enviar stack en desarrollo
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;