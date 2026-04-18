import { api } from './apiClient';

export const registerUser = async ({ username, password, email }) => {
  try {
    const response = await api.post('/users/register', { username, password, email });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al registrar el usuario.';
    console.error('Error en registerUser:', error);
    throw new Error(message);
  }
};

export const loginUser = async ({ username, password }) => {
  try {
    const response = await api.post('/users/login', { username, password });
    console.log('Respuesta de loginUser:', response.data.user);
    return response.data.user;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al iniciar sesión.';
    console.error('Error en loginUser:', error);
    throw new Error(message);
  }
};
