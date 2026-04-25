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
   // console.log('Respuesta de loginUser:', response.data.user);
    return response.data.user;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al iniciar sesión.';
    console.error('Error en loginUser:', error);
    throw new Error(message);
  }
};


// services/llamados/users.js

export const updateUser = async (idUser, userData) => {
  // Clonamos para no mutar el objeto original del estado
  const payload = { ...userData };

  // Seguridad: Si la contraseña está vacía, no la enviamos
  if (!payload.password || payload.password.trim() === '') {
    delete payload.password;
  }

  // Enviamos 'payload' directamente si tu backend espera el objeto usuario,
  // o { payload } si tu backend hace destructuring de req.body.payload
  const response = await api.post(`/users/update/${idUser}`, payload);

  //console.log('Respuesta de updateUser:', response.data);

  // IMPORTANTE: response.data es un objeto, no una función.
  return response.data;
};
