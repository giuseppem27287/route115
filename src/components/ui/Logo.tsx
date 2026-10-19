import logoUrl from '@/assets/logo.png';

/** Route 115 crest — transparent PNG from the Figma Make design. */
export function Logo({ className = 'h-11', flicker = false }: { className?: string; flicker?: boolean }) {
  return (
    <img
      src={logoUrl}
      alt="Route 115 Siracusa"
      className={`${flicker ? 'animate-logo-flicker' : ''} w-auto object-contain ${className}`}
    />
  );
}
