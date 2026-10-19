import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useModal } from '@/hooks/useModal';

export interface ModalProps {
  /**
   * When provided, the modal is driven by the global `ModalContext`:
   * it renders while `openModal(id)` has been called.
   */
  id?: string;
  /** Controlled visibility — use when no `id` is given. */
  isOpen?: boolean;
  title?: ReactNode;
  children: ReactNode;
  /** Called on close request (backdrop click, Escape, close button). */
  onClose?: () => void;
  className?: string;
}

/**
 * Accessible overlay modal (portal to `document.body`).
 * Esc closes, backdrop click closes, background scroll is locked while open.
 */
export function Modal({ id, isOpen, title, children, onClose, className = '' }: ModalProps) {
  const modal = useModal();
  const open = isOpen ?? (id ? modal.isModalOpen(id) : false);

  const requestClose = () => {
    if (onClose) {
      onClose();
    } else {
      modal.closeModal();
    }
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-coal-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className={`grain relative w-full max-w-lg rounded-sm border border-steel-700 bg-coal-900 shadow-2xl ${className}`}
      >
        <header className="flex items-center justify-between border-b border-steel-700 px-6 py-4">
          {title ? (
            <h2 className="font-condensed text-lg font-bold uppercase tracking-wide text-chrome-100">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-sm text-steel-300 transition-colors hover:bg-coal-700 hover:text-rust-400"
          >
            ✕
          </button>
        </header>
        <div className="px-6 py-5 text-sm leading-relaxed text-chrome-200">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
