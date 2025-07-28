import React from 'react';

const CustomModal = ({ show, type, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 max-w-sm w-full text-center">
        <p className="text-white text-lg mb-6 font-inter">{message}</p>
        <div className="flex justify-center space-x-4">
          {type === 'confirm' && (
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 font-inter text-lg font-semibold"
            >
              Confirm
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 font-inter text-lg font-semibold"
          >
            {type === 'confirm' ? 'Cancel' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
