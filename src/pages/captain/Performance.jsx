import React, { useState, useEffect } from "react";
import { captainService } from "../../services/captain.service";
import { Loader } from "../../components/common/Loader";
import { StarRating } from "../../components/common/StarRating";
import { Chip } from "../../components/common/Chip";

export const Performance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const response = await captainService.getPerformance();
      setPerformance(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-6">Performance</h1>

      {/* Rating */}
      <div className="bg-gray-50 p-6 rounded-lg text-center mb-6">
        <p className="text-sm text-gray-600 mb-2">Average Rating</p>
        <p className="text-4xl font-bold mb-3">
          {performance?.averageRating?.toFixed(1) || 0}
        </p>
        <div className="flex justify-center">
          <StarRating
            rating={Math.round(performance?.averageRating || 0)}
            interactive={false}
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-xs text-gray-600">Total Rides</p>
          <p className="text-2xl font-bold">{performance?.totalRides || 0}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-xs text-gray-600">Cancellations</p>
          <p className="text-2xl font-bold">
            {performance?.cancellations || 0}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-xs text-gray-600">Acceptance Rate</p>
          <p className="text-2xl font-bold">
            {performance?.acceptanceRate || 0}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-xs text-gray-600">On-time Rate</p>
          <p className="text-2xl font-bold">{performance?.onTimeRate || 0}%</p>
        </div>
      </div>

      {/* Badges */}
      {performance?.badges && performance.badges.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {performance.badges.map((badge) => (
              <Chip key={badge} label={badge} variant="primary" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
