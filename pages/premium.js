import React from 'react';
import styles from '../styles/Premium.module.css';

const PremiumPage = () => {
  const plans = [
    {
      id: 'mensual',
      name: 'Plan Mensual',
      price: '$2',
      period: '/mes',
      description: 'Ideal para probar el servicio sin compromisos.',
      features: ['Sin anuncios', 'Acceso a libros premium', 'Descargas rápidas', 'Sin redirecciones', 'Petición prioritaria'],
      highlight: false,
      Link: 'https://app.takenos.com/pay/ee0854f3-102e-4ea1-88e2-c1d550c66928',
    },
    {
      id: 'annual',
      name: 'Plan Anual',
      price: '$15',
      period: ' único',
      description: 'La mejor opción. Paga una vez y disfruta de todo por 12 meses.',
      features: ['Todo lo del plan mensual', 'Acceso por 1 año', 'Sin pagos recurrentes', 'Soporte prioritario'],
      highlight: true,
      Link: 'https://app.takenos.com/pay/5eca5420-0e30-4a23-b555-1b4216ac9e37',
    }
  ];

  const whatsappMessage = encodeURIComponent("¡Hola! He realizado el pago de mi suscripción premium. Mi correo de subetulibro.com es: [ESCRIBE AQUÍ TU CORREO]");
  const whatsappLink = `https://wa.me/5493834901162?text=${whatsappMessage}`;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Desbloquea Acceso Premium</h1>
        <p className={styles.subtitle}>Sigue estos 2 pasos para activar tu cuenta.</p>

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ''}`}>
              {plan.highlight && <div className={styles.badge}>MÁS POPULAR</div>}
              <h2>{plan.name}</h2>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
              <p className={styles.description}>{plan.description}</p>
              <ul className={styles.features}>
                {plan.features.map((f, i) => <li key={i}>✓ {f}</li>)}
              </ul>
              <button className={styles.button} onClick={() => window.open(plan.Link, '_blank', 'noopener,noreferrer')}>
                Realizar Pago
              </button>
            </div>
          ))}
        </div>

        {/* --- PASO 2: ACTIVACIÓN (Estilo Netflix) --- */}
        <div className={styles.activationBox}>
          <h3>¿Cómo activo mi cuenta?</h3>
          <p>Una vez completado el pago, envíame el comprobante y el correo de tu cuenta:</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
            💬 Enviar detalles por WhatsApp
          </a>
          <p className={styles.smallNote}>Tu cuenta se activará manualmente en breve tras recibir tu mensaje.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;