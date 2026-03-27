import React, { useState } from "react";

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title = "",
  height = "h-1/2",
}) => {
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    if (endY - startY > 100) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 ${height} bg-white rounded-t-3xl shadow-2xl z-50 animate-slide-up`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col h-full">
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Title */}
          {title && (
            <h2 className="text-xl font-bold px-6 pb-4 border-b">{title}</h2>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      </div>
    </>
  );
};
