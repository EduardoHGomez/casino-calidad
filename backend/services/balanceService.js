const mongoose = require('mongoose');
const userRepository = require('../repositories/userRepository');
const { InsufficientBalanceError, ValidationError } = require('../utils/errorTypes');
const { MIN_BET, MAX_BET } = require('../config/constants');

class BalanceService {
  
  // Validar que el usuario tiene saldo suficiente
  async validateBalance(userId, amount) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new ValidationError('Usuario no encontrado');
    }

    if (amount < MIN_BET) {
      throw new ValidationError(`La apuesta mínima es ${MIN_BET}`);
    }

    if (amount > MAX_BET) {
      throw new ValidationError(`La apuesta máxima es ${MAX_BET}`);
    }

    if (user.balance < amount) {
      throw new InsufficientBalanceError(
        `Saldo insuficiente. Tienes: ${user.balance}, necesitas: ${amount}`
      );
    }

    return true;
  }

  // RF-5: Deducir apuesta (con transacción)
  // Fiabilidad: RF-7 - Operación atómica
  async deductBet(userId, amount, session = null) {
    await this.validateBalance(userId, amount);
    
    return userRepository.updateBalance(userId, -amount, session);
  }

  // Agregar ganancias (con transacción)
  async addWinnings(userId, amount, session = null) {
    if (amount <= 0) {
      throw new ValidationError('Las ganancias deben ser mayores a 0');
    }

    return userRepository.updateBalance(userId, amount, session);
  }

  // Obtener balance actual
  async getBalance(userId) {
    return userRepository.getBalance(userId);
  }

  // Actualizar balance genérico (con transacción)
  async updateBalance(userId, delta, session = null) {
    return userRepository.updateBalance(userId, delta, session);
  }
}

module.exports = new BalanceService();