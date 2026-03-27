import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRide } from "../../hooks/useRide";
import { ratingService } from "../../services/rating.service";
import { StarRating } from "../../components/common/StarRating";
import { TextArea } from "../../components/common/TextArea";
import { Button } from "../../components/common/Button";
import { FareBreakdown } from "../../components/common/FareBreakdown";
import toast from "react-hot-toast";

export const TripCompleted = () => {
  const navigate = useNavigate();
  const { activeRide, clearRide } = useRide();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      await ratingService.rateRide(activeRide._id, rating, comment);
      toast.success("Rating submitted");
      clearRide();
      navigate("/rider-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    clearRide();
    navigate("/rider-home");
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Trip Completed</h1>

      {/* Fare Breakdown */}
      <div className="mb-6">
        <FareBreakdown
          baseFare={activeRide?.fare?.baseFare || 0}
          distanceFare={activeRide?.fare?.distanceFare || 0}
          surgeFare={activeRide?.fare?.surgeFare || 0}
          total={activeRide?.fare?.totalFare || 0}
        />
      </div>

      {/* Driver Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Driver: {activeRide?.captain?.fullname}
        </p>
        <p className="text-sm text-gray-600">
          Vehicle: {activeRide?.captain?.vehicle?.licensePlate}
        </p>
      </div>

      {/* Rating */}
      <div className="flex-1">
        <h3 className="font-bold mb-4">Rate your trip</h3>
        <div className="flex justify-center mb-6">
          <StarRating rating={rating} onRate={setRating} size="lg" />
        </div>

        <TextArea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={200}
        />
      </div>

      {/* Buttons */}
      <div className="space-y-3 mt-6">
        <Button
          onClick={handleSubmitRating}
          loading={loading}
          className="w-full"
        >
          Submit Rating
        </Button>
        <Button variant="secondary" onClick={handleSkip} className="w-full">
          Skip
        </Button>
      </div>
    </div>
  );
};
