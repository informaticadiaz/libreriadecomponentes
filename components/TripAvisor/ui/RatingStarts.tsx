"use client";
import { 
  Star, 
} from 'lucide-react';


export const RatingStars = ({ rating, size = "sm" }: { 
  rating: number; 
  size?: "sm" | "lg"; 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < fullStars 
              ? 'text-green-500 fill-current' 
              : i === fullStars && hasHalfStar
              ? 'text-green-500 fill-current opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};
