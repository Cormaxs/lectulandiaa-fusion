import { useRouter } from 'next/router';
import { useCallback, memo } from 'react';
import styles from '../../../styles/BookDetail.module.css';

const BackLink = memo(() => {
    const router = useRouter();

    const handleBack = useCallback((e) => {
        e.preventDefault();
        // Verifica si hay historial previo para evitar cerrar la pestaña si entró directo
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/explore'); // Fallback por si entró por un link directo
        }
    }, [router]);

    return (
        <button 
            onClick={handleBack} 
            className={styles.backLink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
            &larr; Volver
        </button>
    );
});

BackLink.displayName = 'BackLink';

export default BackLink;