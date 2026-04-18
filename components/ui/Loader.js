// components/ui/Loader.js

import styles from '../../styles/Loader.module.css';

const Loader = () => (
    <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
        <p>Cargando libros...</p>
    </div>
);

export default Loader;