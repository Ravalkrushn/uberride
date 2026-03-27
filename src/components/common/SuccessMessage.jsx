import React from "react";
import { MdCheckCircle } from "react-icons/md";

export const SuccessMessage = ({
  message,
  dismissible = false,
  onDismiss = null,
}) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <MdCheckCircle
          className="text-green-500 mt-0.5 flex-shrink-0"
          size={20}
        />
        <p className="text-green-800 font-medium">{message}</p>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="text-green-500 hover:text-green-700 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
};
