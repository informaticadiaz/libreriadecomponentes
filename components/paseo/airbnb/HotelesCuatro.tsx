"use client";
import React, { useState } from 'react';
import { Heart, Star, MapPin, Search, Grid3X3, List, Eye, Filter, Calendar, Users, Wifi, Car, Coffee, Waves, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Tipos para las interfaces
interface Hotel {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  distance: string;
  images: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  host: string;
  hostImage: string;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  superhost: boolean;
  amenities: string[];
  instantBook: boolean;
  discount: number;
  category: string;
  available: boolean;
  newListing: boolean;
  checkin: string;
  features: string[];
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}

interface SortOption {
  value: string;
  label: string;
}

type ViewMode = 'comfortable' | 'compact' | 'list';

type AmenityKey = 'wifi' | 'parking' | 'coffee' | 'waves';

// Datos combinados con todas las características
const hotelsData: Hotel[] = [
  {
    id: 1,
    title: "Casa moderna en el centro histórico",
    subtitle: "Diseño contemporáneo en barrio bohemio",
    location: "Barcelona, España",
    distance: "2.3 km del centro",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"
    ],
    price: 85,
    originalPrice: 110,
    rating: 4.8,
    reviews: 127,
    host: "María",
    hostImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    type: "Casa completa",
    beds: 3,
    baths: 2,
    guests: 6,
    superhost: true,
    amenities: ['wifi', 'parking', 'coffee'],
    instantBook: true,
    discount: 23,
    category: 'trending',
    available: true,
    newListing: true,
    checkin: "Flexible",
    features: ["Vista a la ciudad", "Cocina equipada", "Workspace"]
  },
  {
    id: 2,
    title: "Apartamento minimalista vista mar",
    subtitle: "A 50m de la playa, vistas espectaculares",
    location: "Valencia, España",
    distance: "5 min andando a la playa",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"
    ],
    price: 120,
    originalPrice: 140,
    rating: 4.9,
    reviews: 89,
    host: "Carlos",
    hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    type: "Apartamento",
    beds: 2,
    baths: 1,
    guests: 4,
    superhost: false,
    amenities: ['wifi', 'waves'],
    instantBook: false,
    discount: 14,
    category: 'luxury',
    available: true,
    newListing: false,
    checkin: "A partir de las 15:00",
    features: ["Vista al mar", "Balcón", "A/C"]
  },
  {
    id: 3,
    title: "Villa mediterránea con piscina infinita",
    subtitle: "Arquitectura mediterránea con piscina privada",
    location: "Ibiza, España",
    distance: "15 min del aeropuerto",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
    ],
    price: 350,
    originalPrice: 420,
    rating: 4.7,
    reviews: 234,
    host: "Alessandro",
    hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    type: "Villa",
    beds: 4,
    baths: 3,
    guests: 8,
    superhost: true,
    amenities: ['wifi', 'parking', 'waves'],
    instantBook: true,
    discount: 17,
    category: 'luxury',
    available: false,
    newListing: false,
    checkin: "Check-in autónomo",
    features: ["Piscina privada", "Jardín", "Parking"]
  },
  {
    id: 4,
    title: "Loft industrial con estilo único",
    subtitle: "Espacio creativo en el corazón de Madrid",
    location: "Madrid, España",
    distance: "10 min a Gran Vía",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop"
    ],
    price: 95,
    originalPrice: 95,
    rating: 4.6,
    reviews: 156,
    host: "Ana",
    hostImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    type: "Loft",
    beds: 1,
    baths: 1,
    guests: 2,
    superhost: false,
    amenities: ['wifi', 'coffee'],
    instantBook: true,
    discount: 0,
    category: 'trending',
    available: true,
    newListing: false,
    checkin: "Flexible",
    features: ["Techos altos", "Arte local", "Luminoso"]
  },
  {
    id: 5,
    title: "Casa típica andaluza",
    subtitle: "Patio tradicional en barrio histórico",
    location: "Sevilla, España",
    distance: "8 min a la Catedral",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop"
    ],
    price: 75,
    originalPrice: 90,
    rating: 4.8,
    reviews: 98,
    host: "Francisco",
    hostImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
    type: "Casa rural",
    beds: 3,
    baths: 2,
    guests: 6,
    superhost: true,
    amenities: ['wifi', 'parking'],
    instantBook: false,
    discount: 17,
    category: 'unique',
    available: true,
    newListing: true,
    checkin: "A partir de las 16:00",
    features: ["Patio andaluz", "AC", "Céntrico"]
  },
  {
    id: 6,
    title: "Ático moderno con terraza panorámica",
    subtitle: "Vistas panorámicas de la ría de Bilbao",
    location: "Bilbao, España",
    distance: "2 min al museo",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"
    ],
    price: 140,
    originalPrice: 170,
    rating: 4.9,
    reviews: 203,
    host: "Iker",
    hostImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face",
    type: "Ático",
    beds: 2,
    baths: 2,
    guests: 4,
    superhost: true,
    amenities: ['wifi', 'parking', 'coffee'],
    instantBook: true,
    discount: 18,
    category: 'luxury',
    available: true,
    newListing: false,
    checkin: "Check-in autónomo",
    features: ["Terraza", "Vistas", "Moderno"]
  }
];

