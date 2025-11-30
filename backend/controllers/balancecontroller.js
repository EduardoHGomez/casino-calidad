const balanceService = require('../services/balanceService');
const { HTTP_STATUS } = require('../config/constants');

class BalanceController {
  
  // GET /profile/balance
  async getBalance(req, res, next) {
    try {
      const userId = req.userId;
      
      const balance = await balanceService.getBalance(userId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { balance }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /profile/balance (para agregar fondos manualmente - testing)
  async updateBalance(req, res, next) {
    try {
      const userId = req.userId;
      const { amount } = req.body;

      const updatedUser = await balanceService.updateBalance(userId, amount);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Balance actualizado',
        data: {
          balance: updatedUser.balance
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BalanceController();