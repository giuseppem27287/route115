import { useContext } from 'react';

import { ModalContext, type ModalContextValue } from '@/context/ModalContext';

/** Open/close the global modal(s): `const { openModal, closeModal } = useModal()`. */
export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal() must be used inside <ModalProvider>');
  }
  return ctx;
}
