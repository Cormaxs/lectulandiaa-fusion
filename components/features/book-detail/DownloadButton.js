import { memo } from 'react';
import styles from '../../../styles/BookDetail.module.css';

const DownloadButton = memo(({ book, role }) => {
    if (!book.link) return null;
    console.log('Rendering DownloadButton for:', book, role);
  const isAdmin = role?.role === 'admin';
    const isSubscribed = role?.isSubscribed === true;

    const finalUrl = (isAdmin || isSubscribed) ? book.link : (book.ouo || book.link);
    return (
        <div className={styles.downloadCtaWrapper}>
            <a
                
                href={finalUrl}
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