import React from "react";

export const Toggle = ({
  checked = false,
  onChange,
  label = "",
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-all
          ${checked ? "bg-black" : "bg-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-all
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
};
