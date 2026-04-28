// pages/_app.js
import Script from 'next/script';
import '../styles/global.css';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// ID de seguimiento de Google Analytics
const GA_TRACKING_ID = 'G-91ZR1GVTG1';

// ID de Google AdSense
const ADSENSE_PUB_ID = 'ca-pub-5933305559914134';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      {/* 1. SCRIPT DE GOOGLE ADSENSE */}
      <Script
        id="adsbygoogle-init"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("AdSense script failed to load", e);
        }}
      /> 
      
      {/* 2. SCRIPT DE GOOGLE ANALYTICS (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      {/* 3. CONFIGURACIÓN DE ANALYTICS */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '500',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px',
          }}></div>
          <p>Cargando archivos...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Renderizado de la aplicación */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;