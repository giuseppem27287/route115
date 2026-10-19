import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import logoUrl from '@/assets/logo.svg';
import { NAV_ITEMS, SITE_NAME } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';

const baseLinkClass =
  'font-condensed text-sm font-semibold uppercase tracking-widest text-steel-300 transition-colors hover:text-chrome-100';
const activeLinkClass = 'text-rust-500';

/** Sticky top bar: brand, main navigation, language switcher, mobile menu. */
export function Header() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-700 bg-coal-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <img src={logoUrl} alt="" aria-hidden="true" className="size-8" />
          <span className="font-display text-lg tracking-tight text-chrome-100">{SITE_NAME}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
              }
            >
              {t(`nav.${item.key}` as 'nav.home')}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid size-9 place-items-center rounded-sm border border-steel-700 text-chrome-100 md:hidden"
          >
            <span className="sr-only">{menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}</span>
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-steel-700 bg-coal-900 px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
                  }
                >
                  {t(`nav.${item.key}` as 'nav.home')}
                </NavLink>
              </li>
            ))}
          </ul>
          <LanguageSwitcher className="mt-4 sm:hidden" />
        </nav>
      ) : null}
    </header>
  );
}
