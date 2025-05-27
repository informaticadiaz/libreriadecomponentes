"use client";
import { 
  MapPin, 
  Heart,
  Award,  
} from 'lucide-react';
import { RatingStars } from '../ui/RatingStarts';
import { ReviewPreview } from '../ui/ReviewPreview';


// Types
interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  location: string;
  description: string;
  badge: string;
  isOpen: boolean;
  hours: string;
  phone: string;
  website: string;
  topReview: Review;
}

export const PlaceCard = ({ place, onClick }: { 
  place: Place; 
  onClick: (place: Place) => void; 
}) => (
  <div 
    className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden active:scale-95 transition-transform cursor-pointer"
    onClick={() => onClick(place)}
  >
    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
      <span className="text-6xl">{place.image}</span>
      {place.badge && (
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Award className="w-3 h-3 mr-1" />
          {place.badge}
        </div>
      )}
      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md active:bg-gray-50">
        <Heart className="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{place.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{place.category}</p>
          <div className="flex items-center space-x-2 mb-2">
            <RatingStars rating={place.rating} />
            <span className="text-sm font-medium text-gray-700">{place.rating}</span>
            <span className="text-sm text-gray-500">({place.reviews.toLocaleString()} opiniones)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">{place.price}</div>
          {place.isOpen && (
            <div className="text-xs text-green-600 font-medium">Abierto</div>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        {place.location}
      </div>

      <p className="text-sm text-gray-700 mb-3">{place.description}</p>

      <ReviewPreview review={place.topReview} />
    </div>
  </div>
);
