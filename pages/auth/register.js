import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import styles from '../../styles/Auth.module.css';
import { registerUser } from '../../services/llamados/users';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await registerUser(formData);
      setMessage('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
      setFormData({ username: '', password: '', email: '' });
    } catch (error) {
      setMessage(error.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Crear Cuenta | Lectulandiaa</title>
        <meta name="description" content="Crea tu cuenta en Lectulandiaa para acceder a miles de libros" />
      </Head>

      <main className={styles.main}>
        <div className={styles.authContainer}>
          <h1>Crear Cuenta</h1>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Ingresa tu nombre de usuario"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Ingresa tu email"
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
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.authButton}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {message && (
            <div className={`${styles.message} ${message.includes('exitosamente') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          <div className={styles.authLinks}>
            <p>¿Ya tienes cuenta? <Link href="/auth/login">Inicia sesión</Link></p>
          </div>
        </div>
      </main>
    </Layout>
  );
}