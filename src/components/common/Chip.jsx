import React from "react";
import { FaTimes } from "react-icons/fa";

export const Chip = ({
  label,
  onRemove = null,
  variant = "default",
  size = "md",
  icon: Icon = null,
}) => {
  const variantClasses = {
    default: "bg-gray-200 text-gray-800",
    primary: "bg-black text-white",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full inline-flex items-center gap-2 whitespace-nowrap`}
    >
      {Icon && <Icon size={14} />}
      <span>{label}</span>
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-70">
          <FaTimes size={12} />
        </button>
      )}
    </div>
  );
};
