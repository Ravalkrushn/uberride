import React from "react";

export const Card = ({ children, className = "", hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 p-4 
        ${hover ? "cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
