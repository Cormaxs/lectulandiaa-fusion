import Head from 'next/head';
import Layout from '../components/layout/Layout';
import BookCarousel from '../components/features/BookCarousel';
import styles from '../styles/Home.module.css';
import { fetchBooks } from '../services/llamados/books';

const CAROUSEL_SECTIONS_CONFIG = [
    { key: 'jkRowling', display: 'Libros de J.K. Rowling', params: { autor: 'J.K. Rowling' } },
    { key: 'novels', display: 'Categoría: Novelas', params: { categorias: 'novelas' } },
    { key: 'suspenso', display: 'Libros de Stephen King', params: { autor: 'Stephen King' } },
    { key: 'garciaMarquez', display: 'Libros de Gabriel García Márquez', params: { autor: 'Gabriel García' } },
];

export default function Home({ sectionsData }) {
    return (
        <Layout>
            <Head>
                <title>subetulibro - Libros Destacados</title>
                <meta name="description" content="Descubre libros destacados por categorías. Explora novelas, libros de terror y obras de J.K. Rowling." />
            </Head>

            <main className={styles.mainContent}>
                <h1 className={styles.header}>
                    Libros a un click de distancia
                </h1>

                <div className={styles.pageInfoContainer}>
                    <p className={styles.pageInfo}>
                        Descubre libros destacados por categorías y géneros.
                    </p>
                </div>

                {/* Secciones destacadas */}
                {CAROUSEL_SECTIONS_CONFIG.map(section => (
                    <BookCarousel
                        key={section.key}
                        books={sectionsData[section.key]?.books || []}
                        title={section.display}
                        isLoading={false} // Los datos ya están cargados
                    />
                ))}
            </main>
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
            sectionsData,
        },
        revalidate: 3600, // Re-generar la página cada hora (o según necesidad)
    };
}
