import { useState } from 'react';
import Image from 'next/image';
import { isValidImageUrl } from '../../../utils/imageUtils';
import styles from '../../../styles/BookDetail.module.css';

const BookCover = ({ book }) => {
    const [imageError, setImageError] = useState(false);

    // Decodificar entidades HTML en la URL de la portada
    const decodedPortada = book.portada ? book.portada.replace(/&amp;/g, '&') : '';

    if (!isValidImageUrl(decodedPortada) && imageError) return null;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className={styles.coverWrapper}>
            {/* Badges superiores */}
            {book.isPremium && (
                <div className={styles.premiumBadgeDetail} title="Contenido Premium">
                    🔒 Premium
                </div>
            )}
            {book.fileType && (
                <div className={styles.fileBadgeDetail}>
                    {book.fileType.toUpperCase()}
                </div>
            )}
            
            {isValidImageUrl(decodedPortada) && !imageError ? (
                <Image
                    src={decodedPortada}
                    alt={`Portada de ${book.titulo}`}
                    className={styles.bookCoverLarge}
                    width={300} // Valor predeterminado, ajustar si es necesario
                    height={450} // Valor predeterminado, ajustar si es necesario
                    onError={handleImageError}
                />
            ) : (
                <div className={styles.bookCoverPlaceholder}>
                    <span className={styles.placeholderIcon}>📕</span>
                    <span>Portada no disponible</span>
                </div>
            )}
        </div>
    );
};

export default BookCover;