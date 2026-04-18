/**
 * Validar si una URL es válida y segura para cargar como imagen
 */
export const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const urlObj = new URL(url);
        // Permitir http y https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Obtener una URL de imagen segura con fallback a placeholder
 */
export const getSafeImageUrl = (url, placeholder = null) => {
    return isValidImageUrl(url) ? url : placeholder;
};
