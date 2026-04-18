// components/Footer.js
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <strong>SubeTuLibro</strong>
                    <p>Biblioteca digital con acceso rápido, filtros inteligentes y contenido premium.</p>
                </div>

                <div className="footer-links-group">
                    <h4>Enlaces</h4>
                    <Link href="/">Inicio</Link>
                    <Link href="/auth/login">Iniciar sesión</Link>
                    <Link href="/auth/register">Crear cuenta</Link>
                </div>

                <div className="footer-links-group">
                    <h4>Soporte</h4>
                    <Link href="/privacy">Privacidad</Link>
                    <Link href="/terms">Términos</Link>
                    <Link href="/sobre-nosotros/page">Sobre nosotros</Link>
                </div>

                <div className="footer-info">
                    <p>© {currentYear} SubeTuLibro. Todos los derechos reservados.</p>
                    <p>Diseño moderno, lectura rápida y experiencia móvil optimizada.</p>
                </div>
            </div>
            <style jsx>{`
                .main-footer {
                    background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
                    color: #d1d5db;
                    padding: 48px 3vw;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                }
                .footer-grid {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(180px, 1fr));
                    gap: 32px;
                    align-items: flex-start;
                }
                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .footer-brand strong {
                    color: #fff;
                    font-size: 1.2rem;
                    letter-spacing: 0.03em;
                }
                .footer-brand p {
                    margin: 0;
                    color: #9ca3af;
                    font-size: 0.95rem;
                    line-height: 1.7;
                }
                .footer-links-group h4 {
                    margin: 0 0 12px;
                    color: #f8fafc;
                    font-size: 1rem;
                    letter-spacing: 0.01em;
                }
                .footer-links-group a {
                    display: block;
                    margin-bottom: 10px;
                    color: #cbd5e1;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                }
                .footer-links-group a:hover {
                    color: #f97316;
                }
                .footer-info p {
                    margin: 0 0 8px;
                    color: #9ca3af;
                    line-height: 1.7;
                    font-size: 0.95rem;
                }

                @media (max-width: 900px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                @media (max-width: 640px) {
                    .main-footer {
                        padding: 32px 2rem;
                    }
                    .footer-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </footer>
    );
}