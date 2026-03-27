import React from "react";

export const Divider = ({
  text = null,
  orientation = "horizontal",
  className = "",
}) => {
  if (orientation === "vertical") {
    return <div className={`h-full w-px bg-gray-200 ${className}`} />;
  }

  if (text) {
    return (
      <div className={`flex items-center gap-3 my-4 ${className}`}>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-500 px-2">{text}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    );
  }

  return <div className={`h-px bg-gray-200 my-4 ${className}`} />;
};
