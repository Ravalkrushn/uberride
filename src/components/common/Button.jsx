import React from "react";
import { Loader } from "./Loader";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border-2 border-black hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg font-semibold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading && <Loader size="sm" />}
      {children}
    </button>
  );
};
