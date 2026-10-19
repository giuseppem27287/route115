import { Link } from 'react-router-dom';

import { Stamp } from '@/components/ui/Stamp';
import {
  FALLBACK_CREW,
  FALLBACK_TIMELINE,
  FALLBACK_VALUES,
} from '@/config/fallbacks';
import { SITE_CONTACT } from '@/config/constants';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { pick } from '@/i18n';

const WALL = [
  IMG.crowd1,
  IMG.crew1,
  IMG.crowd2,
  IMG.sicily,
  IMG.crew2,
  IMG.crowd3,
  IMG.bike,
  IMG.garage1,
];

/** About — brand story, values, crew and community wall (design content, i18n-ready). */
export default function AboutPage() {
  const { lang, t } = useLanguage();

  return (
    <div>
      {/* HERO */}
      <section className="relative flex h-[70vh] min-h-[480px] items-center overflow-hidden pt-20">
        <img
          src={IMG.crew1}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/75 to-coal-950/50" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <Stamp className="mb-6">{t('about.kicker')}</Stamp>
          <h1 className="max-w-4xl font-display text-6xl leading-[0.85] tracking-wide sm:text-7xl md:text-8xl lg:text-9xl">
            {t('about.titleA')}
            <br />
            <span className="text-ignition-500">{t('about.titleB')}</span>
          </h1>
        </div>
      </section>

      {/* STORY TIMELINE */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <h2 className="mb-14 font-display text-4xl tracking-wide md:text-5xl">
          {t('about.storyTitle')} <span className="text-ignition-500">{t('about.storyAccent')}</span>
        </h2>
        <div className="relative ml-2 border-l-2 border-white/10 pl-8 md:ml-4 md:pl-12">
          {FALLBACK_TIMELINE.map((entry) => (
            <div key={entry.year} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[41px] top-1 grid size-6 place-items-center rounded-full border-2 border-ignition-500 bg-coal-950 md:-left-[57px]">
                <span
                  className="size-2 rounded-full bg-ignition-500"
                  style={{ boxShadow: '0 0 10px rgba(255,85,0,0.9)' }}
                />
              </span>
              <div className="font-display text-4xl leading-none text-ignition-500 md:text-5xl">
                {entry.year}
              </div>
              <h3 className="mt-2 font-display text-2xl tracking-wide">{entry.title}</h3>
              <p className="mt-2 max-w-xl font-condensed text-lg text-steel-300">
                {pick(lang, entry.text)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-white/10 bg-coal-900">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <h2 className="mb-10 font-display text-4xl tracking-wide md:text-5xl">
            {t('about.standTitle')}{' '}
            <span className="text-ignition-500">{t('about.standAccent')}</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FALLBACK_VALUES.map((value, index) => (
              <div
                key={value.title.en}
                className="group relative overflow-hidden border border-white/10 bg-gradient-to-br from-coal-700 to-coal-800 p-6 transition-colors hover:border-ignition-500/60"
              >
                <div className="mb-6 font-display text-5xl text-white/10 transition-colors group-hover:text-ignition-500/30">
                  0{index + 1}
                </div>
                <h3 className="font-display text-2xl leading-none">{pick(lang, value.title)}</h3>
                <p className="mt-2 font-condensed text-base text-steel-300">
                  {pick(lang, value.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREW */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <h2 className="mb-10 font-display text-4xl tracking-wide md:text-5xl">
          {t('about.crewTitle')} <span className="text-ignition-500">{t('about.crewAccent')}</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FALLBACK_CREW.map((member) => (
            <figure
              key={member.name}
              className="group relative aspect-[3/4] overflow-hidden border border-white/10 bg-coal-700"
            >
              <img
                src={member.img}
                alt={member.name}
                className="size-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-coal-950 via-coal-950/20 to-transparent p-5">
                <h3 className="font-display text-2xl leading-none">{member.name}</h3>
                <div className="mt-2 max-h-24 opacity-100 transition-all duration-300 group-hover:opacity-100">
                  <span className="inline-block bg-ignition-500 px-2 py-1 font-condensed text-xs font-bold uppercase tracking-widest text-black">
                    {pick(lang, member.role)}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* COMMUNITY WALL */}
      <section className="border-t border-white/10 bg-coal-900">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <h2 className="mb-10 font-display text-4xl tracking-wide md:text-5xl">
            {t('about.wallTitle')}{' '}
            <span className="text-ignition-500">{t('about.wallAccent')}</span>
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WALL.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden border border-white/10 bg-coal-700 ${
                  index % 5 === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
                }`}
              >
                <img
                  src={image}
                  alt="Route 115 community moment"
                  className="size-full object-cover opacity-80 transition-all duration-500 hover:scale-105 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden border-t border-white/10">
        <img
          src={IMG.bike}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-coal-950/80" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10">
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[0.9] tracking-wide md:text-6xl">
            {t('about.ctaA')}
            <br />
            <span className="text-ignition-500">{t('about.ctaB')}</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="glow-orange slash-r bg-rust-500 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-ignition-500"
            >
              {t('hero.explore')}
            </Link>
            <a
              href={SITE_CONTACT.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="slash-l border-2 border-ignition-500 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
            >
              {t('about.findLocation')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
