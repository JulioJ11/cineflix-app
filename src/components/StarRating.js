import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating = null }) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${
          i <= fullStars ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
        onClick={() => setRating && setRating(i)}
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
