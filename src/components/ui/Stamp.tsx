import type { ReactNode } from 'react';

export interface StampProps {
  children: ReactNode;
  className?: string;
}

/** Small bordered "stamp" badge used as eyebrow/label across the design. */
export function Stamp({ children, className = '' }: StampProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 border border-ignition-500/70 px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-[0.25em] text-ignition-500 ${className}`}
    >
      {children}
    </span>
  );
}
