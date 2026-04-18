// services/llamados/rating.js
import { api } from './apiClient';

export const rateBook = async (idBook, idUser, rating) => {
  try {
    const response = await api.post(`/rating/${idBook}/${idUser}/${rating}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al calificar el libro.';
    console.error('Error en rateBook:', error);
    throw new Error(message);
  }
};

export const getUserRatings = async (idUser) => {
  try {
    const response = await api.get(`/rating/list/${idUser}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener las calificaciones del usuario.';
    console.error('Error en getUserRatings:', error);
    throw new Error(message);
  }
};
