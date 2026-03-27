import React from "react";

export const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  error = "",
  disabled = false,
  maxLength = null,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full py-2 px-3 border-2 rounded-lg resize-none
          focus:outline-none transition-all
          ${error ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"}
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      />
      <div className="flex justify-between items-center">
        {error && <span className="text-sm text-red-600">{error}</span>}
        {maxLength && (
          <span className="text-xs text-gray-500 ml-auto">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
