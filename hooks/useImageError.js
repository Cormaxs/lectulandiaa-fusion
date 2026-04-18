import { useState } from 'react';

export const useImageError = () => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return {
        imageError,
        handleImageError,
        setImageError
    };
};
