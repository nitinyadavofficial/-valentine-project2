import { Fragment, ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useOnClickOutside } from '@/hooks/useUtils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(contentRef, () => closeOnOverlayClick && onClose);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Fragment>
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOnOverlayClick ? onClose : undefined}
          role="presentation"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined} aria-describedby={description ? 'modal-description' : undefined}>
          <motion.div
            ref={modalRef}
            className={cn('w-full bg-white dark:bg-navy-900 rounded-2xl shadow-2xl overflow-hidden', sizes[size])}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-navy-200 dark:border-navy-800">
                <div>
                  {title && <h2 id="modal-title" className="text-xl font-semibold text-navy-900 dark:text-white">{title}</h2>}
                  {description && <p id="modal-description" className="mt-1 text-sm text-navy-600 dark:text-navy-400">{description}</p>}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-navy-400 hover:text-navy-600 dark:hover:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div ref={contentRef} className="p-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      </Fragment>
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-navy-600 dark:text-navy-400 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} disabled={isLoading} className="btn-secondary"> {cancelText}</button>
        <button onClick={onConfirm} disabled={isLoading} className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}> {isLoading ? 'Processing...' : confirmText}</button>
      </div>
    </Modal>
  );
}