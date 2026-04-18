import { userService } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { username, password, email } = req.body;

    // Validación básica
    if (!username || !password || !email) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos: username, password, email'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Formato de email inválido'
      });
    }

    // Crear usuario
    const user = await userService.createUser({ username, password, email });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({
      message: error.message || 'Error al crear usuario'
    });
  }
}