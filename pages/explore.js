import Head from 'next/head';
import { fetchBooks, createBook, updateBook, deleteBook } from '../services/llamados/books';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/features/BookGrid';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { useHome } from '../hooks/useHome';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import BookFormModal from '../components/ui/BookFormModal';

export default function Explore({ booksData, currentPage, totalPages, error, currentQuery }) {
    const [books, setBooks] = useState(booksData?.books || []);
    const metadata = booksData?.metadata || { page: currentPage, limit: 12, totalCount: 0, totalPages: totalPages };
    const { isLoading } = useHome(currentPage, currentQuery);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        setBooks(booksData?.books || []);
    }, [booksData]);

    const loadBooks = async () => {
        try {
            const response = await fetchBooks({
                q: currentQuery,
                page: currentPage,
                limit: metadata.limit,
                idioma: '', // Puedes añadir estos filtros si los necesitas
                anio: '',
                fileType: '',
            });
            setBooks(response.books || []);
        } catch (error) {
            console.error('Error al cargar libros en Explore:', error);
            setMessage('Error al cargar los libros.');
            setMessageType('error');
        }
    };

    const handleEdit = (book) => {
        //console.log("Editando libro:", book);
        setEditingBook(book);
        setShowModal(true);
    };

    const handleDelete = async (idBook) => {
        if (!user || user.role !== 'admin') {
            setMessage('No tienes permisos para eliminar libros.');
            setMessageType('error');
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
            try {
                await deleteBook(idBook);
                setMessage('Libro eliminado exitosamente.');
                setMessageType('success');
                loadBooks();
            } catch (error) {
                setMessage(error.message || 'Error al eliminar el libro.');
                setMessageType('error');
            }
        }
    };

    const handleModalSubmit = async (bookData) => {
        setMessage('');
        setMessageType('');
        try {
            const processedBookData = {
                ...bookData,
                categorias: bookData.categorias.split(',').map((cat) => cat.trim()),
                anio: parseInt(bookData.anio, 10),
                paginas: parseInt(bookData.paginas, 10),
            };

            if (editingBook) {
                await updateBook(editingBook._id, processedBookData);
                setMessage('Libro actualizado exitosamente.');
            } else {
                await createBook(processedBookData);
                setMessage('Libro creado exitosamente.');
            }
            setMessageType('success');
            setShowModal(false);
            setEditingBook(null);
            loadBooks();
        } catch (error) {
            setMessage(error.message || 'Error al guardar el libro.');
            setMessageType('error');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBook(null);
    };

    if (error) {
        return (
            <Layout>
                <div className={styles.errorContainer}>
                    <h1>Error de Carga</h1>
                    <p>{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>{currentQuery ? `Resultados: ${currentQuery}` : `Explorar Libros - Pagina ${currentPage}`}</title>
                <meta name="description" content={currentQuery ? `Resultados de búsqueda para ${currentQuery}.` : `Explora el catálogo completo de libros, página ${currentPage}.`} />
            </Head>

            <main className={styles.mainContent}>
                <h1 className={styles.header}>
                    Explorar Catálogo Completo
                </h1>

                <div className={styles.pageInfoContainer}>
                    <p className={styles.pageInfo}>
                        {currentQuery ?
                            `${metadata.totalCount || 0} resultados para "${currentQuery}". ` :
                            `Explora ${metadata.totalCount || 0} libros disponibles. `}
                        Página {currentPage} de {totalPages}.
                    </p>
                </div>

                {user && user.role === 'admin' && (
                    <div className={styles.adminActionsContainer}>
                        <button onClick={() => setShowModal(true)} className={styles.createBookButton}>
                            Crear Nuevo Libro
                        </button>
                    </div>
                )}

                {message && (
                    <div className={`${styles.message} ${styles[messageType]}`}>
                        {message}
                    </div>
                )}

                {isLoading && <Loader />}

                <BookGrid books={books} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    currentQuery={currentQuery}
                    isLoading={isLoading}
                    basePath="/explore"
                />
            </main>

            <BookFormModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                initialData={editingBook}
                isEditing={!!editingBook}
            />
        </Layout>
    );
}

// getServerSideProps (Sin cambios, ya está optimizado)
export async function getServerSideProps(context) {
    const page = context.query.page ? parseInt(context.query.page, 10) : 1;
    const query = context.query.q || '';
    const limit = context.query.limit ? parseInt(context.query.limit, 10) : 10;
    const idioma = context.query.idioma || '';
    const anio = context.query.anio || '';
    const fileType = context.query.fileType || '';

    let booksData = null;
    let error = null;
    let totalPages = 1;

    try {
        booksData = await fetchBooks({
            q: query,
            page,
            limit,
            idioma,
            anio,
            fileType,
        });
        totalPages = booksData?.metadata?.totalPages || 1;

    } catch (e) {
        console.error("Error al obtener libros:", e.message);
        error = "No se pudieron cargar los datos del catálogo. Por favor, inténtalo de nuevo más tarde.";
    }

    return {
        props: {
            booksData: booksData || { books: [], metadata: { page, limit, totalPages: 1, totalCount: 0 } },
            currentPage: page,
            totalPages: totalPages,
            error,
            currentQuery: query,
        },
    };
}