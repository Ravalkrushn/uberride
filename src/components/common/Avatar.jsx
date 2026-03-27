import React from "react";
import { FaUser } from "react-icons/fa";

export const Avatar = ({
  src = null,
  name = "User",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
  };

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-black text-white flex items-center justify-center font-bold ${className}`}
    >
      {name ? getInitials(name) : <FaUser className="w-1/2 h-1/2" />}
    </div>
  );
};
