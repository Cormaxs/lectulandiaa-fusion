// hooks/useHome.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// ⭐️ CONSTANTE CLAVE para Session Storage
const PAGE_STORAGE_KEY = 'michaelscott';

export const useHome = (currentPage, currentQuery) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // EFECTO 1: Monitorear cambios de ruta (Loading State & Guardar Pág.)
    useEffect(() => {
        const handleStart = (url) => {
            if (url.startsWith('/?page=') || url.startsWith('/?q=')) {
                setIsLoading(true);
            }
        };
        const handleComplete = () => setIsLoading(false);

        // Guardar la página actual al hacer clic en una tarjeta de libro
        const savePageAndNavigate = (e) => {
            if (e.target.closest('a[href^="/seeBook/"]')) {
                sessionStorage.setItem(PAGE_STORAGE_KEY, currentPage.toString());
            }
        };

        const grid = document.getElementById('books-grid');
        if (grid) {
            grid.addEventListener('click', savePageAndNavigate);
        }

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
            if (grid) {
                grid.removeEventListener('click', savePageAndNavigate);
            }
        };
    }, [router, currentPage]);

    // EFECTO 2: Redirección al volver a la raíz y Guardar Query
    useEffect(() => {
        if (router.isReady && router.pathname === '/' && !router.query.page && !router.query.q) {
            const lastPage = sessionStorage.getItem(PAGE_STORAGE_KEY);

            if (lastPage && parseInt(lastPage, 10) > 1) {
                // Redirigir a la última página con el query de búsqueda si existía
                const lastQuery = sessionStorage.getItem('last_catalog_query') || '';
                const newUrl = lastQuery
                    ? `/?q=${encodeURIComponent(lastQuery)}&page=${lastPage}`
                    : `/?page=${lastPage}`;

                router.replace(newUrl, undefined, { shallow: false });
                sessionStorage.removeItem(PAGE_STORAGE_KEY);
            }
        }

        // Guardar el query actual en sessionStorage al montar o cambiar
        if (currentQuery) {
            sessionStorage.setItem('last_catalog_query', currentQuery);
        } else {
            sessionStorage.removeItem('last_catalog_query');
        }

    }, [router, currentQuery]);

    return { isLoading };
};