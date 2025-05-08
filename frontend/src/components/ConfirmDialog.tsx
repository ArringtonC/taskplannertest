import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

/**
 * Confirmation dialog component for actions that need user confirmation
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle Escape key press to close dialog
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle initial focus when dialog opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  // Prevent rendering if dialog is not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60"
      aria-labelledby="confirm-dialog-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="bg-[#181c27] rounded-lg shadow-xl p-6 w-full max-w-sm text-center"
        tabIndex={-1}
      >
        <h3 className="text-lg font-semibold text-white mb-2" id="confirm-dialog-title">
          {title}
        </h3>
        <p className="text-base text-gray-300 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className={confirmButtonClass}
            onClick={onConfirm}
          >
            {confirmText || 'Confirm'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            {cancelText || 'Cancel'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
