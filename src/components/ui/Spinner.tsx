export interface SpinnerProps {
  /** Diameter in pixels (default: 32). */
  size?: number;
  className?: string;
}

/** Indeterminate loader used by pages while Strapi data is in flight. */
export function Spinner({ size = 32, className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-steel-600 border-t-rust-500 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
