import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Modal component for displaying content with overlay
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key press to close modal
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

  // Handle initial focus when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal element itself
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Prevent rendering if modal is not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal panel */}
      <div className="flex min-h-screen items-start justify-center p-4 text-center sm:p-0">
        <div
          ref={modalRef}
          className="relative mt-12 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-lg font-medium leading-6 text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
