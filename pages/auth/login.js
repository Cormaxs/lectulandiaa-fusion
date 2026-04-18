import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import styles from '../../styles/Auth.module.css';
import { loginUser } from '../../services/llamados/users';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveAuthSession = (responseData) => {
    if (typeof window === 'undefined') return;

    // Extraer token y user de la respuesta anidada
    const { token, user } = responseData;
    
    if (!token) {
      throw new Error('Token no recibido del servidor.');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user || {}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await loginUser(formData);
      saveAuthSession(data);
      setMessage('Login exitoso. Redirigiendo...');
      router.push('/');
    } catch (error) {
      setMessage(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Iniciar Sesión | Lectulandiaa</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Lectulandiaa" />
      </Head>

      <main className={styles.main}>
        <div className={styles.authContainer}>
          <h1>Iniciar Sesión</h1>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nombre de usuario o Email</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Ingresa tu nombre de usuario o email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.authButton}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {message && (
            <div className={`${styles.message} ${message.toLowerCase().includes('exitoso') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          <div className={styles.authLinks}>
            <p>¿No tienes cuenta? <Link href="/auth/register">Crear cuenta</Link></p>
          </div>
        </div>
      </main>
    </Layout>
  );
}