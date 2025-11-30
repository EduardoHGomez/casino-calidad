const mongoose = require('mongoose');
const { mongoUri } = require('./env');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Opciones de conexión optimizadas
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 100, // RF-6: Soportar 100 usuarios concurrentes
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      this.connection = await mongoose.connect(mongoUri, options);
      
      console.log('✓ Conexión a MongoDB exitosa');
      console.log(`Estado: ${mongoose.connection.readyState}`);
      
      // Event listeners para monitoreo
      mongoose.connection.on('error', (err) => {
        console.error('❌ Error de MongoDB:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB desconectado');
      });

      return this.connection;
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      process.exit(1); // Salir si no hay conexión
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();