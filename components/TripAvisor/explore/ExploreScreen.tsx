import { Header } from '../ui/Header';
import { SearchBar } from '../ui/SearchBar';
import { CategoryGrid } from './CategoryGrid';
import { PlaceCard } from '../place/PlaceCard';

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

interface Category {
  name: string;
  icon: string;
  count: string;
}


export const ExploreScreen = ({ 
  places, 
  categories, 
  onPlaceClick 
}: { 
  places: Place[]; 
  categories: Category[]; 
  onPlaceClick: (place: Place) => void; 
}) => (
  <div className="bg-gray-50 min-h-screen pb-20">
    <Header title="Madrid, España" />
    <SearchBar />
    <CategoryGrid categories={categories} />
    
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Principales atracciones</h2>
        <button className="text-green-600 font-medium">Ver todas</button>
      </div>
      
      {places.map(place => (
        <PlaceCard key={place.id} place={place} onClick={onPlaceClick} />
      ))}
    </div>
  </div>
);
