export interface PageHeaderProps {
  title: string;
  subtitle?: string | null;
}

/** Standard page hero: display title + condensed uppercase subtitle. */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="border-b border-steel-700 bg-coal-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="font-display text-4xl tracking-tight text-chrome-100 md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl font-condensed text-lg uppercase tracking-wide text-steel-300">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
