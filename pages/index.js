import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/layout/Layout';
import BookCarousel from '../components/features/BookCarousel';
import styles from '../styles/Home.module.css';
import { fetchBooks, createBook, updateBook, deleteBook } from '../services/llamados/books';
import { useState, useEffect } from 'react';
import BookFormModal from '../components/ui/BookFormModal';
import Link from 'next/link';

const CAROUSEL_SECTIONS_CONFIG = [
    { key: 'jkRowling', display: 'Libros de J.K. Rowling', params: { autor: 'J.K. Rowling' } },
    { key: 'Franz Kafka', display: 'Libros de Franz Kafka', params: { autor: 'Franz Kafka' } },
    { key: 'suspenso', display: 'Libros de Stephen King', params: { autor: 'Stephen King' } },
    { key: 'garciaMarquez', display: 'Libros de Gabriel García Márquez', params: { autor: 'Gabriel García' } },
    {key: 'Agatha Christie', display: 'Libros de Agatha Christie', params: { autor: 'Agatha Christie' } },
    {key:'H. P. Lovecraft', display: 'Libros de H. P. Lovecraft', params: { autor: 'H. P. Lovecraft' } },
    {key:'Isaac Asimov', display: 'Libros de Isaac Asimov', params: { autor: 'Isaac Asimov' } },
];

function Home({ initialSectionsData }) {
    const [sectionsData, setSectionsData] = useState(initialSectionsData);
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

    const loadBooks = async () => {
        const newSectionsData = {};
        await Promise.allSettled(
            CAROUSEL_SECTIONS_CONFIG.map(async (section) => {
                try {
                    const data = await fetchBooks({ ...section.params, limit: 20 });
                    newSectionsData[section.key] = {
                        books: data.books || [],
                        error: null
                    };
                } catch (error) {
                    console.error(`Error fetching section ${section.key}:`, error);
                    newSectionsData[section.key] = {
                        books: [],
                        error: error.message
                    };
                }
            })
        );
        setSectionsData(newSectionsData);
    };

    const handleEdit = (book) => {
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
                categorias: typeof bookData.categorias === 'string' 
                    ? bookData.categorias.split(',').map((cat) => cat.trim()) 
                    : bookData.categorias,
                anio: parseInt(bookData.anio, 10),
                paginas: parseInt(bookData.paginas, 10),
            };

            if (editingBook) {
                await updateBook(editingBook._id, processedBookData);
                setMessage('Libro actualizado exitosamente.');
            } else {
                // Si bookData tiene _id, significa que ya fue creado por upload de PDF
                if (bookData._id) {
                    setMessage('Libro creado exitosamente.');
                } else {
                    await createBook(processedBookData);
                    setMessage('Libro creado exitosamente.');
                }
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

    return (
        <Layout>
            <Head>
                <title>subetulibro - Libros Destacados</title>
                <meta name="description" content="Descubre libros destacados por categorías. Explora novelas, libros de terror y obras de J.K. Rowling." />
            </Head>

            <main className={styles.mainContent}>
                <h1 className={styles.header}>
                   Autores Destacados 
                </h1>
                
                <p className={styles.premiumPrompt}>
    ¿Cansado de los anuncios? 
    <Link href="/premium" className={styles.premiumLink}>
         Hazte premium
    </Link>
</p>

                

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

                {/* Secciones destacadas */}
                {CAROUSEL_SECTIONS_CONFIG.map(section => (
                    <BookCarousel
                        key={section.key}
                        books={sectionsData[section.key]?.books || []}
                        title={section.display}
                        isLoading={false} // Los datos ya están cargados
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
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

export async function getStaticProps() {
    const sectionsData = {};

    await Promise.allSettled(
        CAROUSEL_SECTIONS_CONFIG.map(async (section) => {
            try {
                const data = await fetchBooks({ ...section.params, limit: 20 });
                sectionsData[section.key] = {
                    books: data.books || [],
                    error: null
                };
            } catch (error) {
                console.error(`Error fetching section ${section.key}:`, error);
                sectionsData[section.key] = {
                    books: [],
                    error: error.message
                };
            }
        })
    );

    return {
        props: {
            initialSectionsData: sectionsData,
        },
        revalidate: 3600, // Re-generar la página cada hora (o según necesidad)
    };
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
