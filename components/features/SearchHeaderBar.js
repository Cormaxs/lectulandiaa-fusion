import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../../styles/SearchHeaderBar.module.css';
import { fetchBooks } from '../../services/llamados/books';
import { createSlug } from '../../utils/slug';
import { isValidImageUrl } from '../../utils/imageUtils';

const SearchHeaderBar = ({ basePath = '/' }) => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [imageErrors, setImageErrors] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        fileType: '',
        categorias: '',      // Cambiado de 'category' a 'categorias'
        autor: '',           // Cambiado de 'author' a 'autor'
        idioma: '',          // Cambiado de 'language' a 'idioma'
        anio: '',            // NUEVO: filtro por año
        isPremium: ''
    });
    const searchContainerRef = useRef(null);

    // Obtener sugerencias mientras el usuario escribe
    const getSuggestions = useCallback(async (searchTerm) => {
        const hasQuery = searchTerm && searchTerm.trim() && searchTerm.length >= 2;
        const hasActiveFilters = Object.values(filters).some(v => v !== '');

        if (!hasQuery && !hasActiveFilters) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const searchParams = { limit: 8 };
            if (hasQuery) searchParams.q = searchTerm;
            if (filters.fileType) searchParams.fileType = filters.fileType;
            if (filters.categorias) searchParams.categorias = filters.categorias;
            if (filters.autor) searchParams.autor = filters.autor;
            if (filters.idioma) searchParams.idioma = filters.idioma;
            if (filters.anio) searchParams.anio = filters.anio;
            if (filters.isPremium) searchParams.isPremium = filters.isPremium;

            const data = await fetchBooks(searchParams);
            const books = data.books || [];
            
            const uniqueBooks = [];
            const seenIds = new Set();
            
            books.forEach(book => {
                if (!seenIds.has(book._id)) {
                    seenIds.add(book._id);
                    const slug = createSlug(book.titulo);
                    const uniqueSlug = `${slug}-${book._id}`;
                    const portadaUrl = book?.portadaCloudinary || book?.portada || '';
                    const decodedPortada = typeof portadaUrl === 'string' ? portadaUrl.replace(/&amp;/g, '&') : '';
                    const fileSizeMB = book.fileSize ? (Number(book.fileSize) / (1024 * 1024)).toFixed(2) : null;
                    
                    uniqueBooks.push({
                        _id: book._id,
                        titulo: book.titulo,
                        autor: book.autor,
                        portada: decodedPortada,
                        fileType: book.fileType,
                        fileSizeMB,
                        slug: uniqueSlug
                    });
                }
            });
            
            setSuggestions(uniqueBooks);
            if (uniqueBooks.length > 0) setIsOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Búsqueda en tiempo real
    useEffect(() => {
        if (query.trim().length >= 2) {
            getSuggestions(query);
        } else if (query.length === 0) {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query, getSuggestions]);

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsOpen(false);
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const buildSearchUrl = useCallback((searchQuery = query, currentFilters = filters) => {
        const trimmedQuery = searchQuery.trim();
        const hasActiveFilters = Object.values(currentFilters).some(v => v !== '');
        
        if (!trimmedQuery && !hasActiveFilters) return null;
        
        let url = `${basePath}?page=1&limit=12`;
        if (trimmedQuery) url += `&q=${encodeURIComponent(trimmedQuery)}`;
        if (currentFilters.fileType) url += `&fileType=${encodeURIComponent(currentFilters.fileType)}`;
        if (currentFilters.categorias) url += `&categorias=${encodeURIComponent(currentFilters.categorias)}`;
        if (currentFilters.autor) url += `&autor=${encodeURIComponent(currentFilters.autor)}`;
        if (currentFilters.idioma) url += `&idioma=${encodeURIComponent(currentFilters.idioma)}`;
        if (currentFilters.anio) url += `&anio=${encodeURIComponent(currentFilters.anio)}`;
        if (currentFilters.isPremium) url += `&isPremium=${encodeURIComponent(currentFilters.isPremium)}`;
        
        return url;
    }, [basePath, query, filters]);

    const handleSearch = useCallback((e) => {
        e?.preventDefault();
        const url = buildSearchUrl(query, filters);
        if (!url) return;
        
        setIsOpen(false);
        setSuggestions([]);
        setQuery('');
        sessionStorage.removeItem('last_catalog_page');
        router.push(url);
    }, [query, filters, buildSearchUrl, router]);

    const handleViewAllResults = useCallback(() => {
        const url = buildSearchUrl(query, filters);
        if (!url) return;
        
        setIsOpen(false);
        setSuggestions([]);
        setQuery('');
        sessionStorage.removeItem('last_catalog_page');
        router.push(url);
    }, [query, filters, buildSearchUrl, router]);

    const handleSuggestionClick = (suggestion) => {
        setQuery('');
        setIsOpen(false);
        setSuggestions([]);
        router.push(`/seeBook/${suggestion.slug}`);
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    handleSearch(e);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setSelectedIndex(-1);
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        setImageErrors({});
    };

    const handleImageError = (bookId) => {
        setImageErrors(prev => ({ ...prev, [bookId]: true }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const clearFilters = () => {
        setFilters({
            fileType: '',
            categorias: '',
            autor: '',
            idioma: '',
            anio: '',
            isPremium: ''
        });
    };

    const toggleFilters = () => setShowFilters(!showFilters);

    return (
        <div className={styles.searchContainer} ref={searchContainerRef}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query && suggestions.length > 0 && setIsOpen(true)}
                        placeholder="Buscar por libro, autor, filtros..."
                        className={styles.searchInput}
                        aria-label="Término de búsqueda"
                        autoComplete="off"
                    />
                    {query && (
                        <button type="button" onClick={handleClear} className={styles.clearIcon} aria-label="Limpiar búsqueda">✕</button>
                    )}
                </div>
                <button type="submit" className={styles.searchButton} aria-label="Buscar">🔍</button>
                <button type="button" onClick={toggleFilters} className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`} aria-label="Filtros">⚙️</button>
            </form>

            {showFilters && (
                <div className={styles.filtersContainer}>
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="fileType" className={styles.filterLabel}>Formato</label>
                            <select id="fileType" value={filters.fileType} onChange={(e) => handleFilterChange('fileType', e.target.value)} className={styles.filterSelect}>
                                <option value="">Todos</option>
                                <option value="epub">EPUB</option>
                                <option value="pdf">PDF</option>
                                <option value="mobi">MOBI</option>
                                <option value="txt">TXT</option>
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="categorias" className={styles.filterLabel}>Categoría</label>
                            <input type="text" id="categorias" value={filters.categorias} onChange={(e) => handleFilterChange('categorias', e.target.value)} placeholder="Ej: Romance, Ciencia Ficción..." className={styles.filterInput} />
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="autor" className={styles.filterLabel}>Autor</label>
                            <input type="text" id="autor" value={filters.autor} onChange={(e) => handleFilterChange('autor', e.target.value)} placeholder="Nombre del autor..." className={styles.filterInput} />
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="idioma" className={styles.filterLabel}>Idioma</label>
                            <select id="idioma" value={filters.idioma} onChange={(e) => handleFilterChange('idioma', e.target.value)} className={styles.filterSelect}>
                                <option value="">Todos</option>
                                <option value="es">Español</option>
                                <option value="en">Inglés</option>
                                <option value="fr">Francés</option>
                                <option value="pt">Portugués</option>
                                <option value="de">Alemán</option>
                                <option value="it">Italiano</option>
                                <option value="ja">Japonés</option>
                                <option value="zh">Chino</option>
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="anio" className={styles.filterLabel}>Año</label>
                            <input type="number" id="anio" value={filters.anio} onChange={(e) => handleFilterChange('anio', e.target.value)} placeholder="Ej: 2024" className={styles.filterInput} min="1900" max="2030" step="1" />
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="isPremium" className={styles.filterLabel}>Tipo</label>
                            <select id="isPremium" value={filters.isPremium} onChange={(e) => handleFilterChange('isPremium', e.target.value)} className={styles.filterSelect}>
                                <option value="">Todos</option>
                                <option value="true">Solo Premium</option>
                                <option value="false">Solo Gratis</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.filterActions}>
                        <button type="button" onClick={clearFilters} className={styles.clearFiltersButton}>Limpiar filtros</button>
                    </div>
                </div>
            )}

            {isOpen && suggestions.length > 0 && (
                <div className={styles.suggestionsContainer}>
                    <div className={styles.suggestionsWrapper}>
                        <ul className={styles.suggestionsDropdown}>
                            {suggestions.map((suggestion, index) => (
                                <li key={suggestion._id}>
                                    <button type="button" onClick={() => handleSuggestionClick(suggestion)} className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}>
                                        {isValidImageUrl(suggestion.portada) && !imageErrors[suggestion._id] ? (
                                            <Image src={suggestion.portada} alt={suggestion.titulo} className={styles.bookCover} width={60} height={80} onError={() => handleImageError(suggestion._id)} placeholder="blur" blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEB//EACUQAAIBAwMEAwEBAAAAAAAAAAECAwAEEQUSITFBURNhcZEigf/EABUBAQEAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A4+iiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==" />
                                        ) : (
                                            <div className={styles.bookCoverPlaceholder}>📕</div>
                                        )}
                                        <div className={styles.suggestionContent}>
                                            <div className={styles.suggestionTitle}>{suggestion.titulo}</div>
                                            {suggestion.autor && <div className={styles.suggestionAuthor}>{suggestion.autor}</div>}
                                            {(suggestion.fileType || suggestion.fileSizeMB) && (
                                                <div className={styles.suggestionMeta}>
                                                    {suggestion.fileType && <span>{suggestion.fileType.toUpperCase()}</span>}
                                                    &nbsp;
                                                    {suggestion.fileSizeMB && <span>{suggestion.fileSizeMB} MB</span>}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button type="button" onClick={handleViewAllResults} className={styles.viewAllButton}>Ver todos los resultados</button>
                    </div>
                </div>
            )}

            {isLoading && query.length >= 2 && <div className={styles.loadingMessage}>Buscando...</div>}
        </div>
    );
};

export default SearchHeaderBar;