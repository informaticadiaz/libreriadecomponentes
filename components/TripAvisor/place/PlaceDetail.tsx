"use client";
import { PlaceInfo } from "./PlaceInfo";
import { Header } from "../ui/Header";
import { PlaceHero } from "./PlaceHero";
import { ActionButtons } from "../ui/ActionButtons";
import { ReviewsSection } from "./ReviewsSection";

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


export const PlaceDetail = ({ place, onBack }: { 
  place: Place; 
  onBack: () => void; 
}) => (
  <div className="bg-gray-50 min-h-screen pb-20">
    <Header title={place.name} showBack={true} onBack={onBack} />
    <PlaceHero place={place} />
    
    <div className="p-4 space-y-4">
      <PlaceInfo place={place} />
      <ActionButtons />
      <ReviewsSection review={place.topReview} />
    </div>
  </div>
);
