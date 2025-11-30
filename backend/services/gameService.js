const mongoose = require('mongoose');
const balanceService = require('./balanceService');
const activityService = require('./activityService');

class GameService {
  
  // PATRÓN: Transaction Pattern
  // Fiabilidad: RF-7, RF-8, RF-9 - Operaciones atómicas
  // Este es el método MÁS IMPORTANTE para mantener consistencia
  async processGameResult(userId, gameType, betAmount, winnings) {
    // Iniciar sesión de MongoDB
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Deducir apuesta
      await balanceService.deductBet(userId, betAmount, session);

      // 2. Si ganó, agregar ganancias
      if (winnings > 0) {
        await balanceService.addWinnings(userId, winnings, session);
      }

      // 3. Registrar actividad
      await activityService.recordActivity({
        userId,
        gameType,
        betAmount,
        result: winnings > 0 ? 'win' : 'loss',
        winnings
      }, session);

      // 4. COMMIT - Todo salió bien
      await session.commitTransaction();

      // 5. Obtener balance actualizado
      const newBalance = await balanceService.getBalance(userId);

      return {
        success: true,
        result: winnings > 0 ? 'win' : 'loss',
        winnings,
        newBalance
      };

    } catch (error) {
      // ROLLBACK - Si algo falló, revertir TODO
      await session.abortTransaction();
      throw error;
    } finally {
      // Cerrar sesión
      session.endSession();
    }
  }

  // Validar apuesta genérica
  async validateBet(userId, amount) {
    return balanceService.validateBalance(userId, amount);
  }
}

module.exports = new GameService();