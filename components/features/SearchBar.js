// components/features/SearchBar.js

import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/SearchBar.module.css';

// ⭐️ CONSTANTE CLAVE para Session Storage
const PAGE_STORAGE_KEY = 'last_catalog_page';

const SearchBar = ({ initialQuery }) => {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        const newQuery = query.trim();

        if (newQuery === initialQuery) return;

        const { idioma, anio, fileType, limit } = router.query;
        const params = new URLSearchParams();

        if (newQuery) params.append('q', newQuery);
        params.append('page', '1');
        if (limit) params.append('limit', String(limit));
        if (idioma) params.append('idioma', String(idioma));
        if (anio) params.append('anio', String(anio));
        if (fileType) params.append('fileType', String(fileType));

        sessionStorage.removeItem(PAGE_STORAGE_KEY);
        router.push(`/?${params.toString()}`);
    }, [query, router, initialQuery]);

    const handleClearSearch = useCallback(() => {
        setQuery('');
        sessionStorage.removeItem(PAGE_STORAGE_KEY);

        const { idioma, anio, fileType, limit } = router.query;
        const params = new URLSearchParams();
        params.append('page', '1');
        if (limit) params.append('limit', String(limit));
        if (idioma) params.append('idioma', String(idioma));
        if (anio) params.append('anio', String(anio));
        if (fileType) params.append('fileType', String(fileType));

        const basePath = params.toString() ? `/?${params.toString()}` : '/?page=1';
        router.push(basePath);
    }, [router]);

    return (
        <div className={styles.searchBarWrapper}>
            <form
                onSubmit={handleSearch}
                className={styles.searchForm}
                role="search"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por título, autor o ISBN..."
                    aria-label="Término de búsqueda"
                    className={styles.searchInput}
                />
                <button
                    type="submit"
                    aria-label="Iniciar búsqueda"
                    className={styles.searchButton}
                >
                    Buscar 
                </button>

                {initialQuery && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        aria-label="Limpiar búsqueda"
                        className={styles.clearButton}
                    >
                        Limpiar
                    </button>
                )}
            </form>
        </div>
    );
};

export default SearchBar;