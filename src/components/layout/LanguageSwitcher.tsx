import { LOCALE_OPTIONS } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { Locale } from '@/types';

/** ITA / ENG toggle — writes to `LanguageContext` (persisted + `<html lang>`). */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`flex items-center border border-white/15 bg-coal-700 ${className}`}
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
            className={`px-3 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest transition-colors ${
              active
                ? 'bg-ignition-500 text-black'
                : 'text-steel-300 hover:text-chalk-50'
            }`}
          >
            {option.flag}
          </button>
        );
      })}
    </div>
  );
}
