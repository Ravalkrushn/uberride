import React from "react";
import { FaCar } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";

export const VehicleCard = ({
  type = "economy",
  name = "Uber Go",
  price,
  eta = "5 mins",
  selected = false,
  onSelect,
  icon: Icon = FaCar,
}) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Icon size={24} />
          <div>
            <h3 className="font-bold">{name}</h3>
            <p
              className={`text-sm ${selected ? "text-gray-200" : "text-gray-500"}`}
            >
              {eta}
            </p>
          </div>
        </div>
        <span className="font-bold text-lg">{formatCurrency(price)}</span>
      </div>
    </button>
  );
};
