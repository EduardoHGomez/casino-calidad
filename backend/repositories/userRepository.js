const User = require('../models/User');

class UserRepository {
  
  // CRUD básico
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findAll() {
    return User.find();
  }

  // Actualización genérica
  async update(id, updateData) {
    return User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
  }

  // CRÍTICO: Actualización de balance con soporte para transacciones
  // Fiabilidad: RF-7 - Operaciones atómicas
  async updateBalance(userId, amount, session = null) {
    const options = { new: true, runValidators: true };
    
    // Si hay sesión (transacción), usarla
    if (session) {
      options.session = session;
    }

    return User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } }, // Operación atómica: incrementar/decrementar
      options
    );
  }

  // Verificar si existe un usuario
  async exists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  // Obtener solo el balance
  async getBalance(userId) {
    const user = await User.findById(userId).select('balance');
    return user ? user.balance : null;
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();