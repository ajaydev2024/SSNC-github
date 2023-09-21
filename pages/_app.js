
import '../styles/globals.css'
import '../styles/inventoryItems.css'

import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BrandProvider } from '../components/BrandContext';



export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Example of accessing router properties
  useEffect(() => {
  }, [router]);

  return (
    <>
        <BrandProvider>
          <Component {...pageProps} />
        </BrandProvider>
      <Analytics />

    </>
  );
}
