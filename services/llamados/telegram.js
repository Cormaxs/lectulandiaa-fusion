import { api } from './apiClient';

// Esta es la función que llamará el botón de descarga
export const getTelegramDownloadLink = async (fileId) => {
  try {
    // Esta ruta debe coincidir con la que definas en tu servidor (Express)
    const response = await api.post('/telegram/get-download-link', { fileId, chatId: process.env.TELEGRAM_CHAT_ID });
    return response.data.url;
  } catch (error) {
    console.error('Error al obtener link de Telegram:', error);
    throw new Error('No se pudo generar el enlace de descarga.');
  }
};


export const uploadBookFile = async (formData) => {
  try {
    const response = await api.post('/telegram/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data; // debe tener { success, libro, message }
  } catch (error) {
    console.error('Error en uploadBookFile:', error);
    throw new Error(error.response?.data?.message || 'Error en la subida.');
  }
};