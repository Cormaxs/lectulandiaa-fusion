import { api } from './apiClient';

const buildSearchParams = ({ q, page, limit, idioma, anio, fileType, autor, isPremium, categorias }) => {
  const params = new URLSearchParams();

  if (q) params.append('q', q);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (idioma) params.append('idioma', idioma);
  if (anio) params.append('anio', anio);
  if (fileType) params.append('fileType', fileType);
  if (autor) params.append('autor', autor);
  if (isPremium !== undefined) params.append('isPremium', isPremium);
  if (categorias) params.append('categorias', categorias);

  return params.toString();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchBooks = async ({ q = '', page = 1, limit = 12, idioma, anio, fileType, autor, isPremium, categorias } = {}) => {
  try {
    const queryString = buildSearchParams({ q, page, limit, idioma, anio, fileType, autor, isPremium, categorias });
    const path = `/books/buscadormejorado?${queryString}`;
    const response = await api.get(path);
  //console.log('Respuesta de fetchBooks:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener o buscar libros:', error);
    throw new Error('No se pudieron obtener los libros de la API.');
  }
};

export const fetchBookById = async (slugOrId) => {
  try {
    const response = await api.get(`/books/${slugOrId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error al buscar libro por slug o ID ${slugOrId}:`, error);
    throw new Error('Error de conexión al obtener el libro.');
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData, getAuthHeaders());
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al crear el libro.';
    console.error('Error en createBook:', error);
    throw new Error(message);
  }
};

export const updateBook = async (idBook, bookData) => {
  try {
    const response = await api.post(`/books/${idBook}`, bookData, getAuthHeaders());
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar el libro.';
    console.error('Error en updateBook:', error);
    throw new Error(message);
  }
};

export const deleteBook = async (idBook) => {
  try {
    const response = await api.delete(`/books/${idBook}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al eliminar el libro.';
    console.error('Error en deleteBook:', error);
    throw new Error(message);
  }
};

