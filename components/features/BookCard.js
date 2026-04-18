import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { createSlug } from '../../utils/slug';
import { isValidImageUrl } from '../../utils/imageUtils';
import styles from '../../styles/BookCard.module.css';

const BookCard = ({ book, onEdit, onDelete }) => {
    const [imageError, setImageError] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setIsAdmin(parsedUser.role === 'admin');
        }
    }, []);

    const slug = useMemo(() => createSlug(book.titulo), [book.titulo]);
    const uniqueSlug = useMemo(() => `${slug}-${book._id}`, [slug, book._id]);
    const decodedPortada = useMemo(() => book.portada ? book.portada.replace(/&amp;/g, '&') : '', [book.portada]);

    const renderStars = useMemo(() => (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={i <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
                >
                    ★
                </span>
            );
        }
        return stars;
    }, []);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <div className={styles.bookCardContainer}>
            <Link
                href={`/seeBook/${uniqueSlug}`}
                legacyBehavior
                prefetch={true}
            >
                <a className={styles.bookCard} aria-label={`Ver detalles de ${book.titulo}`}>
                    <div className={styles.bookCoverWrapper}>
                        {/* Badge Premium (Lado izquierdo) */}
                        {book.isPremium && (
                            <div className={styles.premiumBadge} title="Contenido exclusivo para usuarios Premium">
                                <span role="img" aria-label="premium">🔒</span>
                            </div>
                        )}

                        {/* Badge de Formato (Lado derecho) */}
                        {book.fileType && (
                            <div className={styles.fileBadge}>
                                {book.fileType.toUpperCase()}
                            </div>
                        )}

                        {isValidImageUrl(decodedPortada) && !imageError ? (
                            <Image
                                src={decodedPortada}
                                alt={`Portada del libro: ${book.titulo}`}
                                className={styles.bookCover}
                                width={260}
                                height={350}
                                onError={handleImageError}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEB//EACUQAAIBAwMEAwEBAAAAAAAAAAECAwAEEQUSITFBURNhcZEigf/EABUBAFEAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A4+iiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
                            />
                        ) : (
                            <div className={styles.placeholderCover}>
                                <span className={styles.placeholderIcon}>📕</span>
                                <span className={styles.placeholderText}>Sin Portada</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.cardContent}>
                        <h2 className={styles.cardTitle} title={book.titulo}>
                            {book.titulo}
                        </h2>
                        <p className={styles.cardAuthor}>
                            {book.autor}
                        </p>

                        <div className={styles.ratingSection}>
                            <div className={styles.starsContainer}>
                                {renderStars(book.averageRating)}
                            </div>
                            <span className={styles.ratingCount}>
                                ({book.totalRatingsCount || 0})
                            </span>
                        </div>
                    </div>
                </a>
            </Link>
            {isAdmin && (
                <div className={styles.adminActions}>
                    <button onClick={() => onEdit(book)} className={styles.editButton} aria-label="Editar libro">
                        ✏️
                    </button>
                    <button onClick={() => onDelete(book._id)} className={styles.deleteButton} aria-label="Eliminar libro">
                        🗑️
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(BookCard);