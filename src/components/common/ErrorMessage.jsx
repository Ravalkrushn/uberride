import React from "react";
import { MdError } from "react-icons/md";

export const ErrorMessage = ({
  message,
  onRetry = null,
  dismissible = false,
  onDismiss = null,
}) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <MdError className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <p className="text-red-800 font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-600 hover:text-red-800 text-sm mt-2 font-semibold"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
};
