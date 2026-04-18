// utils/pagination.js

/**
 * Genera un rango de paginación con botones visibles limitados.
 * @param {number} currentPage - La página actual.
 * @param {number} totalPages - El total de páginas.
 * @param {number} maxVisibleButtons - Máximo número de botones visibles (por defecto 5).
 * @returns {Array} Array de objetos con type, number, label.
 */
export const getPaginationRange = (currentPage, totalPages, maxVisibleButtons = 5) => {
    if (totalPages <= 1) return [];

    const pages = [];
    const sideButtons = Math.floor((maxVisibleButtons - 1) / 2);

    let startPage = Math.max(1, currentPage - sideButtons);
    let endPage = Math.min(totalPages, currentPage + sideButtons);

    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    if (endPage - startPage + 1 < maxVisibleButtons) {
        endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    }

    if (currentPage > 1) {
        pages.push({ type: 'prev', number: currentPage - 1, label: '← Anterior' });
    }

    if (startPage > 1) {
        pages.push({ type: 'page', number: 1 });
        if (startPage > 2) {
            pages.push({ type: 'ellipsis', label: '...' });
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push({ type: 'page', number: i });
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push({ type: 'ellipsis', label: '...' });
        }
        pages.push({ type: 'page', number: totalPages });
    }

    if (currentPage < totalPages) {
        pages.push({ type: 'next', number: currentPage + 1, label: 'Siguiente →' });
    }

    return pages;
};