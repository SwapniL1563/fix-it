"use client";

interface StarRatingProps {
  rating: number;
  max?: number;   
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(max)].map((_, i) => {
        if (i < filledStars) {
          return (
            <span key={i} className="text-yellow-500 text-lg">
              ★
            </span>
          );
        } else if (i === filledStars && hasHalfStar) {
          return (
            <span key={i} className="text-yellow-500 text-lg">
              ☆
            </span>
          );
        } else {
          return (
            <span key={i} className="text-gray-300 text-lg">
              ★
            </span>
          );
        }
      })}
      <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
}
