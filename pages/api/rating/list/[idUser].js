// pages/api/rating/list/[idUser].js
import { ratingService } from '../../../../utils/ratingService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { idUser } = req.query;

  if (!idUser) {
    return res.status(400).json({ message: 'Falta el parámetro idUser' });
  }

  try {
    const userRatings = ratingService.getRatingsByUserId(idUser);

    res.status(200).json({
      message: 'Calificaciones del usuario obtenidas exitosamente.',
      data: userRatings,
    });
  } catch (error) {
    console.error('Error al obtener las calificaciones del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener las calificaciones' });
  }
}
