const authService = require('../services/authService');
const { HTTP_STATUS } = require('../config/constants');

class AuthController {
  
  // POST /auth/register
  async register(req, res, next) {
    try {
      const userData = req.body;
      
      const result = await authService.register(userData);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Usuario registrado con éxito',
        data: result
      });
    } catch (error) {
      next(error); // Delegar al errorHandler
    }
  }

  // POST /auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /auth/me (opcional - obtener usuario actual)
  async getCurrentUser(req, res, next) {
    try {
      const userId = req.userId; // Del authMiddleware
      
      const user = await authService.verifyUserToken(userId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          balance: user.balance
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();