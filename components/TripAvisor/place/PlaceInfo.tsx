import { Award, Clock, Globe, MapPin, Phone } from 'lucide-react';
import { RatingStars } from '../ui/RatingStarts';

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

export const PlaceInfo = ({ place }: { place: Place }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
        <p className="text-gray-600 text-lg">{place.category}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-green-600">{place.price}</div>
        {place.isOpen && (
          <div className="text-sm text-green-600 font-medium flex items-center justify-end">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Abierto ahora
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center space-x-3 mb-4">
      <RatingStars rating={place.rating} size="lg" />
      <span className="text-xl font-bold">{place.rating}</span>
      <span className="text-gray-600">({place.reviews.toLocaleString()} opiniones)</span>
    </div>

    {place.badge && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center text-green-700">
          <Award className="w-5 h-5 mr-2" />
          <span className="font-medium">{place.badge}</span>
        </div>
      </div>
    )}

    <p className="text-gray-700 mb-4 text-base">{place.description}</p>

    <div className="space-y-3">
      <div className="flex items-center text-gray-600">
        <Clock className="w-5 h-5 mr-3" />
        <span className="text-base">{place.hours}</span>
      </div>
      {place.phone !== "N/A" && (
        <div className="flex items-center text-gray-600">
          <Phone className="w-5 h-5 mr-3" />
          <span className="text-base">{place.phone}</span>
        </div>
      )}
      {place.website !== "N/A" && (
        <div className="flex items-center text-gray-600">
          <Globe className="w-5 h-5 mr-3" />
          <span className="text-base">{place.website}</span>
        </div>
      )}
      <div className="flex items-center text-gray-600">
        <MapPin className="w-5 h-5 mr-3" />
        <span className="text-base">{place.location}</span>
      </div>
    </div>
  </div>
);