import { SITE_NAME } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';

import logoUrl from '@/assets/logo.svg';

/** Full-screen boot screen shown while the app hydrates its initial state. */
export function Preloader() {
  const { t } = useLanguage();

  return (
    <div
      className="grain fixed inset-0 z-[100] grid place-items-center bg-coal-950"
      role="status"
      aria-live="polite"
    >
      <div className="flex w-64 flex-col items-center gap-4">
        <img src={logoUrl} alt="" className="size-16 opacity-90" />
        <p className="font-display text-2xl tracking-tight text-chrome-100">{SITE_NAME}</p>
        <div className="h-0.5 w-full overflow-hidden bg-steel-700">
          <div className="h-full w-full animate-preloader bg-rust-500" />
        </div>
        <p className="font-condensed text-xs uppercase tracking-widest text-steel-400">
          {t('preloader.label')}
        </p>
      </div>
    </div>
  );
}
