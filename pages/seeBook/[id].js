import { fetchBookById, createBook, updateBook, deleteBook } from '../../services/llamados/books';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import BackLink from '../../components/features/book-detail/BackLink';
import BookCover from '../../components/features/book-detail/BookCover';
import BookInfo from '../../components/features/book-detail/BookInfo';
import DownloadButton from '../../components/features/book-detail/DownloadButton';
import styles from '../../styles/BookDetail.module.css';
import { useState, useEffect } from 'react';
import { rateBook, getUserRatings } from '../../services/llamados/rating';
import BookFormModal from '../../components/ui/BookFormModal'; // Importar el modal

// 📚 Dominio base para la URL canónica y Open Graph. ¡CÁMBIALO!
const BASE_DOMAIN = 'https://subetulibro.com';

export default function SeeBookPage({ book: initialBook, fullSlug }) {
    const [book, setBook] = useState(initialBook); // Usar estado para el libro
    const [user, setUser] = useState(null);
    const [hasRated, setHasRated] = useState(false);
    const [currentRating, setCurrentRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loadingRating, setLoadingRating] = useState(false);
    const [ratingMessage, setRatingMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para el modal de edición
    const [message, setMessage] = useState(''); // Mensajes de éxito/error
    const [messageType, setMessageType] = useState(''); // Tipo de mensaje

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            checkUserRating(parsedUser._id, book._id);
        }
    }, [book._id]);

    const checkUserRating = async (userId, bookId) => {
        try {
            const response = await getUserRatings(userId);
            const userRatings = response.data;
            const foundRating = userRatings.find(r => r.book._id === bookId);
            if (foundRating) {
                setHasRated(true);
                setCurrentRating(foundRating.rating);
            }
        } catch (error) {
            console.error('Error al verificar la calificación del usuario:', error);
        }
    };

    const handleRating = async (selectedRating) => {
       if (!user || (user.role !== 'user' && user.role !== 'admin') || hasRated || loadingRating) return; // Solo usuarios 'user' pueden calificar

        setLoadingRating(true);
        setRatingMessage('');

        try {
            await rateBook(book._id, user._id, selectedRating);
            setCurrentRating(selectedRating);
            setHasRated(true);
            setRatingMessage('¡Gracias por tu calificación!');
            // Opcional: Recargar el libro para ver el averageRating actualizado
            // const updatedBook = await fetchBookById(fullSlug);
            // if (updatedBook) setBook(updatedBook);
        } catch (error) {
            setRatingMessage(error.message || 'Error al calificar el libro.');
            console.error('Error al calificar:', error);
        } finally {
            setLoadingRating(false);
        }
    };

    // Funciones para la edición y eliminación de libros
    const handleEdit = () => {
        if (!user || user.role !== 'admin') {
            setMessage('No tienes permisos para editar libros.');
            setMessageType('error');
            return;
        }
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!user || user.role !== 'admin') {
            setMessage('No tienes permisos para eliminar libros.');
            setMessageType('error');
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
            try {
                await deleteBook(book._id);
                setMessage('Libro eliminado exitosamente. Redirigiendo...');
                setMessageType('success');
                // Redirigir a la página principal o a una lista de libros
                window.location.href = '/';
            } catch (error) {
                setMessage(error.message || 'Error al eliminar el libro.');
                setMessageType('error');
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleModalSubmit = async (formData) => {
        setMessage('');
        setMessageType('');
        try {
            const processedBookData = {
                ...formData,
                categorias: typeof formData.categorias === 'string' 
                    ? formData.categorias.split(',').map((cat) => cat.trim()) 
                    : formData.categorias,
                anio: parseInt(formData.anio, 10),
                paginas: parseInt(formData.paginas, 10),
            };
            await updateBook(book._id, processedBookData);
            setMessage('Libro actualizado exitosamente.');
            setMessageType('success');
            setShowModal(false);
            // Recargar el libro para mostrar los datos actualizados
            const updatedBook = await fetchBookById(fullSlug);
            if (updatedBook) setBook(updatedBook);
        } catch (error) {
            setMessage(error.message || 'Error al actualizar el libro.');
            setMessageType('error');
            console.error('Error al actualizar:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // 🧠 Lógica SEO
    const canonicalUrl = `${BASE_DOMAIN}/books/${fullSlug}`;
    const truncatedDescription = book.sinopsis ? book.sinopsis.substring(0, 160) : `Sinopsis no disponible para ${book.titulo}.`;

    const bookJsonLd = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.titulo,
        "author": {
            "@type": "Person",
            "name": book.autor
        },
        "description": book.sinopsis,
        "image": book.portada,
        ...(book.averageRating && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": book.averageRating,
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": book.totalRatingsCount || 10 // Usar totalRatingsCount
            }
        }),
        "url": canonicalUrl,
        "potentialAction": book.link ? {
            "@type": "DownloadAction",
            "target": book.link
        } : undefined
    };

    return (
        <Layout>
            <Head>
                <title>{book.titulo} | {book.autor} | subetulibro</title>
                <meta
                    name="description"
                    content={`Lee la sinopsis completa de "${book.titulo}" escrito por ${book.autor}. ¡Descarga tu copia en subetulibro.com!`}
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={book.titulo} />
                <meta property="og:description" content={truncatedDescription} />
                <meta property="og:image" content={book.portada} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="book" />
                <meta property="og:site_name" content="subetulibro.com" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={book.titulo} />
                <meta name="twitter:description" content={truncatedDescription} />
                <meta name="twitter:image" content={book.portada} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
                />
            </Head>

            <main className={styles.mainContent}>
                <BackLink />

                {message && (
                    <div className={`${styles.message} ${styles[messageType]}`}>
                        {message}
                    </div>
                )}

                <div className={styles.detailFlexContainer}>
                    <BookCover book={book} />
                    <BookInfo book={book} />
                </div>

                {user && user.role === 'admin' && (
                    <div className={styles.adminActionsDetail}>
                        <button onClick={handleEdit} className={styles.editButtonDetail}>
                            Editar Libro
                        </button>
                        <button onClick={handleDelete} className={styles.deleteButtonDetail}>
                            Eliminar Libro
                        </button>
                    </div>
                )}

                {/* Sección de Calificación */}
                <div className={styles.ratingSection}>
                    <h2>Califica este libro</h2>
                    {!user ? (
                        <p>Inicia sesión para calificar este libro.</p>
                    ) : (
                        <>
                            <div className={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`${styles.star} ${
                                            (hoverRating || currentRating) >= star ? styles.filledStar : ''
                                        } ${hasRated || loadingRating || user.role !== 'user' ? styles.disabledStar : ''}`}
                                        onMouseEnter={() => !hasRated && !loadingRating && user.role === 'user' && setHoverRating(star)}
                                        onMouseLeave={() => !hasRated && !loadingRating && user.role === 'user' && setHoverRating(0)}
                                        onClick={() => handleRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            {ratingMessage && (
                                <p className={ratingMessage.includes('Gracias') ? styles.successMessage : styles.errorMessage}>
                                    {ratingMessage}
                                </p>
                            )}
                            {hasRated && <p>Ya has calificado este libro con {currentRating} estrellas.</p>}
                            {user.role !== 'user' && <p>Solo los usuarios pueden calificar libros.</p>}
                        </>
                    )}
                </div>
                    
                <DownloadButton book={book} role={user} />
            </main>

            <BookFormModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                initialData={book}
                isEditing={true}
            />
        </Layout>
    );
}

// Next.js: Se ejecuta en el servidor. Captura el 'id' de la ruta.
export async function getServerSideProps(context) {
    const fullSlug = context.params.id;
    let book = null;

    try {
        book = await fetchBookById(fullSlug);
    } catch (e) {
        console.error("Error grave al obtener el libro:", e.message);
        return { notFound: true };
    }

    if (!book) {
        return { notFound: true };
    }

    return {
        props: {
            book,
            fullSlug,
        },
    };
}
