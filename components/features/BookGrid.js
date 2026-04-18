// components/features/BookGrid.js
import React, { memo } from 'react';
import BookCard from './BookCard';
import styles from '../../styles/BookGrid.module.css';

const BookGrid = memo(({ books, isLoading }) => {
  return (
    <div
      id="books-grid"
      className={`${styles.booksGrid} ${isLoading ? styles.loading : ''}`}
    >
      {books.length > 0 ? (
        books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))
      ) : (
        <p className={styles.noResults}>
          No se encontraron títulos que coincidan con la búsqueda. Intenta con otros términos.
        </p>
      )}
    </div>
  );
});

BookGrid.displayName = 'BookGrid';
export default BookGrid;