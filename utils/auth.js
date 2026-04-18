import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Clave secreta para JWT (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'michaelscott';

// Almacenamiento temporal de usuarios (en producción usar base de datos)
let users = [];

export const userService = {
  // Buscar usuario por username o email
  findUser: (identifier) => {
    return users.find(user =>
      user.username === identifier || user.email === identifier
    );
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    const { username, password, email } = userData;

    // Verificar si el usuario ya existe
    if (userService.findUser(username) || userService.findUser(email)) {
      throw new Error('Usuario o email ya existe');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: Date.now().toString(), // Cambiado de 'id' a '_id'
      username,
      email,
      password: hashedPassword,
      role: 'user', // Valor por defecto
      planType: 'free', // Valor por defecto
      isSubscribed: false, // Valor por defecto
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    return {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      planType: newUser.planType,
      isSubscribed: newUser.isSubscribed
    };
  },

  // Verificar contraseña
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Generar token JWT
  generateToken: (user) => {
    return jwt.sign(
      {
        id: user._id, // Usar _id del usuario
        role: user.role,
        plan: user.planType,
        isSubscribed: user.isSubscribed,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  // Verificar token JWT
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};