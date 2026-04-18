// pages/api/books/buscadormejorado.js
import { bookService } from '../../../utils/bookService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { q, page = 1, limit = 12, idioma, anio, fileType, autor, isPremium, categorias } = req.query;

    let allBooks = bookService.getAllBooks();

    // Filtrado
    let filteredBooks = allBooks.filter(book => {
      let match = true;

      if (q && !book.titulo.toLowerCase().includes(q.toLowerCase()) && !book.autor.toLowerCase().includes(q.toLowerCase())) {
        match = false;
      }
      if (idioma && book.idioma.toLowerCase() !== idioma.toLowerCase()) {
        match = false;
      }
      if (anio && book.anio !== parseInt(anio, 10)) {
        match = false;
      }
      if (fileType && book.fileType.toLowerCase() !== fileType.toLowerCase()) {
        match = false;
      }
      if (autor && !book.autor.toLowerCase().includes(autor.toLowerCase())) {
        match = false;
      }
      if (isPremium !== undefined) {
        const isPremiumBool = isPremium === 'true';
        if (book.isPremium !== isPremiumBool) {
          match = false;
        }
      }
      if (categorias) {
        const searchCategories = categorias.toLowerCase().split(',').map(cat => cat.trim());
        if (!book.categorias.some(cat => searchCategories.includes(cat.toLowerCase()))) {
          match = false;
        }
      }
      return match;
    });

    // Paginación
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = parsedPage * parsedLimit;

    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    const totalCount = filteredBooks.length;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.status(200).json({
      books: paginatedBooks,
      metadata: {
        page: parsedPage,
        limit: parsedLimit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error en buscadormejorado API:', error);
    res.status(500).json({ message: 'Error interno del servidor al buscar libros' });
  }
}
