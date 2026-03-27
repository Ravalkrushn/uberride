import React from "react";

export const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  disabled = false,
  icon: Icon = null,
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
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full py-2 px-3 border-2 rounded-lg 
            focus:outline-none transition-all
            ${Icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
