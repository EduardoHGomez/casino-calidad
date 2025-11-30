const userRepository = require('../repositories/userRepository');
const { generateToken, hashPassword, comparePassword } = require('../utils/crypto');
const { ValidationError, UnauthorizedError } = require('../utils/errorTypes');

class AuthService {
  
  // RF-1: Registro de usuarios
  async register(userData) {
    const { name, age, email, password } = userData;

    // Validación: Usuario ya existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('El email ya está registrado');
    }

    // Validación de edad (RF-1)
    if (age < 18) {
      throw new ValidationError('Debes tener al menos 18 años');
    }

    // Crear usuario (el password se hasheará automáticamente en el pre-save hook)
    const newUser = await userRepository.create({
      name,
      age,
      email,
      password
    });

    // No retornar password
    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      balance: newUser.balance
    };
  }

  // RF-2: Autenticación
  async login(email, password) {
    // Buscar usuario
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Comparar password (usando el método del modelo)
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // RF-3: Generar token JWT
    const token = generateToken({ userId: user._id });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    };
  }

  // Verificar token (usado por middleware)
  async verifyUserToken(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    return user;
  }
}

module.exports = new AuthService();