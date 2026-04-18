// pages/api/rating/[idBook]/[idUser]/[rating].js
import { ratingService } from '../../../../utils/ratingService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { idBook, idUser, rating } = req.query;

  // Validación básica de los parámetros
  if (!idBook || !idUser || !rating) {
    return res.status(400).json({ message: 'Faltan parámetros: idBook, idUser, rating' });
  }

  const parsedRating = parseInt(rating, 10);

  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ message: 'La calificación debe ser un número entre 1 y 5' });
  }

  try {
    // Verificar si el usuario ya ha calificado este libro
    if (ratingService.hasUserRatedBook(idBook, idUser)) {
      return res.status(409).json({ message: 'Ya has calificado este libro' });
    }

    const newRating = ratingService.addOrUpdateRating(idBook, idUser, parsedRating);

    res.status(200).json({
      message: 'Calificación registrada exitosamente.',
      data: newRating,
    });
  } catch (error) {
    console.error('Error al registrar la calificación:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar la calificación' });
  }
}
