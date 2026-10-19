import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

/**
 * Global modal state: only one modal can be open at a time.
 * `<Modal id="rental-info">` renders its children when `openModal('rental-info')`
 * has been called; `close()` / `closeModal(id)` dismiss it.
 */
export interface ModalContextValue {
  /** `documentId`-style id of the currently open modal, if any. */
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
  /** Convenience predicate usable inside render. */
  isModalOpen: (id: string) => boolean;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = useCallback((id: string) => setActiveModal(id), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const isModalOpen = useCallback((id: string) => activeModal === id, [activeModal]);

  const value = useMemo<ModalContextValue>(
    () => ({ activeModal, openModal, closeModal, isModalOpen }),
    [activeModal, openModal, closeModal, isModalOpen],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
