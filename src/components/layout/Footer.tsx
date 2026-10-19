import { Link } from 'react-router-dom';

import { NAV_ITEMS, SITE_NAME } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';

/** Site footer: brand line, quick links, rights notice. */
export function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-steel-700 bg-coal-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg text-chrome-100">{SITE_NAME}</p>
          <p className="mt-1 font-condensed text-sm uppercase tracking-widest text-steel-300">
            {t('footer.tagline')}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className="font-condensed text-sm uppercase tracking-widest text-steel-300 transition-colors hover:text-rust-400"
                >
                  {t(`nav.${item.key}` as 'nav.home')}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-steel-700/60 py-4 text-center">
        <p className="font-condensed text-xs uppercase tracking-widest text-steel-400">
          © {year} {SITE_NAME} — {t('footer.rights')} ({lang.toUpperCase()})
        </p>
      </div>
    </footer>
  );
}
