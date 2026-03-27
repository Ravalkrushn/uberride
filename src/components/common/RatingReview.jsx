import React, { useState } from "react";
import { Avatar } from "./Avatar";
import { StarRating } from "./StarRating";
import { formatTime } from "../../utils/formatTime";

export const RatingReview = ({
  rating,
  onEdit = null,
  onDelete = null,
  isOwn = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex gap-3 mb-2">
        <Avatar src={rating.raterPhoto} name={rating.raterName} size="sm" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{rating.raterName}</h4>
            <span className="text-xs text-gray-500">
              {formatTime(
                Math.floor((new Date() - new Date(rating.createdAt)) / 1000),
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={rating.rating} interactive={false} size="sm" />
            <span className="text-sm text-gray-600">{rating.rating}.0</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2">{rating.comment}</p>

      {rating.tags && rating.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {rating.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {isOwn && (onEdit || onDelete) && (
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-black hover:underline"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(rating._id)}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
