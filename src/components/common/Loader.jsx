import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Loader = ({ fullScreen = false, size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <AiOutlineLoading3Quarters
          className={`${sizeClasses[size]} text-black animate-spin`}
        />
      </div>
    );
  }

  return (
    <AiOutlineLoading3Quarters
      className={`${sizeClasses[size]} text-black animate-spin`}
    />
  );
};
