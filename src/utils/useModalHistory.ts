import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle Android / iOS physical/system back button for modals,
 * drawers, lightboxes, and dropdowns.
 *
 * - When opened, pushes a state to history.
 * - When mobile back button is tapped, `popstate` fires and calls `onClose()`.
 * - When closed by UI click ('X' or backdrop), automatically rewinds the history entry.
 */
export function useModalHistory(isOpen: boolean, onClose: () => void, modalId: string = 'modal') {
  const isPoppedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    isPoppedRef.current = false;
    const stateObj = { isModalOpen: true, modalId };

    try {
      window.history.pushState(stateObj, '');
    } catch (e) {
      console.warn('Could not push modal history state:', e);
    }

    const handlePopState = () => {
      isPoppedRef.current = true;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If closed programmatically without browser back button, pop the modal history state
      if (!isPoppedRef.current) {
        try {
          if (window.history.state?.isModalOpen && window.history.state?.modalId === modalId) {
            window.history.back();
          }
        } catch (e) {
          console.warn('Could not rewind modal history state:', e);
        }
      }
    };
  }, [isOpen, onClose, modalId]);
}
