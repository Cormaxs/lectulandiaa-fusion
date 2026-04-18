import { fetchBookById } from '../../services/llamados/books';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import BackLink from '../../components/features/book-detail/BackLink';
import BookCover from '../../components/features/book-detail/BookCover';
import BookInfo from '../../components/features/book-detail/BookInfo';
import DownloadButton from '../../components/features/book-detail/DownloadButton';
import styles from '../../styles/BookDetail.module.css';

// 📚 Dominio base para la URL canónica y Open Graph. ¡CÁMBIALO!
const BASE_DOMAIN = 'https://subetulibro.com';

export default function SeeBookPage({ book, fullSlug }) {
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
                "ratingCount": book.reviewCount || 10
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

                <div className={styles.detailFlexContainer}>
                    <BookCover book={book} />
                    <BookInfo book={book} />
                </div>

                <DownloadButton book={book} />
            </main>
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
