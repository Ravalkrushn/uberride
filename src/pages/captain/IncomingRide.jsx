import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { rideService } from "../../services/ride.service";
import { Button } from "../../components/common/Button";
import { Avatar } from "../../components/common/Avatar";
import toast from "react-hot-toast";

export const IncomingRide = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { emit } = useSocket();
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const rideRequest = locationState.rideRequest;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          navigate("/captain-home");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await rideService.acceptRide(rideRequest._id);
      emit("ride_accepted", {
        captain: response.data.captain,
        rideId: rideRequest._id,
      });
      navigate("/go-to-pickup", { state: { ride: response.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept ride");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      await rideService.rejectRide(rideRequest._id);
      navigate("/captain-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject ride");
    }
  };

  if (!rideRequest) {
    return <div className="p-4">No ride request</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <p className="text-xl font-bold mb-2">New Ride Request</p>
        <p className="text-4xl font-bold text-green-600 mb-4">{timer}s</p>
      </div>

      {/* Rider Info */}
      {rideRequest.user && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              src={rideRequest.user.profilePhoto}
              name={rideRequest.user.fullname}
            />
            <div>
              <p className="font-bold">{rideRequest.user.fullname}</p>
              <p className="text-sm text-gray-600">★ 4.8</p>
            </div>
          </div>
        </div>
      )}

      {/* Ride Details */}
      <div className="space-y-3 w-full mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Pickup</p>
          <p className="font-bold">{rideRequest.pickupAddress}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Dropoff</p>
          <p className="font-bold">{rideRequest.dropoffAddress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Fare</p>
          <p className="font-bold text-green-600">
            ₹{rideRequest.fare?.totalFare}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 w-full flex flex-col">
        <Button onClick={handleAccept} loading={loading} className="w-full">
          Accept Ride
        </Button>
        <Button
          variant="danger"
          onClick={handleReject}
          disabled={loading}
          className="w-full"
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
