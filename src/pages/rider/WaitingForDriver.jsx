import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useRide } from "../../hooks/useRide";
import { rideService } from "../../services/ride.service";
import { FaCar, FaPhone, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

export const WaitingForDriver = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { on, emit } = useSocket();
  const { initializeRide, updateRideStatus, setRideDriver } = useRide();
  const [ride, setRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationState.rideId) {
      navigate("/rider-home");
      return;
    }

    fetchRideDetails();

    // Listen for driver acceptance
    on("ride_accepted", (data) => {
      setDriver(data.captain);
      setRideDriver(data.captain);
      updateRideStatus("ACCEPTED");
      setRide((prev) => ({
        ...prev,
        status: "ACCEPTED",
        captain: data.captain,
      }));
      toast.success("Driver accepted your ride!");

      // Auto-navigate to driver on the way
      setTimeout(() => navigate("/driver-otw"), 2000);
    });

    // Listen for ride cancellation
    on("ride_cancelled", (data) => {
      toast.error("Driver cancelled the ride");
      setTimeout(() => navigate("/rider-home"), 2000);
    });
  }, [locationState.rideId]);

  const fetchRideDetails = async () => {
    try {
      const response = await rideService.getRideDetails(locationState.rideId);
      setRide(response.data);
      if (response.data.captain) {
        setDriver(response.data.captain);
      }
      initializeRide(response.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load ride details");
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    try {
      await rideService.cancelRide(locationState.rideId);
      navigate("/rider-home");
      toast.success("Ride cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel ride");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4">
        <h1 className="text-xl font-bold">Finding a driver...</h1>
      </div>

      {/* Driver Info (if accepted) */}
      {driver && (
        <div className="bg-green-50 border-b-2 border-green-200 p-4">
          <p className="text-sm text-gray-600 mb-3">Driver on the way</p>
          <div className="flex items-center gap-3">
            <Avatar
              src={driver.profilePhoto}
              name={driver.fullname}
              size="lg"
            />
            <div className="flex-1">
              <h3 className="font-bold">{driver.fullname}</h3>
              <div className="flex items-center gap-2">
                <FaStar size={14} className="text-yellow-400" />
                <span className="text-sm">{driver.rating || 4.8}</span>
              </div>
            </div>
            <button className="bg-green-500 text-white p-3 rounded-full">
              <FaPhone size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Ride Details */}
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">From</p>
          <p className="font-semibold">
            {ride?.pickupAddress || "Your location"}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">To</p>
          <p className="font-semibold">
            {ride?.dropoffAddress || "Destination"}
          </p>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="p-4 border-t">
        <Button variant="danger" onClick={handleCancelRide} className="w-full">
          Cancel Ride
        </Button>
      </div>
    </div>
  );
};
