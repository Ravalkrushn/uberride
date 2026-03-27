import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { rideService } from "../../services/ride.service";
import { ratingService } from "../../services/rating.service";
import { FareBreakdown } from "../../components/common/FareBreakdown";
import { Loader } from "../../components/common/Loader";
import { Card } from "../../components/common/Card";

export const RideDetail = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      rideService.getRideDetails(rideId),
      ratingService.getRideRatings(rideId),
    ]).then(([rideRes, ratingsRes]) => {
      setRide(rideRes.data);
      setRatings(ratingsRes.data || []);
      setLoading(false);
    });
  }, [rideId]);

  if (loading) return <Loader fullScreen />;
  if (!ride) return <div className="p-4">Ride not found</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Ride Details</h1>

      <div className="space-y-4">
        <Card>
          <p className="text-sm text-gray-600 mb-1">From</p>
          <p className="font-bold">{ride.pickupAddress}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 mb-1">To</p>
          <p className="font-bold">{ride.dropoffAddress}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 mb-1">Driver</p>
          <p className="font-bold">{ride.captain?.fullname}</p>
          <p className="text-sm">{ride.captain?.vehicle?.licensePlate}</p>
        </Card>

        <FareBreakdown
          baseFare={ride.fare?.baseFare || 0}
          distanceFare={ride.fare?.distanceFare || 0}
          total={ride.fare?.totalFare || 0}
        />

        {ratings && ratings.length > 0 && (
          <Card>
            <p className="font-bold mb-3">Rating</p>
            {ratings.map((r) => (
              <div key={r._id} className="text-sm">
                <p>{r.comment}</p>
                <p className="text-gray-600">★ {r.rating}/5</p>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};
