import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export const FareBreakdown = ({
  baseFare = 0,
  distanceFare = 0,
  surgeFare = 0,
  taxes = 0,
  discount = 0,
  total = 0,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Base Fare</span>
        <span className="font-semibold">{formatCurrency(baseFare)}</span>
      </div>

      {distanceFare > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Distance</span>
          <span className="font-semibold">{formatCurrency(distanceFare)}</span>
        </div>
      )}

      {surgeFare > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Surge Pricing</span>
          <span className="font-semibold text-red-600">
            {formatCurrency(surgeFare)}
          </span>
        </div>
      )}

      {taxes > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & Fees</span>
          <span className="font-semibold">{formatCurrency(taxes)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-gray-600">Discount</span>
          <span className="font-semibold text-green-600">
            -{formatCurrency(discount)}
          </span>
        </div>
      )}

      <div className="border-t pt-2 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};
