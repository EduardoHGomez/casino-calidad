const userRepository = require('../repositories/userRepository');
const { HTTP_STATUS } = require('../config/constants');

class ProfileController {
  
  // GET /profile
  async getProfile(req, res, next) {
    try {
      const userId = req.userId; // Del authMiddleware
      
      const user = await userRepository.findById(userId);
      
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          balance: user.balance
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.userId;
      const { name, email } = req.body;

      const updatedUser = await userRepository.update(userId, { name, email });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Perfil actualizado',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();