export interface PageHeroProps {
  /** Background image (Strapi media or design placeholder). */
  img: string;
  /** Small uppercase kicker above the title. */
  kicker: string;
  title: string;
}

/** Full-bleed page hero: image, dark gradient, grain overlay, display title. */
export function PageHero({ img, kicker, title }: PageHeroProps) {
  return (
    <section className="relative flex h-[42vh] min-h-[340px] items-end overflow-hidden pt-20">
      <img
        src={img}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/70 to-coal-950/40" />
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-10 md:px-10">
        <span className="font-condensed text-sm uppercase tracking-[0.3em] text-ignition-500">
          {kicker}
        </span>
        <h1 className="mt-2 font-display text-6xl leading-[0.85] tracking-wide sm:text-7xl md:text-8xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
