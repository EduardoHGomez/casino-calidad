const mongoose = require('mongoose');
const { GAME_TYPES } = require('../config/constants');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Rendimiento: búsquedas rápidas por usuario
  },
  gameType: {
    type: String,
    required: true,
    enum: Object.values(GAME_TYPES) // Solo valores permitidos
  },
  betAmount: {
    type: Number,
    required: true,
    min: 0
  },
  result: {
    type: String,
    required: true,
    enum: ['win', 'loss']
  },
  winnings: {
    type: Number,
    default: 0,
    min: 0
  },
  // Renombrado para mayor claridad
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Rendimiento: ordenar por fecha
  }
}, {
  timestamps: true
});

// Índice compuesto para consultas eficientes
activitySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);