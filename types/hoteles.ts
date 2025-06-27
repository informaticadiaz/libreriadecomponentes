export interface Hotel {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  superhost: boolean;
}

export interface HotelUno extends Hotel {
  image: string;
}

// Hotel Dos

type CategoryType = 'trending' | 'luxury' | 'unique';
export type AmenityType = 'wifi' | 'parking' | 'coffee' | 'waves';
export type ViewMode = 'grid' | 'list';

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface HotelCardProps {
  hotel: HotelDos;
  onToggleFavorite: (hotelId: number) => void;
  isFavorite: boolean;
  viewMode: ViewMode;
}

export interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export interface HotelDos extends Hotel {
  images: string[];
  originalPrice: number;
  amenities: AmenityType[];
  instantBook: boolean;
  discount: number;
  category: CategoryType;
}

export interface HotelTres extends Hotel {
 
}

export interface HotelCuatro extends Hotel {

}



