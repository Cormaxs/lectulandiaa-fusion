import { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const DynamicSearchHeaderBar = dynamic(() => import('../features/SearchHeaderBar'), { ssr: false });

function Header() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Siempre usar /explore como basePath para búsquedas
    const basePath = '/explore';

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.clear();
            }
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        window.location.href = '/';
    }, []);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    return (
        <header className="main-header">
            <div className="header-inner">
                {/* LOGO */}
                <Link href="/" legacyBehavior>
                    <a onClick={closeMenu} className="brand-link">
                        <Image
                            src="/logo.webp"
                            alt="SubeTuLibro"
                            className="brand-logo"
                            width={40}
                            height={40}
                        />
                        <span className="brand-text">SUBETULIBRO.COM</span>
                    </a>
                </Link>

                {/* BUSCADOR EN HEADER */}
                <DynamicSearchHeaderBar basePath={basePath} />

                {/* BOTÓN HAMBURGUESA (Solo móvil) */}
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                    onClick={toggleMenu}
                    aria-label="Abrir menú"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                {/* NAVEGACIÓN */}
                <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <Link href="/" legacyBehavior>
                                <a onClick={closeMenu}>Inicio</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/explore" legacyBehavior>
                                <a onClick={closeMenu}>Explorar</a>
                            </Link>
                        </li>

                        {isClient && user ? (
                            <>
                                <li>
                                    <a className="user-profile-link" onClick={closeMenu}>
                                        <div className="avatar-circle">
                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span>{user.username}</span>
                                    </a>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="logout-button">
                                        Cerrar sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/auth/login" legacyBehavior>
                                        <a onClick={closeMenu}>Iniciar sesión</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/auth/register" legacyBehavior>
                                        <a className="primary-action" onClick={closeMenu}>
                                            Crear cuenta
                                        </a>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>

            <style jsx>{`
                .main-header {
                    background: #ffffff;
                    border-bottom: 1px solid #f1f5f9;
                    padding: 12px 3vw;
                    min-height: 70px;
                    height: auto;
                    display: flex;
                    align-items: center;
                    position: fixed;
                    width: 100%;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                }

                .header-inner {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .brand-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    z-index: 1100;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .brand-logo { width: 38px; height: 38px; }
                .brand-text {
                    font-size: 1rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    color: #0f172a;
                }

                /* NAVEGACIÓN DESKTOP */
                .main-nav ul {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .main-nav a {
                    color: #475569;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: color 0.2s;
                }

                .main-nav a:hover { color: #f97316; }

                .primary-action {
                    background: #f97316;
                    color: white !important;
                    padding: 10px 20px;
                    border-radius: 12px;
                    transition: transform 0.2s, background 0.2s !important;
                }

                .primary-action:hover {
                    background: #ea580c;
                    transform: translateY(-2px);
                }

                /* AVATAR & LOGOUT */
                .user-profile-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .avatar-circle {
                    width: 32px;
                    height: 32px;
                    background: #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    color: #f97316;
                    border: 2px solid #f97316;
                    flex-shrink: 0;
                }

                .logout-button {
                    background: #fff1f2;
                    color: #e11d48;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .logout-button:hover { background: #ffe4e6; }

                /* HAMBURGER */
                .hamburger {
                    display: none;
                    flex-direction: column;
                    gap: 5px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 1100;
                    flex-shrink: 0;
                }

                .bar {
                    width: 25px;
                    height: 3px;
                    background-color: #0f172a;
                    border-radius: 10px;
                    transition: 0.3s;
                }

                /* MOBILE RESPONSIVE */
                @media (max-width: 1100px) {
                    .header-inner {
                        flex-wrap: wrap;
                    }
                }

                @media (max-width: 850px) {
                    .main-header {
                        padding: 10px 3vw;
                        min-height: auto;
                    }

                    .header-inner {
                        gap: 12px;
                        justify-content: flex-start;
                    }

                    .brand-link {
                        order: 1;
                        flex-basis: auto;
                    }

                    .hamburger {
                        display: flex;
                        order: 3;
                        margin-left: auto;
                    }
                    
                    .hamburger.active .bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
                    .hamburger.active .bar:nth-child(2) { opacity: 0; }
                    .hamburger.active .bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

                    .main-nav {
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 100%;
                        height: 100vh;
                        background: white;
                        padding-top: 100px;
                        transition: 0.4s ease-in-out;
                        box-shadow: -10px 0 30px rgba(0,0,0,0.05);
                    }

                    .main-nav.open { right: 0; }

                    .main-nav ul {
                        flex-direction: column;
                        gap: 30px;
                        padding: 0 20px;
                    }

                    .main-nav a { font-size: 1.2rem; }

                    .brand-text {
                        display: none;
                    }
                }
            `}</style>
        </header>
    );
}

export default memo(Header);