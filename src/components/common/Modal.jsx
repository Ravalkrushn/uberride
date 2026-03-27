import React from "react";
import { FaTimes } from "react-icons/fa";

export const Modal = ({
  isOpen,
  onClose,
  title = "",
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={`${sizeClasses[size]} bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-bold">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
};
