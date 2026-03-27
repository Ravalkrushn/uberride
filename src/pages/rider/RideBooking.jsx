import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFare } from "../../hooks/useFare";
import { rideService } from "../../services/ride.service";
import toast from "react-hot-toast";
import { VehicleCard } from "../../components/common/VehicleCard";
import { FareBreakdown } from "../../components/common/FareBreakdown";
import { Button } from "../../components/common/Button";

export const RideBooking = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const [vehicleType, setVehicleType] = useState("economy");
  const [loading, setLoading] = useState(false);
  const { fare, estimateFare } = useFare();

  useEffect(() => {
    if (locationState.pickup && locationState.dropoff) {
      estimateFare(
        locationState.pickup.lat,
        locationState.pickup.lng,
        locationState.dropoff.lat,
        locationState.dropoff.lng,
        vehicleType,
      );
    }
  }, [vehicleType, locationState]);

  const handleConfirmRide = async () => {
    setLoading(true);
    try {
      const response = await rideService.requestRide(
        locationState.pickup.lat,
        locationState.pickup.lng,
        locationState.dropoff.lat,
        locationState.dropoff.lng,
        locationState.pickupAddress,
        locationState.dropoffAddress,
        vehicleType,
      );
      navigate("/waiting-for-driver", { state: { rideId: response.data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Choose a ride</h1>

      {/* Vehicle Options */}
      <div className="space-y-3 mb-6">
        {[
          { type: "economy", name: "Uber Go", price: fare?.baseFare || 100 },
          {
            type: "premium",
            name: "Uber Premium",
            price: fare?.baseFare ? fare.baseFare * 1.5 : 150,
          },
          {
            type: "xl",
            name: "Uber XL",
            price: fare?.baseFare ? fare.baseFare * 2 : 200,
          },
        ].map((vehicle) => (
          <VehicleCard
            key={vehicle.type}
            type={vehicle.type}
            name={vehicle.name}
            price={vehicle.price}
            selected={vehicleType === vehicle.type}
            onSelect={() => setVehicleType(vehicle.type)}
          />
        ))}
      </div>

      {/* Fare Breakdown */}
      {fare && (
        <div className="mb-6">
          <FareBreakdown
            baseFare={fare.baseFare || 0}
            distanceFare={fare.distanceFare || 0}
            surgeFare={fare.surgeFare || 0}
            total={fare.totalFare || 0}
          />
        </div>
      )}

      {/* Confirm Button */}
      <Button onClick={handleConfirmRide} loading={loading} className="w-full">
        Confirm Ride
      </Button>
    </div>
  );
};
