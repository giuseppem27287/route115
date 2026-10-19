import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';
import { Preloader } from '@/components/layout/Preloader';
import { ModalProvider } from '@/context/ModalContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useLanguage } from '@/hooks/useLanguage';
import BarberPage from '@/pages/Barber';
import EventsPage from '@/pages/Events';
import GaragePage from '@/pages/Garage';
import HomePageView from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';
import RentalPage from '@/pages/Rental';
import TattooPage from '@/pages/Tattoo';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePageView />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/rental" element={<RentalPage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/barber" element={<BarberPage />} />
        <Route path="/tattoo" element={<TattooPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

/** Shows the <Preloader /> until the locale has been hydrated on first mount. */
function AppShell() {
  const { ready } = useLanguage();
  if (!ready) return <Preloader />;
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
