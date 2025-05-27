import { Camera, Share, Bookmark } from 'lucide-react';

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

interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

export const PlaceHero = ({ place }: { place: Place }) => (
  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
    <span className="text-8xl">{place.image}</span>
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg flex items-center">
      <Camera className="w-4 h-4 mr-2" />
      Ver todas las fotos
    </div>
    <div className="absolute top-4 right-4 flex space-x-2">
      <button className="p-3 bg-white rounded-full shadow-md active:bg-gray-50">
        <Share className="w-5 h-5 text-gray-700" />
      </button>
      <button className="p-3 bg-white rounded-full shadow-md active:bg-gray-50">
        <Bookmark className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  </div>
);
