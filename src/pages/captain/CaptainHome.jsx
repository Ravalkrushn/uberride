import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useLocation } from "../../hooks/useLocation";
import { captainService } from "../../services/captain.service";
import { locationService } from "../../services/location.service";
import { MapContainer } from "../../components/common/MapContainer";
import { Toggle } from "../../components/common/Toggle";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";

export const CaptainHome = () => {
  const navigate = useNavigate();
  const { emit, on } = useSocket();
  const { latitude, longitude, startWatching, getLocation } = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [rideRequest, setRideRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 });

  useEffect(() => {
    getLocation().then(() => {
      startWatching();
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter({ lat: latitude, lng: longitude });
      if (isOnline) {
        updateLocation();
      }
    }
  }, [latitude, longitude, isOnline]);

  useEffect(() => {
    on("new_ride_request", (data) => {
      setRideRequest(data);
      toast.success("New ride request!");
    });
  }, []);

  const updateLocation = async () => {
    try {
      emit("captain_location_update", {
        latitude,
        longitude,
        timestamp: new Date(),
      });
      await locationService.updateLocation(latitude, longitude);
    } catch (err) {
      console.error("Failed to update location:", err);
    }
  };

  const handleToggleOnline = async (status) => {
    try {
      await captainService.toggleOnlineStatus(status);
      setIsOnline(status);
      if (status) {
        updateLocation();
      }
      toast.success(status ? "You are online" : "You are offline");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAcceptRide = async () => {
    if (rideRequest) {
      navigate("/incoming-ride", { state: { rideRequest } });
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Uber Driver</h1>
        <button
          onClick={() => navigate("/captain-profile")}
          className="text-sm hover:underline"
        >
          Profile
        </button>
      </div>

      {/* Online Toggle */}
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <div>
          <p className="font-bold">Status: {isOnline ? "Online" : "Offline"}</p>
          <p className="text-sm text-gray-600">Today: ₹{earnings}</p>
        </div>
        <Toggle checked={isOnline} onChange={handleToggleOnline} />
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={15}
          markers={[{ lat: latitude, lng: longitude, title: "Your Location" }]}
        />
      </div>

      {/* Ride Request Popup */}
      {rideRequest && (
        <div className="bg-white border-t-2 border-green-500 p-4 space-y-4">
          <div>
            <p className="font-bold">Pickup: {rideRequest.pickupAddress}</p>
            <p className="text-sm text-gray-600">
              Drop: {rideRequest.dropoffAddress}
            </p>
            <p className="text-lg font-bold text-green-600 mt-2">
              ₹{rideRequest.fare?.totalFare}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => setRideRequest(null)}
              className="flex-1"
            >
              Reject
            </Button>
            <Button onClick={handleAcceptRide} className="flex-1">
              Accept
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
