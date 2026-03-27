import React from "react";

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  required = false,
  error = "",
  disabled = false,
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full py-2 px-3 border-2 rounded-lg
          focus:outline-none transition-all
          ${error ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"}
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
