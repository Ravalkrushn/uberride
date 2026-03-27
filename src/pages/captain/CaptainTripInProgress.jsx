import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { rideService } from "../../services/ride.service";
import { MapContainer } from "../../components/common/MapContainer";
import { OtpInput } from "../../components/common/OtpInput";
import { Button } from "../../components/common/Button";
import toast from "react-hot-toast";

export const CaptainTripInProgress = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { emit } = useSocket();
  const [step, setStep] = useState("otp"); // otp or trip
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const ride = locationState.ride;

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await rideService.startRide(ride._id, otp);
      setStep("trip");
      toast.success("Trip started");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleEndRide = async () => {
    setLoading(true);
    try {
      await rideService.endRide(ride._id);
      emit("trip_completed", { rideId: ride._id });
      navigate("/trip-completed-captain", { state: { ride } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end ride");
    } finally {
      setLoading(false);
    }
  };

  if (!ride) {
    return <div className="p-4">No ride information</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 relative">
        <MapContainer
          center={{
            lat:
              (ride.pickupLocation.latitude + ride.dropoffLocation.latitude) /
              2,
            lng:
              (ride.pickupLocation.longitude + ride.dropoffLocation.longitude) /
              2,
          }}
          zoom={15}
        />
      </div>

      <div className="bg-white border-t p-4">
        {step === "otp" ? (
          <div className="space-y-4">
            <p className="font-bold">Ask rider for OTP</p>
            <OtpInput length={4} onComplete={setOtp} />
            <Button
              onClick={handleVerifyOtp}
              loading={loading}
              className="w-full"
            >
              Verify & Start Trip
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-bold">Trip in progress</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">To: {ride.dropoffAddress}</p>
            </div>
            <Button
              onClick={handleEndRide}
              loading={loading}
              className="w-full"
            >
              End Trip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
