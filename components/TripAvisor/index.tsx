import { useState } from "react";
import { useAppData } from "./hook/useAppData";
import { ExploreScreen } from "./explore/ExploreScreen";
import { BottomNav } from "./ui/BottomNav";
import { PlaceDetail } from "./place/PlaceDetail";

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

const TripAdvisorApp = () => {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const { places, categories } = useAppData();

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleBackToExplore = () => {
    setSelectedPlace(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedPlace(null);
  };

  return (
    <div className="w-full h-screen bg-gray-50 relative overflow-hidden">
      <div className="h-full overflow-y-auto">
        {selectedPlace ? (
          <PlaceDetail place={selectedPlace} onBack={handleBackToExplore} />
        ) : (
          <ExploreScreen 
            places={places} 
            categories={categories} 
            onPlaceClick={handlePlaceClick} 
          />
        )}
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default TripAdvisorApp;