const amenityIcons: Record<AmenityKey, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  waves: Waves
};

// Props para el componente HotelCard
interface HotelCardProps {
  hotel: Hotel;
  onToggleFavorite: (hotelId: number) => void;
  isFavorite: boolean;
  viewMode: ViewMode;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onToggleFavorite, isFavorite, viewMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const nextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  // Vista de lista horizontal premium
  if (viewMode === 'list') {
    return (
      <div 
        className="group cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-6">
          <div className="relative w-80 h-56 flex-shrink-0 overflow-hidden rounded-2xl">
            <Image
              width={400}
              height={300}
              src={hotel.images[currentImageIndex]}
              alt={hotel.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {hotel.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {hotel.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(hotel.id);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-all hover:scale-110"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>

            {hotel.discount > 0 && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                -{hotel.discount}%
              </div>
            )}

            {hotel.newListing && (
              <div className="absolute top-16 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                ✨ Nuevo
              </div>
            )}

            {!hotel.available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-2xl">
                <div className="bg-white text-gray-900 px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  No disponible
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  {hotel.superhost && (
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium mb-2">
                      ⭐ Superhost
                    </span>
                  )}
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{hotel.title}</h3>
                  <p className="text-gray-600 mb-2">{hotel.subtitle}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hotel.location} • {hotel.distance}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{hotel.rating}</span>
                  <span className="text-gray-500">({hotel.reviews})</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-600">
                  {hotel.type} • {hotel.guests} huéspedes • {hotel.beds} habitaciones • {hotel.baths} baños
                </p>
                
                <div className="flex items-center gap-3">
                  {hotel.amenities.slice(0, 4).map(amenity => {
                    const Icon = amenityIcons[amenity as AmenityKey];
                    return Icon ? <Icon key={amenity} className="w-5 h-5 text-gray-500" /> : null;
                  })}
                  {hotel.instantBook && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      Reserva instantánea
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {hotel.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <Image
                  width={50}
                  height={50}
                  src={hotel.hostImage}
                  alt={hotel.host}
                  className="w-10 h-10 rounded-full ring-2 ring-gray-100"
                />
                <div>
                  <div className="text-sm text-gray-600">Anfitrión</div>
                  <div className="font-medium">{hotel.host}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {hotel.originalPrice > hotel.price && (
                    <span className="text-gray-400 line-through text-lg">${hotel.originalPrice}</span>
                  )}
                  <span className="font-bold text-2xl text-gray-900">${hotel.price}</span>
                </div>
                <div className="text-gray-600">por noche</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de grilla premium
  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 overflow-hidden rounded-3xl">
        <Image
          width={400}
          height={300}
          src={hotel.images[currentImageIndex]}
          alt={hotel.title}
          className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            viewMode === 'compact' ? 'h-64' : 'h-80'
          }`}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {hotel.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {hotel.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(hotel.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {hotel.superhost && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            ⭐ Superhost
          </div>
        )}

        {hotel.discount > 0 && (
          <div className="absolute top-16 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{hotel.discount}%
          </div>
        )}

        {hotel.newListing && (
          <div className="absolute top-28 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            ✨ Nuevo
          </div>
        )}

        {hotel.instantBook && (
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
            Reserva instantánea
          </div>
        )}

        {!hotel.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-semibold shadow-xl flex items-center gap-2">
              <Clock className="w-5 h-5" />
              No disponible
            </div>
          </div>
        )}

        {/* Overlay hover con información adicional */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${isHovered && viewMode !== 'compact' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4" />
              <span>{hotel.guests} huéspedes • {hotel.beds} habitaciones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>{hotel.checkin}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 leading-tight mb-1 ${viewMode === 'compact' ? 'text-lg' : 'text-xl'}`}>
              {hotel.title}
            </h3>
            {viewMode !== 'compact' && (
              <p className="text-gray-600 text-sm">{hotel.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{hotel.rating}</span>
            {viewMode !== 'compact' && (
              <span className="text-gray-500 text-sm">({hotel.reviews})</span>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{hotel.location}</span>
          {viewMode !== 'compact' && (
            <>
              <span className="text-gray-400 mx-1">•</span>
              <span>{hotel.distance}</span>
            </>
          )}
        </div>

        <p className="text-gray-500 text-sm">
          {hotel.guests} huéspedes • {hotel.beds} habitaciones
        </p>

        {viewMode !== 'compact' && (
          <>
            <div className="flex items-center gap-2">
              {hotel.amenities.slice(0, 3).map(amenity => {
                const Icon = amenityIcons[amenity as AmenityKey];
                return Icon ? <Icon key={amenity} className="w-4 h-4 text-gray-500" /> : null;
              })}
            </div>

            <div className="flex items-center gap-2">
              {hotel.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {feature}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-2">
          {viewMode !== 'compact' && (
            <div className="flex items-center gap-2">
              <Image
                width={50}
                height={50}
                src={hotel.hostImage}
                alt={hotel.host}
                className="w-6 h-6 rounded-full ring-1 ring-gray-200"
              />
              <span className="text-sm text-gray-600">{hotel.host}</span>
            </div>
          )}
          <div className={`${viewMode === 'compact' ? 'w-full' : ''} text-right`}>
            <div className="flex items-center gap-2 justify-end">
              {hotel.originalPrice > hotel.price && (
                <span className="text-gray-400 line-through text-sm">${hotel.originalPrice}</span>
              )}
              <span className="font-bold text-lg text-gray-900">${hotel.price}</span>
            </div>
            <div className="text-gray-500 text-sm">por noche</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Props para CategoryFilter
interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onCategoryChange }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {categories.map(category => (
      <button
        key={category.id}
        onClick={() => onCategoryChange(category.id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
          activeCategory === category.id
            ? 'bg-black text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        <span className="text-lg">{category.icon}</span>
        {category.label}
      </button>
    ))}
  </div>
);

// Props para QuickFilters
interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ filters, activeFilters, onFilterChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {filters.map(filter => (
      <button
        key={filter.id}
        onClick={() => onFilterChange(filter.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
          activeFilters.includes(filter.id)
            ? 'bg-black text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
        }`}
      >
        <span>{filter.icon}</span>
        {filter.label}
      </button>
    ))}
  </div>
);

const AirbnbHotelsView: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const categories: Category[] = [
    { id: 'all', label: 'Todos', icon: '🏠' },
    { id: 'trending', label: 'Tendencia', icon: '🔥' },
    { id: 'luxury', label: 'Lujo', icon: '💎' },
    { id: 'unique', label: 'Únicos', icon: '🎨' },
  ];

  const quickFilters: QuickFilter[] = [
    { id: 'new', label: 'Nuevos', icon: '✨' },
    { id: 'available', label: 'Disponible', icon: '🕐' },
    { id: 'superhost', label: 'Superhosts', icon: '⭐' },
    { id: 'instant', label: 'Reserva instantánea', icon: '⚡' },
    { id: 'discount', label: 'Con descuento', icon: '💰' },
    { id: 'beach', label: 'Cerca de playa', icon: '🏖️' }
  ];

  const sortOptions: SortOption[] = [
    { value: 'recommended', label: 'Recomendados' },
    { value: 'price_low', label: 'Precio: menor a mayor' },
    { value: 'price_high', label: 'Precio: mayor a menor' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'newest', label: 'Más recientes' }
  ];

  const toggleFavorite = (hotelId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(hotelId)) {
      newFavorites.delete(hotelId);
    } else {
      newFavorites.add(hotelId);
    }
    setFavorites(newFavorites);
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredAndSortedHotels = hotelsData
    .filter(hotel => {
      // Filtros de categoría
      if (activeCategory !== 'all' && hotel.category !== activeCategory) return false;
      
      // Búsqueda por texto
      if (searchQuery && !hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !hotel.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Filtros rápidos
      if (activeFilters.includes('new') && !hotel.newListing) return false;
      if (activeFilters.includes('available') && !hotel.available) return false;
      if (activeFilters.includes('superhost') && !hotel.superhost) return false;
      if (activeFilters.includes('instant') && !hotel.instantBook) return false;
      if (activeFilters.includes('discount') && hotel.discount === 0) return false;
      if (activeFilters.includes('beach') && !hotel.location.includes('Valencia') && !hotel.location.includes('Ibiza')) return false;
      
      // Filtro de precio
      if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low': return a.price - b.price;
        case 'price_high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return (b.newListing ? 1 : 0) - (a.newListing ? 1 : 0);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Encuentra tu hogar perfecto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre alojamientos únicos con anfitriones locales en más de 190 países
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filtros rápidos:</span>
          </div>
          <QuickFilters
            filters={quickFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-6">
            <p className="text-gray-600 font-semibold text-lg">
              {filteredAndSortedHotels.length} alojamientos
            </p>
            {(activeFilters.length > 0 || searchQuery || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange([0, 500]);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline font-medium"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Precio máximo:</span>
              <select
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value={200}>$200</option>
                <option value={300}>$300</option>
                <option value={500}>$500</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-300">
              <button
                onClick={() => setViewMode('comfortable')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'comfortable' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Vista cómoda"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'compact' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Vista compacta"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Vista de lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeFilters.length > 0 || activeCategory !== 'all') && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {activeCategory !== 'all' && (
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {categories.find(c => c.id === activeCategory)?.label}
                  <button onClick={() => setActiveCategory('all')} className="hover:bg-gray-700 rounded-full p-0.5">
                    ×
                  </button>
                </span>
              )}
              {activeFilters.map(filterId => (
                <span key={filterId} className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {quickFilters.find(f => f.id === filterId)?.label}
                  <button 
                    onClick={() => handleFilterChange(filterId)}
                    className="hover:bg-gray-700 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hotels Grid/List */}
        <div className={`${
          viewMode === 'list' 
            ? 'space-y-6' 
            : viewMode === 'compact'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
        }`}>
          {filteredAndSortedHotels.map(hotel => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              viewMode={viewMode}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.has(hotel.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedHotels.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-6">
              <Search className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No encontramos alojamientos
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Prueba ajustando los filtros o busca en otra ubicación para encontrar el lugar perfecto.
            </p>
            <button
              onClick={() => {
                setActiveFilters([]);
                setSearchQuery('');
                setActiveCategory('all');
                setPriceRange([0, 500]);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Ver todos los alojamientos
            </button>
          </div>
        )}

        {/* Footer with favorites count */}
        {favorites.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <span className="font-medium">
              {favorites.size} favorito{favorites.size !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirbnbHotelsView;