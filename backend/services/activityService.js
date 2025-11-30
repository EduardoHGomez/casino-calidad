const activityRepository = require('../repositories/activityRepository');

class ActivityService {
  
  // RF-6: Registrar actividad de juego (con transacción)
  async recordActivity(activityData, session = null) {
    const { userId, gameType, betAmount, result, winnings = 0 } = activityData;

    const activity = {
      userId,
      gameType,
      betAmount,
      result,
      winnings,
      timestamp: new Date()
    };

    return activityRepository.create(activity, session);
  }

  // Obtener historial de actividades
  async getActivityHistory(userId, options = {}) {
    return activityRepository.findByUserId(userId, options);
  }

  // Obtener últimas actividades
  async getRecentActivity(userId, limit = 10) {
    return activityRepository.findRecentByUserId(userId, limit);
  }

  // Obtener estadísticas
  async getStats(userId) {
    return activityRepository.getStats(userId);
  }
}

module.exports = new ActivityService();