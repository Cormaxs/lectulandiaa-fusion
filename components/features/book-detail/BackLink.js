import { useRouter } from 'next/router';
import styles from '../../../styles/BookDetail.module.css';

const BackLink = () => {
    const router = useRouter();

    const handleBack = (e) => {
        e.preventDefault();
        // Verifica si hay historial previo para evitar cerrar la pestaña si entró directo
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/explore'); // Fallback por si entró por un link directo
        }
    };

    return (
        <button 
            onClick={handleBack} 
            className={styles.backLink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
            &larr; Volver
        </button>
    );
};

export default BackLink;