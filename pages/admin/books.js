// pages/admin/books.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import styles from '../../styles/Admin.module.css';
import { fetchBooks, createBook, updateBook, deleteBook } from '../../services/llamados/books';

export default function AdminBooksPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    portada: '',
    sinopsis: '',
    autor: '',
    categorias: '',
    link: '',
    anio: '',
    idioma: '',
    fileType: '',
    paginas: '',
    isPremium: false,
    isExclusive: false,
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/');
      } else {
        setLoading(false);
        loadBooks();
      }
    } else {
      router.push('/auth/login');
    }
  }, []);

  const loadBooks = async () => {
    try {
      const response = await fetchBooks();
      setBooks(response.books || []);
    } catch (error) {
      console.error('Error al cargar libros:', error);
      setMessage('Error al cargar los libros.');
      setMessageType('error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const bookData = {
        ...formData,
        categorias: formData.categorias.split(',').map((cat) => cat.trim()),
        anio: parseInt(formData.anio, 10),
        paginas: parseInt(formData.paginas, 10),
      };

      if (editingBookId) {
        await updateBook(editingBookId, bookData);
        setMessage('Libro actualizado exitosamente.');
      } else {
        await createBook(bookData);
        setMessage('Libro creado exitosamente.');
      }
      setMessageType('success');
      setFormData({
        titulo: '', portada: '', sinopsis: '', autor: '', categorias: '', link: '',
        anio: '', idioma: '', fileType: '', paginas: '', isPremium: false, isExclusive: false,
      });
      setEditingBookId(null);
      loadBooks();
    } catch (error) {
      setMessage(error.message || 'Error al guardar el libro.');
      setMessageType('error');
    }
  };

  const handleEdit = (book) => {
    setEditingBookId(book._id);
    setFormData({
      titulo: book.titulo,
      portada: book.portada,
      sinopsis: book.sinopsis,
      autor: book.autor,
      categorias: book.categorias.join(', '),
      link: book.link,
      anio: book.anio,
      idioma: book.idioma,
      fileType: book.fileType,
      paginas: book.paginas,
      isPremium: book.isPremium,
      isExclusive: book.isExclusive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (idBook) => {
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

  if (loading) {
    return (
      <Layout>
        <Head>
          <title>Cargando...</title>
        </Head>
        <main className={styles.mainContent}>
          <p>Cargando página de administración...</p>
        </main>
      </Layout>
    );
  }

  if (user && user.role !== 'admin') {
    return (
      <Layout>
        <Head>
          <title>Acceso Denegado</title>
        </Head>
        <main className={styles.mainContent}>
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para acceder a esta página.</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Administrar Libros | subetulibro</title>
      </Head>
      <main className={styles.mainContent}>
        <h1>Administrar Libros</h1>

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        <div className={styles.formContainer}>
          <h2>{editingBookId ? 'Editar Libro' : 'Crear Nuevo Libro'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="titulo">Título</label>
              <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="autor">Autor</label>
              <input type="text" id="autor" name="autor" value={formData.autor} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="portada">URL Portada</label>
              <input type="url" id="portada" name="portada" value={formData.portada} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sinopsis">Sinopsis</label>
              <textarea id="sinopsis" name="sinopsis" value={formData.sinopsis} onChange={handleChange}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="categorias">Categorías (separadas por coma)</label>
              <input type="text" id="categorias" name="categorias" value={formData.categorias} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="link">URL de Descarga</label>
              <input type="url" id="link" name="link" value={formData.link} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="anio">Año</label>
              <input type="number" id="anio" name="anio" value={formData.anio} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="idioma">Idioma</label>
              <input type="text" id="idioma" name="idioma" value={formData.idioma} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="fileType">Tipo de Archivo</label>
              <input type="text" id="fileType" name="fileType" value={formData.fileType} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="paginas">Páginas</label>
              <input type="number" id="paginas" name="paginas" value={formData.paginas} onChange={handleChange} />
            </div>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="isPremium" name="isPremium" checked={formData.isPremium} onChange={handleChange} />
              <label htmlFor="isPremium">Es Premium</label>
            </div>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="isExclusive" name="isExclusive" checked={formData.isExclusive} onChange={handleChange} />
              <label htmlFor="isExclusive">Es Exclusivo</label>
            </div>
            <button type="submit" className={styles.submitButton}>
              {editingBookId ? 'Actualizar Libro' : 'Crear Libro'}
            </button>
            {editingBookId && (
              <button type="button" className={styles.submitButton} onClick={() => {
                setEditingBookId(null);
                setFormData({
                  titulo: '', portada: '', sinopsis: '', autor: '', categorias: '', link: '',
                  anio: '', idioma: '', fileType: '', paginas: '', isPremium: false, isExclusive: false,
                });
              }} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
                Cancelar Edición
              </button>
            )}
          </form>
        </div>

        <div className={styles.bookListContainer}>
          <h2>Libros Existentes</h2>
          <table className={styles.bookTable}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Año</th>
                <th>Premium</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.titulo}</td>
                  <td>{book.autor}</td>
                  <td>{book.anio}</td>
                  <td>{book.isPremium ? 'Sí' : 'No'}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(book)}>Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(book._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
