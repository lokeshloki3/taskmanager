import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>{message}</p>
          <div className="mt-4 flex justify-between gap-4">
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              Yes, Delete
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 text-black p-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };  

export default ConfirmationModal;
