import React, { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { useRide } from "../../hooks/useRide";
import { rideService } from "../../services/ride.service";
import { useNavigate } from "react-router-dom";
import { MapContainer } from "../../components/common/MapContainer";
import { Button } from "../../components/common/Button";
import toast from "react-hot-toast";

export const TripInProgress = () => {
  const navigate = useNavigate();
  const { on } = useSocket();
  const { activeRide, driverLocation, updateRideStatus } = useRide();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    on("trip_completed", () => {
      updateRideStatus("COMPLETED");
      setTimeout(() => navigate("/trip-completed"), 1000);
    });

    // For OTP verification (if needed)
    if (!activeRide?.otpVerified) {
      setShowOtpInput(true);
    }
  }, []);

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await rideService.startRide(activeRide._id, otp);
      setShowOtpInput(false);
      toast.success("Trip started");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 relative">
        <MapContainer
          center={driverLocation || { lat: 28.7041, lng: 77.1025 }}
          zoom={15}
        />
      </div>

      <div className="bg-white border-t p-4">
        <h2 className="text-xl font-bold mb-4">Trip in Progress</h2>

        {showOtpInput ? (
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <Button
              onClick={handleVerifyOtp}
              loading={loading}
              className="w-full"
            >
              Start Trip
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                From: {activeRide?.pickupAddress}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                To: {activeRide?.dropoffAddress}
              </p>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Driver is taking you to your destination
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
