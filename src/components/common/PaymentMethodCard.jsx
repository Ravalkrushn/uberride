import React from "react";
import { FaWallet, FaPhone } from "react-icons/fa";
import { AiOutlineCreditCard } from "react-icons/ai";

export const PaymentMethodCard = ({
  method = "cash",
  label = "Cash",
  selected = false,
  onSelect,
}) => {
  const icons = {
    cash: FaWallet,
    upi: FaPhone,
    card: AiOutlineCreditCard,
  };

  const Icon = icons[method] || FaWallet;

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
        selected
          ? "border-black bg-black text-white"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <Icon size={24} />
      <span className="font-semibold flex-1 text-left">{label}</span>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-white" : "border-gray-300"
        }`}
      >
        {selected && <div className="w-3 h-3 rounded-full bg-white" />}
      </div>
    </button>
  );
};
