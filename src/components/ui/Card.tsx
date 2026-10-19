import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds a hover lift + rust border glow (use for interactive cards). */
  interactive?: boolean;
}

/** Generic surface card: coal panel, steel border, optional hover state. */
export function Card({ children, interactive = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`grain relative overflow-hidden rounded-sm border border-steel-700 bg-coal-900 p-6 ${
        interactive
          ? 'transition-colors duration-150 hover:border-rust-500/60 hover:bg-coal-800'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

/** Section title used inside cards (condensed uppercase style). */
export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3
      className={`font-condensed text-xl font-bold uppercase tracking-wide text-chrome-100 ${className}`}
    >
      {children}
    </h3>
  );
}
