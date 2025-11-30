const { verifyToken } = require('../utils/crypto');
const { UnauthorizedError } = require('../utils/errorTypes');

// RF-3: Middleware para verificar JWT
function authMiddleware(req, res, next) {
  try {
    // 1. Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedError('No se proporcionó token de autenticación');
    }

    // 2. Extraer token (formato: "Bearer TOKEN" o solo "TOKEN")
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    // 3. Verificar y decodificar token
    const decoded = verifyToken(token);

    // 4. Adjuntar userId al request para uso posterior
    req.userId = decoded.userId;
    req.user = { _id: decoded.userId }; // Para compatibilidad

    // 5. Continuar al siguiente middleware/controller
    next();

  } catch (error) {
    // Si el token es inválido o expiró
    next(new UnauthorizedError('Token inválido o expirado'));
  }
}

module.exports = authMiddleware;