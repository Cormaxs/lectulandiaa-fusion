// pages/_app.js
import Script from 'next/script';
import '../styles/global.css';

// ID de seguimiento de Google Analytics
const GA_TRACKING_ID = 'G-91ZR1GVTG1';

// ID de Google AdSense
const ADSENSE_PUB_ID = 'ca-pub-5933305559914134';

export default function MyApp({ Component, pageProps }) {
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

      {/* Renderizado de la aplicación */}
      <Component {...pageProps} />
    </>
  );
}