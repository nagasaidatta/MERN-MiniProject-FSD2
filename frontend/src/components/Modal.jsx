import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">{title}</h3>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {(onConfirm || onClose) && (
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                type="button"
                className={`btn btn-${confirmVariant} btn-sm`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
