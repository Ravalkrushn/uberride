import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export const StarRating = ({
  rating = 0,
  onRate,
  interactive = true,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={`transition-all ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
        >
          <FaStar
            size={24}
            className={`${sizeClasses[size]} ${
              star <= displayRating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
