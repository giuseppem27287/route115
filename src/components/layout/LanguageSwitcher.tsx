import { LOCALE_OPTIONS } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { Locale } from '@/types';

/** IT / EN toggle — writes to `LanguageContext` (persisted + `<html lang>`). */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 rounded-sm border border-steel-700 p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALE_OPTIONS.map((option) => {
        const active = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code as Locale)}
            aria-pressed={active}
            className={`px-2.5 py-1 font-condensed text-xs font-semibold uppercase tracking-widest transition-colors ${
              active
                ? 'bg-rust-500 text-coal-950'
                : 'text-steel-300 hover:text-chrome-100'
            }`}
          >
            {option.code}
          </button>
        );
      })}
    </div>
  );
}
