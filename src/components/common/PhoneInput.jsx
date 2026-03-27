import React, { useState } from "react";
import { FaPhone } from "react-icons/fa";

export const PhoneInput = ({
  label,
  value,
  onChange,
  placeholder = "+91 XXXXX XXXXX",
  required = false,
  error = "",
  disabled = false,
  countryCode = "+91",
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");

    // Limit to 10 digits for Indian phone numbers
    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    // Format: XXXXX XXXXX
    let formatted = "";
    if (input.length > 0) {
      formatted = input.slice(0, 5);
      if (input.length > 5) {
        formatted += " " + input.slice(5);
      }
    }

    onChange(formatted);
  };

  const phoneNumber = `${countryCode}${value.replace(/\s/g, "")}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaPhone size={16} />
        </div>
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
          {countryCode}
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full py-2 px-3 pl-20 border-2 rounded-lg
            focus:outline-none transition-all
            ${error ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
      {focused && value && (
        <span className="text-xs text-gray-500">{phoneNumber}</span>
      )}
    </div>
  );
};
