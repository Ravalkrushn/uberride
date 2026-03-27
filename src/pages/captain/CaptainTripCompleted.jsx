import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentService } from "../../services/payment.service";
import { FareBreakdown } from "../../components/common/FareBreakdown";
import { Button } from "../../components/common/Button";
import toast from "react-hot-toast";

export const CaptainTripCompleted = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const [loading, setLoading] = useState(false);

  const ride = locationState.ride;

  const handleEndShift = () => {
    navigate("/captain-home");
  };

  if (!ride) {
    return <div className="p-4">No ride information</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Trip Completed</h1>

      <div className="flex-1">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-3">Pickup</p>
          <p className="font-bold mb-4">{ride.pickupAddress}</p>
          <p className="text-sm text-gray-600 mb-3">Dropoff</p>
          <p className="font-bold">{ride.dropoffAddress}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">Fare Details</h3>
          <FareBreakdown
            baseFare={ride.fare?.baseFare || 0}
            distanceFare={ride.fare?.distanceFare || 0}
            surgeFare={ride.fare?.surgeFare || 0}
            total={ride.fare?.totalFare || 0}
          />
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Your Earnings</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{Math.round(ride.fare?.totalFare * 0.8)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={handleEndShift} className="w-full">
          Back to Home
        </Button>
      </div>
    </div>
  );
};
