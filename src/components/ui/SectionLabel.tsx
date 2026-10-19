export interface SectionLabelProps {
  /** Decorative index, e.g. "// 01". */
  index: string;
  title: string;
}

/** Numbered section heading used by the long-form pages. */
export function SectionLabel({ index, title }: SectionLabelProps) {
  return (
    <div className="mb-10 flex items-end gap-4 border-b border-steel-700 pb-4">
      <span className="font-condensed text-sm font-semibold tracking-[0.3em] text-ignition-500">
        {index}
      </span>
      <h2 className="font-display text-4xl leading-[0.9] tracking-wide text-chalk-50 sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
