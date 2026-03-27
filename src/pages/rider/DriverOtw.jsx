import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useRide } from "../../hooks/useRide";
import { formatTime } from "../../utils/formatTime";
import { MapContainer } from "../../components/common/MapContainer";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";

export const DriverOtw = () => {
  const navigate = useNavigate();
  const { on } = useSocket();
  const { driverLocation, driver } = useRide();
  const [eta, setEta] = useState(0);

  useEffect(() => {
    // Listen for driver location updates
    on("driver_location_update", (data) => {
      setEta(data.eta);
    });

    // Listen for ride start (driver arrived)
    on("ride_started", () => {
      navigate("/trip-in-progress");
    });
  }, []);

  if (!driver) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Map */}
      <div className="flex-1 relative min-h-[60vh]">
        <MapContainer
          center={driverLocation || { lat: 28.7041, lng: 77.1025 }}
          zoom={15}
          markers={[
            driverLocation && {
              lat: driverLocation.lat,
              lng: driverLocation.lng,
              title: "Driver",
            },
          ].filter(Boolean)}
        />
      </div>

      {/* Driver Info */}
      <div className="bg-white border-t p-4">
        <div className="text-center mb-4">
          <p className="text-2xl font-bold">{formatTime(eta)}</p>
          <p className="text-gray-600">Driver arriving</p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg mb-4">
          <img
            src={driver.profilePhoto || "/default-avatar.png"}
            alt={driver.fullname}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold">{driver.fullname}</p>
            <p className="text-sm text-gray-600">
              {driver.vehicle?.licensePlate}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate("/rider-home")}
          className="w-full"
        >
          Cancel Ride
        </Button>
      </div>
    </div>
  );
};
