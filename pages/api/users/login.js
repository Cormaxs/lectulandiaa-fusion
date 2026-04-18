import { userService } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username y password son requeridos'
      });
    }

    // Buscar usuario
    const user = userService.findUser(username);
    if (!user) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await userService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = userService.generateToken(user);

    res.status(200).json({
      success: true,
      user: {
        user: {
          planType: user.planType,
          favoritos: user.favoritos || [], // Asumiendo que 'favoritos' puede estar en el usuario
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isSubscribed: user.isSubscribed,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || new Date().toISOString(), // Asumiendo que 'updatedAt' puede no existir
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
}