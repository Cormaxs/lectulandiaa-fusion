// utils/slug.js

/**
 * Crea un slug a partir de un texto.
 * @param {string} text - El texto a convertir en slug.
 * @returns {string} El slug generado.
 */
export const createSlug = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};