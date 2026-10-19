import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';
import { Preloader } from '@/components/layout/Preloader';
import { ModalProvider } from '@/context/ModalContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useLanguage } from '@/hooks/useLanguage';
import AboutPage from '@/pages/About';
import BarberPage from '@/pages/Barber';
import BookingBandPage from '@/pages/BookingBand';
import EventsPage from '@/pages/Events';
import GaragePage from '@/pages/Garage';
import HomePageView from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';
import RentalPage from '@/pages/Rental';
import StorePage from '@/pages/Store';
import TattooPage from '@/pages/Tattoo';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePageView />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/rental" element={<RentalPage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/barber-shop" element={<BarberPage />} />
        <Route path="/tattoo-studio" element={<TattooPage />} />
        <Route path="/booking-band" element={<BookingBandPage />} />
        {/* Legacy paths from the first architecture iteration */}
        <Route path="/barber" element={<Navigate to="/barber-shop" replace />} />
        <Route path="/tattoo" element={<Navigate to="/tattoo-studio" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

/**
 * Shows the boot <Preloader /> until the locale has been hydrated *and* the
 * gauge animation has finished — the Figma Make boot sequence.
 */
function AppShell() {
  const { ready } = useLanguage();
  const [booted, setBooted] = useState(false);

  if (!ready || !booted) return <Preloader onDone={() => setBooted(true)} />;
  return <AppRoutes />;
}

export default function App() {
  return (
    <LanguageProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ModalProvider>
    </LanguageProvider>
  );
}
