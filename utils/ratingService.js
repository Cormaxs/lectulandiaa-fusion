// utils/ratingService.js

// Almacenamiento temporal de calificaciones y libros (en producción usar base de datos)
let ratings = [];
let books = []; // Simulación de libros para actualizar ratings

export const ratingService = {
  // Añadir o actualizar una calificación
  addOrUpdateRating: (idBook, idUser, rating) => {
    const existingRatingIndex = ratings.findIndex(
      (r) => r.bookId === idBook && r.userId === idUser
    );

    if (existingRatingIndex > -1) {
      // Si ya existe, actualizar la calificación
      ratings[existingRatingIndex].rating = rating;
      ratings[existingRatingIndex].updatedAt = new Date().toISOString();
    } else {
      // Si no existe, añadir nueva calificación
      const newRating = {
        _id: Date.now().toString(),
        bookId: idBook,
        userId: idUser,
        rating: rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ratings.push(newRating);
    }

    // Actualizar el promedio de calificación y el conteo total del libro
    ratingService.updateBookRatingStats(idBook);

    return ratings.find((r) => r.bookId === idBook && r.userId === idUser);
  },

  // Verificar si un usuario ya ha calificado un libro
  hasUserRatedBook: (idBook, idUser) => {
    return ratings.some((r) => r.bookId === idBook && r.userId === idUser);
  },

  // Listar todas las calificaciones de un usuario
  getRatingsByUserId: (idUser) => {
    const userRatings = ratings.filter((r) => r.userId === idUser);
    return userRatings.map(r => ({
      _id: r._id,
      rating: r.rating,
      book: ratingService.getBookRatingStats(r.bookId), // Obtener stats del libro
      user: r.userId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      __v: 0,
    }));
  },

  // Obtener estadísticas de calificación de un libro
  getBookRatingStats: (idBook) => {
    const bookRatings = ratings.filter(r => r.bookId === idBook);
    const totalRatings = bookRatings.length;
    const sumRatings = bookRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Simular la existencia de un libro y actualizar sus stats
    let book = books.find(b => b._id === idBook);
    if (!book) {
      book = { _id: idBook, averageRating: 0, totalRatingsCount: 0 };
      books.push(book);
    }
    book.averageRating = parseFloat(averageRating.toFixed(1));
    book.totalRatingsCount = totalRatings;

    return {
      _id: book._id,
      averageRating: book.averageRating,
      totalRatingsCount: book.totalRatingsCount,
    };
  },

  // Función interna para actualizar las estadísticas de un libro
  updateBookRatingStats: (idBook) => {
    ratingService.getBookRatingStats(idBook); // Esto ya actualiza el array 'books'
  },

  // Función para inicializar libros si es necesario (para pruebas)
  initializeBooks: (initialBooks) => {
    books = initialBooks;
  },
  
  // Función para limpiar ratings (para pruebas)
  clearRatings: () => {
    ratings = [];
    books = [];
  }
};
