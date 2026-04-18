// pages/api/books/[idBook].js
import { bookService } from '../../../utils/bookService';
import { userService } from '../../../utils/auth'; // Para verificar el token y el rol

export default async function handler(req, res) {
  // 1. Verificar token JWT y rol de administrador
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  const decodedToken = userService.verifyToken(token);

  if (!decodedToken || decodedToken.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de administrador' });
  }

  const { idBook } = req.query;

  if (req.method === 'POST') {
    try {
      const bookData = req.body;

      // Validación básica de los datos del libro
      if (!bookData.titulo || !bookData.autor || !bookData.link) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: titulo, autor, link' });
      }

      const updatedBook = bookService.updateBook(idBook, bookData);

      if (!updatedBook) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.status(200).json({
        success: true,
        user: updatedBook, // Se usa 'user' aquí para coincidir con el formato de respuesta proporcionado
      });
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      res.status(500).json({ message: 'Error interno del servidor al actualizar el libro' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = bookService.deleteBook(idBook);

      if (!deleted) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.status(200).json({
        success: true,
        message: 'Libro eliminado exitosamente.',
      });
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      res.status(500).json({ message: 'Error interno del servidor al eliminar el libro' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
