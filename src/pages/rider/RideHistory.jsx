import React, { useState, useEffect } from "react";
import { rideService } from "../../services/ride.service";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { Card } from "../../components/common/Card";
import { formatTime } from "../../utils/formatTime";
import { formatCurrency } from "../../utils/formatCurrency";

export const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRideHistory();
  }, [page]);

  const fetchRideHistory = async () => {
    try {
      const response = await rideService.getRideHistory(page, 10);
      setRides(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Ride History</h1>

      {rides && rides.length > 0 ? (
        <div className="space-y-3">
          {rides.map((ride) => (
            <Card key={ride._id} hover>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{ride.pickupAddress}</p>
                  <p className="text-sm text-gray-600">{ride.dropoffAddress}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(ride.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(ride.fare.totalFare)}
                  </p>
                  <p className="text-sm text-gray-600">{ride.status}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Rides"
          description="You haven't taken any rides yet"
        />
      )}
    </div>
  );
};
