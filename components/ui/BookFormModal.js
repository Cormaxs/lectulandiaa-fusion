// components/ui/BookFormModal.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/BookFormModal.module.css';
import { uploadBookFile } from '../../services/llamados/telegram';

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

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
      setPdfFile(null);
      setPdfError('');
      setIsUploading(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPdfFile(null);
      setPdfError('');
      return;
    }

    if (file.type !== 'application/pdf') {
      setPdfError('Solo se permiten archivos PDF.');
      setPdfFile(null);
      e.target.value = '';
      return;
    }

    const maxSize = 19 * 1024 * 1024;
    if (file.size > maxSize) {
      setPdfError(`El archivo excede el tamaño máximo de 19 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      setPdfFile(null);
      e.target.value = '';
      return;
    }

    setPdfError('');
    setPdfFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si hay un PDF seleccionado, lo subimos junto con todos los datos del libro
    if (pdfFile) {
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();

        // Añadir el archivo PDF
        uploadFormData.append('file', pdfFile);

        // Añadir todos los campos del libro al FormData
        uploadFormData.append('titulo', formData.titulo);
        uploadFormData.append('autor', formData.autor);
        uploadFormData.append('portada', formData.portada);
        uploadFormData.append('sinopsis', formData.sinopsis);
        uploadFormData.append('link', formData.link);
        uploadFormData.append('anio', formData.anio);
        uploadFormData.append('idioma', formData.idioma);
        uploadFormData.append('fileType', formData.fileType);
        uploadFormData.append('paginas', formData.paginas);
        uploadFormData.append('isPremium', formData.isPremium);
        uploadFormData.append('isExclusive', formData.isExclusive);

        // Las categorías se envían como string (el backend las convertirá a array)
        uploadFormData.append('categorias', formData.categorias);

        // Enviamos la petición
        const response = await uploadBookFile(uploadFormData);

        // Verificamos la respuesta (estructura esperada: { success, libro })
        if (response?.success === true && response?.libro) {
          // Pasamos el libro completo al padre para que actualice la UI o lo que necesite
          onSubmit(response.libro);
          // Cerramos el modal
          onClose();
        } else {
          throw new Error(response?.message || 'Error al procesar el libro');
        }
      } catch (error) {
        console.error('Error al subir PDF y crear libro:', error);
        setPdfError(error.message || 'Error al subir el archivo. Intenta nuevamente.');
      } finally {
        setIsUploading(false);
      }
    } else {
      // No hay PDF: enviamos solo los datos del libro (sin archivo)
      // Nota: aquí asumimos que el padre manejará la creación/edición normal
      onSubmit({
        ...formData,
        pdfUrl: null,
      });
      onClose();
    }
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
            <input type="url" id="link" name="link" value={formData.link} onChange={handleChange} />
            <small className={styles.helperText}>
              Si subes un PDF, se ignorará este enlace.
            </small>
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

          <div className={styles.formGroup}>
            <label htmlFor="pdf">Archivo PDF (opcional, máx. 19 MB)</label>
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={isUploading}
            />
            {pdfError && <span className={styles.errorText}>{pdfError}</span>}
            {pdfFile && !pdfError && (
              <span className={styles.fileInfo}>
                Archivo seleccionado: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(2)} KB)
              </span>
            )}
            {isUploading && <span className={styles.uploadingText}>Subiendo PDF y creando libro, por favor espera...</span>}
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
            <button type="submit" className={styles.submitButton} disabled={isUploading}>
              {isUploading ? 'Procesando...' : (isEditing ? 'Actualizar Libro' : 'Crear Libro')}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isUploading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;