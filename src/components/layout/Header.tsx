import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Logo } from '@/components/ui/Logo';
import { NAV_GROUPS, SITE_NAME, type NavGroup } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Fixed top bar with the oversized Route 115 crest, two dropdown groups
 * ("Moto" and "Servizi") plus the direct links — Figma Make design on top of
 * our `LanguageSwitcher` / `useLanguage` architecture.
 */
export function Header() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const location = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menus whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [location.pathname]);

  const hoverOpen = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(key);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 150);
  };

  const topLinkClass =
    'font-condensed text-sm font-bold uppercase tracking-widest transition-colors';
  const activeTop = 'text-ignition-500';

  const renderGroup = (group: NavGroup) => {
    const open = openGroup === group.key;
    return (
      <div
        key={group.key}
        className="relative"
        onMouseEnter={() => hoverOpen(group.key)}
        onMouseLeave={hoverClose}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpenGroup(open ? null : group.key)}
          className={`${topLinkClass} ${open ? activeTop : 'text-chrome-100 hover:text-ignition-500'}`}
        >
          {t(group.key)} <span className="text-[10px]">▾</span>
        </button>
        {open ? (
          <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 border border-white/15 bg-coal-800 shadow-2xl">
            {group.items.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setOpenGroup(null)}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-coal-700"
              >
                <span aria-hidden="true" className="text-lg">
                  {item.icon}
                </span>
                <span className="flex-1">
                  <span className="block font-condensed text-sm font-semibold uppercase tracking-wide text-chalk-50">
                    {t(item.key)}
                  </span>
                  {item.soon ? (
                    <span className="mt-0.5 inline-block bg-ignition-500 px-1.5 py-px font-condensed text-[10px] font-bold uppercase tracking-widest text-black">
                      {t('soon')}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-coal-900/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 md:h-[86px] md:px-10">
        {/* Crest overflows the bar — the Figma Make signature move. */}
        <Link to="/" className="relative z-10 shrink-0 py-1" aria-label={SITE_NAME}>
          <Logo className="h-[64px] md:h-[104px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `${topLinkClass} ${isActive ? activeTop : 'text-chrome-100 hover:text-ignition-500'}`
            }
          >
            {t('nav.events')}
          </NavLink>
          <NavLink
            to="/booking-band"
            className={({ isActive }) =>
              `${topLinkClass} ${isActive ? activeTop : 'text-chrome-100 hover:text-ignition-500'}`
            }
          >
            {t('nav.play')}
          </NavLink>
          {renderGroup(NAV_GROUPS[0]) /* Moto */}
          <NavLink
            to="/store"
            className={({ isActive }) =>
              `${topLinkClass} ${isActive ? activeTop : 'text-chrome-100 hover:text-ignition-500'}`
            }
          >
            {t('nav.store')}
          </NavLink>
          {renderGroup(NAV_GROUPS[1]) /* Servizi */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${topLinkClass} ${isActive ? activeTop : 'text-chrome-100 hover:text-ignition-500'}`
            }
          >
            {t('nav.about')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/rental"
            className="glow-orange slash-both hidden bg-ignition-500 px-5 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500 md:inline-block"
          >
            {t('cta.book')}
          </Link>
          <LanguageSwitcher className="hidden sm:flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid size-10 place-items-center border border-white/15 text-chalk-50 xl:hidden"
          >
            <span className="sr-only">{menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}</span>
            <span aria-hidden="true" className="text-xl leading-none">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/10 bg-coal-900 px-5 py-5 xl:hidden"
        >
          <ul className="flex flex-col">
            <li>
              <NavLink
                to="/events"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block border-b border-white/5 py-3 text-right font-condensed text-base font-semibold uppercase tracking-widest ${
                    isActive ? 'text-ignition-500' : 'text-chalk-50'
                  }`
                }
              >
                {t('nav.events')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/booking-band"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block border-b border-white/5 py-3 text-right font-condensed text-base font-semibold uppercase tracking-widest ${
                    isActive ? 'text-ignition-500' : 'text-chalk-50'
                  }`
                }
              >
                {t('nav.play')}
              </NavLink>
            </li>
            {NAV_GROUPS.map((group) => (
              <li key={group.key} className="border-b border-white/5 py-3">
                <p className="mb-1 text-right font-condensed text-xs font-bold uppercase tracking-[0.3em] text-steel-400">
                  {t(group.key)}
                </p>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.key}>
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-end gap-2 py-1.5 font-condensed text-base font-semibold uppercase tracking-wide text-chalk-50"
                      >
                        {item.soon ? (
                          <span className="bg-ignition-500 px-1.5 py-px text-[10px] font-bold uppercase tracking-widest text-black">
                            {t('soon')}
                          </span>
                        ) : null}
                        {t(item.key)}
                        <span aria-hidden="true">{item.icon}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <NavLink
                to="/store"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block border-b border-white/5 py-3 text-right font-condensed text-base font-semibold uppercase tracking-widest ${
                    isActive ? 'text-ignition-500' : 'text-chalk-50'
                  }`
                }
              >
                {t('nav.store')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-right font-condensed text-base font-semibold uppercase tracking-widest ${
                    isActive ? 'text-ignition-500' : 'text-chalk-50'
                  }`
                }
              >
                {t('nav.about')}
              </NavLink>
            </li>
          </ul>
          <Link
            to="/rental"
            onClick={() => setMenuOpen(false)}
            className="glow-orange slash-both mt-4 block bg-ignition-500 px-5 py-3 text-center font-condensed text-sm font-bold uppercase tracking-widest text-black"
          >
            {t('cta.book')}
          </Link>
          <LanguageSwitcher className="mt-4 flex sm:hidden" />
        </nav>
      ) : null}
    </header>
  );
}
