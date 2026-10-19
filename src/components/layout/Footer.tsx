import { Link } from 'react-router-dom';

import { Logo } from '@/components/ui/Logo';
import { NAV_GROUPS, NAV_LINKS, SITE_CONTACT, SITE_NAME } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import type { Global, StrapiDocument } from '@/types';

/**
 * Site footer — Figma Make 4-column design.
 * Contact details / social links come from the `global` Strapi single type
 * and fall back to the site constants while the CMS is unavailable.
 */
export function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  const { data: global } = useStrapi<StrapiDocument<Global>>('/global', {
    locale: lang,
    populate: '*',
  });

  const addressLine = global?.address || SITE_CONTACT.addressLine;
  const cityLine = SITE_CONTACT.cityLine;
  const phone = global?.contactPhone || SITE_CONTACT.phone;
  const email = global?.contactEmail || SITE_CONTACT.email;
  const socials = global?.socialLinks?.length
    ? global.socialLinks
    : [
        { platform: 'Instagram', url: '#' },
        { platform: 'Facebook', url: '#' },
        { platform: 'YouTube', url: '#' },
      ];

  const hours: Array<[string, string, boolean]> = [
    [t('footer.h1'), t('footer.t1'), false],
    [t('footer.h2'), t('footer.t2'), false],
    [t('footer.h3'), t('footer.t3'), false],
    [t('footer.h4'), t('footer.t4'), true],
  ];

  return (
    <footer className="relative border-t border-white/10 bg-coal-950">
      <div className="grain absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-4 md:px-10">
        <div>
          <Logo className="h-16" />
          <p className="mt-4 max-w-xs font-condensed text-base text-steel-300">
            {t('footer.tagline')}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 border border-ignition-500/60 bg-ignition-500/10 px-3 py-1.5">
            <span className="size-2 animate-pulse rounded-full bg-rust-500" />
            <span className="font-condensed text-xs font-semibold uppercase tracking-widest text-ignition-500">
              {t('footer.openNow')}
            </span>
          </div>

          <nav aria-label="Footer" className="mt-6">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className="font-condensed text-sm uppercase tracking-widest text-steel-400 transition-colors hover:text-ignition-500"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              {NAV_GROUPS.flatMap((group) => group.items).map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className="font-condensed text-sm uppercase tracking-widest text-steel-400 transition-colors hover:text-ignition-500"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h4 className="font-condensed text-sm font-bold uppercase tracking-[0.25em] text-chalk-50">
            {t('footer.findUs')}
          </h4>
          <ul className="mt-4 space-y-2 font-condensed text-base text-steel-300">
            <li>{addressLine}</li>
            <li>{cityLine}</li>
            <li className="pt-2">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-ignition-500">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-ignition-500">
                {email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-condensed text-sm font-bold uppercase tracking-[0.25em] text-chalk-50">
            {t('footer.hours')}
          </h4>
          <ul className="mt-4 space-y-2 font-condensed text-base text-steel-300">
            {hours.map(([label, time, closed]) => (
              <li
                key={label}
                className={`flex justify-between gap-6 ${closed ? 'text-steel-400/60' : ''}`}
              >
                <span>{label}</span>
                <span>{time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-condensed text-sm font-bold uppercase tracking-[0.25em] text-chalk-50">
            {t('footer.follow')}
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="border border-white/15 px-4 py-2 font-condensed text-sm font-semibold uppercase tracking-widest text-steel-300 transition-colors hover:border-ignition-500 hover:text-ignition-500"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 font-condensed text-xs uppercase tracking-widest text-steel-400 md:flex-row md:items-center md:justify-between md:px-10">
          <span>
            © {year} {SITE_NAME} — {t('footer.rights')} ({lang.toUpperCase()})
          </span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-ignition-500">
              {t('footer.privacy')}
            </a>
            <a href="#" className="hover:text-ignition-500">
              {t('footer.terms')}
            </a>
            <a href="#" className="hover:text-ignition-500">
              {t('footer.cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
