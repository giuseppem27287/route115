import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Scrolls back to the top on every navigation.
 *
 * Note: react-router's `<ScrollRestoration />` only works with a data router
 * (`createBrowserRouter`), so we restore the position ourselves here — the app
 * is mounted on the classic `<BrowserRouter>`.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** Shared route chrome: Header + page content + Footer. */
export function Layout() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-coal-950">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ignition-500 focus:px-4 focus:py-2 focus:text-black"
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
