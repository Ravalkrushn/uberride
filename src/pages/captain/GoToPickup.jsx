import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { MapContainer } from "../../components/common/MapContainer";
import { Button } from "../../components/common/Button";

export const GoToPickup = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { emit } = useSocket();
  const [eta, setEta] = useState(5);

  const ride = locationState.ride;

  useEffect(() => {
    const interval = setInterval(() => {
      setEta((t) => {
        if (t <= 0) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 6000); // Simulate arrival every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const handleArrived = () => {
    emit("captain_arrived_at_pickup", { rideId: ride._id });
    navigate("/trip-in-progress-captain", { state: { ride } });
  };

  if (!ride) {
    return <div className="p-4">No ride information</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 relative">
        <MapContainer
          center={{
            lat: ride.pickupLocation.latitude,
            lng: ride.pickupLocation.longitude,
          }}
          zoom={15}
        />
      </div>

      <div className="bg-white border-t p-4">
        <p className="text-2xl font-bold mb-4">ETA: {eta} mins</p>
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Going to pickup</p>
            <p className="font-bold">{ride.pickupAddress}</p>
          </div>
          <Button onClick={handleArrived} className="w-full">
            I've Arrived
          </Button>
        </div>
      </div>
    </div>
  );
};
