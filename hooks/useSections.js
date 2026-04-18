/*
// hooks/useSections.js

import { useState, useEffect } from 'react';
import { fetchBooks } from '../services/llamados/books';

const SECTION_CONFIG = [
    { key: 'jkRowling', params: { autor: 'J.K. Rowling' } },
    { key: 'novels', params: { categorias: 'novelas' } },
    { key: 'suspenso', params: { autor: 'Stephen King' } },
    { key: 'garciaMarquez', params: { autor: 'Gabriel García' } },
];

const useSections = () => {
    const initialState = SECTION_CONFIG.reduce((acc, section) => {
        acc[section.key] = { books: [], isLoading: true, error: null };
        return acc;
    }, {});

    const [sections, setSections] = useState(initialState);

    useEffect(() => {
        const loadSections = async () => {
            await Promise.allSettled(
                SECTION_CONFIG.map(async (section) => {
                    try {
                        const data = await fetchBooks({ ...section.params, limit: 20 });
                        setSections(prev => ({
                            ...prev,
                            [section.key]: {
                                books: data.books || [],
                                isLoading: false,
                                error: null
                            }
                        }));
                    } catch (error) {
                        setSections(prev => ({
                            ...prev,
                            [section.key]: {
                                books: [],
                                isLoading: false,
                                error: error.message
                            }
                        }));
                    }
                })
            );
        };

        loadSections();
    }, []);

    return sections;
};

export default useSections;
*/