// utils/bookService.js

let books = []; // Almacenamiento temporal de libros (en producción usar base de datos)

export const bookService = {
  // Crear un nuevo libro
  createBook: (bookData) => {
    const newBook = {
      _id: Date.now().toString(), // Generar un ID único
      ...bookData,
      link: bookData.link || '', // Asegurar que 'link' siempre esté presente
      averageRating: 0, // Inicializar rating
      totalRatingsCount: 0, // Inicializar contador de ratings
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    books.push(newBook);
    return newBook;
  },

  // Obtener un libro por su ID
  getBookById: (idBook) => {
    return books.find(book => book._id === idBook);
  },

  // Obtener todos los libros
  getAllBooks: () => {
    return books;
  },

  // Actualizar un libro existente
  updateBook: (idBook, updatedData) => {
    const bookIndex = books.findIndex(book => book._id === idBook);
    if (bookIndex === -1) {
      return null; // Libro no encontrado
    }
    books[bookIndex] = {
      ...books[bookIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    return books[bookIndex];
  },

  // Eliminar un libro
  deleteBook: (idBook) => {
    const initialLength = books.length;
    books = books.filter(book => book._id !== idBook);
    return books.length < initialLength; // Retorna true si se eliminó un libro
  },

  // Funciones para pruebas (opcional)
  clearBooks: () => {
    books = [];
  },
  initializeBooks: (initialBooks) => {
    books = initialBooks;
  }
};
