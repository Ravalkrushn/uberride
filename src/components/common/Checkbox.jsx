import React from "react";
import { FaCheck } from "react-icons/fa";

export const Checkbox = ({
  checked = false,
  onChange,
  label = "",
  disabled = false,
  error = "",
  name,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          disabled={disabled}
          name={name}
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-all
            ${checked ? "bg-black border-black" : "border-gray-300 hover:border-gray-400"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          {...props}
        >
          {checked && <FaCheck size={12} className="text-white" />}
        </button>
        {label && <label className="text-sm cursor-pointer">{label}</label>}
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
