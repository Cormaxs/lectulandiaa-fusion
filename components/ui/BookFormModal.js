// components/ui/BookFormModal.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/BookFormModal.module.css'; // Necesitaremos crear este CSS

const BookFormModal = ({ isOpen, onClose, onSubmit, initialData = {}, isEditing }) => {
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

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        titulo: initialData.titulo || '',
        portada: initialData.portada || '',
        sinopsis: initialData.sinopsis || '',
        autor: initialData.autor || '',
        categorias: initialData.categorias ? initialData.categorias.join(', ') : '',
        link: initialData.link || '',
        anio: initialData.anio || '',
        idioma: initialData.idioma || '',
        fileType: initialData.fileType || '',
        paginas: initialData.paginas || '',
        isPremium: initialData.isPremium || false,
        isExclusive: initialData.isExclusive || false,
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditing ? 'Editar Libro' : 'Crear Nuevo Libro'}</h2>
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
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? 'Actualizar Libro' : 'Crear Libro'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;
