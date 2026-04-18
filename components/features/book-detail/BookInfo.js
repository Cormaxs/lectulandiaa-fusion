// BookInfo.js
import { useState, useCallback, useMemo, memo } from 'react';
import styles from '../../../styles/BookDetail.module.css';

const BookInfo = memo(({ book }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const SYNOPSIS_LIMIT = 300; // caracteres

  const synopsis = useMemo(() => book.sinopsis || '', [book.sinopsis]);
  const isLong = useMemo(() => synopsis.length > SYNOPSIS_LIMIT, [synopsis]);
  const displaySynopsis = useMemo(() => isExpanded ? synopsis : synopsis.slice(0, SYNOPSIS_LIMIT) + (isLong ? '...' : ''), [isExpanded, synopsis, isLong]);

  const toggleSynopsis = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className={styles.detailContent}>
      <h1 className={styles.bookTitle}>{book.titulo}</h1>

      <div className={styles.metaRow}>
        <p className={styles.bookAuthor}>
          <strong>Autor:</strong> <span>{book.autor}</span>
        </p>
        {book.anio && <span className={styles.metaItem}>📅 {book.anio}</span>}
        {book.idioma && <span className={styles.metaItem}>🌐 {book.idioma}</span>}
        {book.paginas && <span className={styles.metaItem}>📄 {book.paginas} págs</span>}
      </div>

      <div className={styles.ratingContainer}>
        <div className={styles.ratingStars}>
          {'★'.repeat(Math.round(book.averageRating || 0))}
          {'☆'.repeat(5 - Math.round(book.averageRating || 0))}
        </div>
        <p className={styles.ratingText}>
          <span>{book.averageRating || 'S/C'}</span>
          <small className={styles.ratingCount}> ({book.totalRatingsCount || 0} votos)</small>
        </p>
      </div>

      {book.categorias && book.categorias.length > 0 && (
        <div className={styles.tagsWrapper}>
          {book.categorias.map((cat, i) => (
            <span key={i} className={styles.tag}>{cat}</span>
          ))}
        </div>
      )}

      <div className={styles.synopsisContainer}>
        <h2 className={styles.synopsisTitle}>Sinopsis</h2>
        <p className={styles.synopsisText}>{displaySynopsis}</p>
        {isLong && (
          <button
            onClick={toggleSynopsis}
            className={styles.readMoreButton}
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
    </div>
  );
});

export default BookInfo;