import { memo } from 'react';
import styles from '../../../styles/BookDetail.module.css';

const DownloadButton = memo(({ book }) => {
    if (!book.link) return null;

    return (
        <div className={styles.downloadCtaWrapper}>
            <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`${styles.downloadButton} ${book.isPremium ? styles.premiumBtn : ''}`}
            >
                {book.isPremium ? 'Descargar Libro' : 'Descargar Libro'} ({book.fileType || 'PDF'})
            </a>
            {book.isPremium && (
                <p className={styles.premiumWarning}>* Requiere cuenta de suscriptor activa.</p>
            )}
        </div>
    );
});

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;