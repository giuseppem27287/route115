import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/hooks/useLanguage';

/** Shared route chrome: Header + page content + Footer. */
export function Layout() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-rust-500 focus:px-4 focus:py-2 focus:text-coal-950"
      >
        {t('header.skipToContent')}
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
