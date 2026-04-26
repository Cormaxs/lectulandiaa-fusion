import { memo } from 'react';
import styles from '../../../styles/BookDetail.module.css';
import { getTelegramDownloadLink } from '../../../services/llamados/telegram'; // Asegúrate de tener esta ruta

const DownloadButton = memo(({ book, role }) => {
    // Si no hay ningún tipo de enlace, no renderizamos nada
    if (!book.link && !book.telegram?.fileId) return null;

    const isAdmin = role?.role === 'admin';
    const isSubscribed = role?.isSubscribed === true;

    // Lógica para el botón de descarga "Directa/Ouo"
    const handleDirectDownload = () => {
        const url = (isAdmin || isSubscribed) ? book.link : (book.ouo || book.link);
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Lógica para el botón de Telegram
    const handleTelegramDownload = async () => {
        try {
            const url = await getTelegramDownloadLink(book.telegram.fileId);
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (err) {
            console.error("Error al obtener link de Telegram", err);
            alert("No se pudo generar el enlace de descarga de Telegram.");
        }
    };

    return (
        <div className={styles.downloadCtaWrapper}>
            {/* Botón 1: Descarga Directa (Drive/Ouo) */}
            {book.link && (
                <button
                    onClick={handleDirectDownload}
                    className={`${styles.downloadButton} ${book.isPremium ? styles.premiumBtn : ''}`}
                >
                    Descargar Libro ({book.fileType || 'PDF'})
                </button>
            )}

            {/* Botón 2: Descarga Telegram */}
            {book.telegram?.fileId && (
                <button
                    onClick={handleTelegramDownload}
                    className={`${styles.downloadButton} ${styles.telegramBtn || ''}`} // Opcional: crea estilos telegramBtn si quieres otro color
                >
                    Descargar respaldo ({book.fileType || 'PDF'})
                </button>
            )}

            {book.isPremium && (
                <p className={styles.premiumWarning}>* Requiere cuenta de suscriptor activa.</p>
            )}
        </div>
    );
});

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;