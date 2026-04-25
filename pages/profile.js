import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // 1. Importar router
import { updateUser } from '../services/llamados/users.js';
import styles from '../styles/Profile.module.css';
import Layout from '../components/layout/Layout.js';

const Profile = () => {
  const router = useRouter(); // 2. Inicializar router
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState({ account: false });
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({ username: parsed.username, email: parsed.email, password: '' });
    }
  }, []);

  const handleSave = async (section) => {
    try {
      await updateUser(user._id, formData);
      localStorage.clear();
      alert("Perfil actualizado correctamente. Por favor, inicia sesión de nuevo.");
      window.location.href = '/auth/login';
    } catch (error) {
      alert("Error al actualizar: " + error.message);
    }
  };

  if (!user) return <Layout><div className={styles.pageWrapper}>Cargando...</div></Layout>;

  return (
    <Layout>
      {/* Eliminamos el padding excesivo del wrapper si Layout ya gestiona espacio */}
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          
          {/* Botón Volver */}
          <button className={styles.backButton} onClick={() => router.back()}>
            ← Volver
          </button>

          <h1 className={styles.title}>Mi Cuenta</h1>
          
          <div className={`${styles.card} ${styles.statusCard} ${user.isSubscribed ? styles.active : styles.inactive}`}>
            {user.isSubscribed && <span className={styles.badge}>PREMIUM</span>}
            <span className={styles.label}>ESTADO DE MEMBRESÍA</span>
            <span className={styles.value}>{user.isSubscribed ? 'Suscripción Activa' : 'Sin suscripción'}</span>
            <span className={styles.label}>PLAN ACTUAL</span>
            <span className={styles.value}>{user.planType}</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Detalles de la cuenta</h3>
              {!isEditing.account ? (
                <button className={styles.linkButton} onClick={() => setIsEditing({account: true})}>Editar</button>
              ) : (
                <div className={styles.buttonGroup}>
                   <button className={styles.linkButton} onClick={() => setIsEditing({account: false})}>Cancelar</button>
                   <button className={styles.linkButton} onClick={() => handleSave('account')}>Guardar</button>
                </div>
              )}
            </div>

            {isEditing.account ? (
              <>
                <input className={styles.input} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="Usuario" />
                <input className={styles.input} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" />
                <input type="password" className={styles.input} placeholder="Nueva contraseña (opcional)" onChange={e => setFormData({...formData, password: e.target.value})} />
              </>
            ) : (
              <>
                <span className={styles.label}>EMAIL</span> <span className={styles.value}>{user.email}</span>
                <span className={styles.label}>USUARIO</span> <span className={styles.value}>{user.username}</span>
              </>
            )}

            <span className={styles.label}>ROL</span> <span className={styles.value}>{user.role}</span>
            <span className={styles.label}>MIEMBRO DESDE</span> <span className={styles.value}>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;