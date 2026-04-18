/*
import Head from 'next/head';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import styles from '../styles/Profile.module.css';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('perfil');

    return (
        <Layout>
            <Head>
                <title>Mi Perfil - SubeTuLibro</title>
                <meta name="description" content="Gestiona tu perfil, suscripción y biblioteca en SubeTuLibro." />
            </Head>

            <div className={styles.profileContainer}>
                {/* Header del Perfil */}
                <div className={styles.profileHeader}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            <span>👤</span>
                        </div>
                        <div className={styles.userInfo}>
                            <h1 className={styles.username}>Juan Pérez</h1>
                            <p className={styles.userEmail}>juan@example.com</p>
                            <span className={styles.memberBadge}>🏆 Miembro Premium</span>
                        </div>
                    </div>
                </div>

                {/* Tabs de navegación */}
                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'perfil' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('perfil')}
                    >
                        📋 Mi Perfil
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'suscripcion' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('suscripcion')}
                    >
                        ⭐ Suscripción
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'biblioteca' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('biblioteca')}
                    >
                        📚 Mi Biblioteca
                    </button>
                </div>

                {/* Contenido de Tabs */}
                <div className={styles.tabsContent}>
                    {/* Tab: Perfil */}
                    {activeTab === 'perfil' && (
                        <section className={styles.section}>
                            <div className={styles.sectionGrid}>
                                {/* Información Personal */}
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Información Personal</h2>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <label>Nombre Completo</label>
                                            <p>Juan Pérez García</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <label>Email</label>
                                            <p>juan@example.com</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <label>País</label>
                                            <p>España</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <label>Teléfono</label>
                                            <p>+34 612 345 678</p>
                                        </div>
                                    </div>
                                    <button className={styles.btnPrimary}>Editar Perfil</button>
                                </div>

                                {/* Estadísticas */}
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Estadísticas</h2>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.stat}>
                                            <div className={styles.statValue}>42</div>
                                            <div className={styles.statLabel}>Libros Leídos</div>
                                        </div>
                                        <div className={styles.stat}>
                                            <div className={styles.statValue}>28</div>
                                            <div className={styles.statLabel}>Favoritos</div>
                                        </div>
                                        <div className={styles.stat}>
                                            <div className={styles.statValue}>15</div>
                                            <div className={styles.statLabel}>Reseñas</div>
                                        </div>
                                        <div className={styles.stat}>
                                            <div className={styles.statValue}>4.5</div>
                                            <div className={styles.statLabel}>Puntuación</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actividad Reciente */}
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Actividad Reciente</h2>
                                    <div className={styles.activityList}>
                                        <div className={styles.activityItem}>
                                            <span className={styles.activityIcon}>📖</span>
                                            <div>
                                                <p>Empezaste a leer "El Quijote"</p>
                                                <small>Hace 2 días</small>
                                            </div>
                                        </div>
                                        <div className={styles.activityItem}>
                                            <span className={styles.activityIcon}>⭐</span>
                                            <div>
                                                <p>Calificaste "1984" con 5 estrellas</p>
                                                <small>Hace 5 días</small>
                                            </div>
                                        </div>
                                        <div className={styles.activityItem}>
                                            <span className={styles.activityIcon}>❤️</span>
                                            <div>
                                                <p>Agregaste "Harry Potter" a favoritos</p>
                                                <small>Hace 1 semana</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Tab: Suscripción */}
                    {activeTab === 'suscripcion' && (
                        <section className={styles.section}>
                            <div className={styles.subscriptionCard}>
                                <div className={styles.planInfo}>
                                    <h2 className={styles.cardTitle}>Tu Plan Actual</h2>
                                    <div className={styles.planBadge}>Premium</div>
                                    <div className={styles.planDetails}>
                                        <div className={styles.planDetail}>
                                            <span>Vence el:</span>
                                            <strong>31 de Diciembre, 2024</strong>
                                        </div>
                                        <div className={styles.planDetail}>
                                            <span>Precio Mensual:</span>
                                            <strong>$9.99</strong>
                                        </div>
                                        <div className={styles.planDetail}>
                                            <span>Renovación Automática:</span>
                                            <strong>Activa</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.planFeatures}>
                                    <h3>Beneficios de tu Plan</h3>
                                    <ul>
                                        <li>✅ Acceso ilimitado a todos los libros</li>
                                        <li>✅ Descarga de libros en EPUB y PDF</li>
                                        <li>✅ Sin límite de descargas mensuales</li>
                                        <li>✅ Soporte prioritario 24/7</li>
                                        <li>✅ Listas de lectura personalizadas</li>
                                        <li>✅ Sincronización en múltiples dispositivos</li>
                                    </ul>
                                </div>

                                <div className={styles.planActions}>
                                    <button className={styles.btnSecondary}>Cambiar Plan</button>
                                    <button className={styles.btnDanger}>Cancelar Suscripción</button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Tab: Biblioteca */}
                    {activeTab === 'biblioteca' && (
                        <section className={styles.section}>
                            <h2 className={styles.cardTitle}>Mis Libros Favoritos (28)</h2>
                            <div className={styles.libraryGrid}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className={styles.bookCard}>
                                        <div className={styles.bookCover}>
                                            <div className={styles.bookPlaceholder}>📕</div>
                                        </div>
                                        <div className={styles.bookInfo}>
                                            <h4>Título del Libro {i}</h4>
                                            <p className={styles.bookAuthor}>Autor {i}</p>
                                            <div className={styles.bookRating}>⭐ 4.5</div>
                                            <button className={styles.btnRemove}>➖ Favorito</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sección de Soporte */}
                <section className={styles.supportSection}>
                    <div className={styles.supportCard}>
                        <h2 className={styles.cardTitle}>¿Necesitas Ayuda?</h2>
                        <p>Si tienes alguna pregunta o problema, nuestro equipo de soporte está aquí para ayudarte.</p>
                        <div className={styles.supportActions}>
                            <button className={styles.btnPrimary}>📧 Contactar Soporte</button>
                            <button className={styles.btnSecondary}>📖 Centro de Ayuda</button>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
*/