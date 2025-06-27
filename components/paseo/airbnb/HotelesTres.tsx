"use client";
import React, { useState } from 'react';
import { Heart, Star, MapPin, Calendar, Users, Eye, Clock, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';



// Interfaces para tipado
interface Hotel {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  distance: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  host: string;
  hostImage: string;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  checkin: string;
  features: string[];
  available: boolean;
  newListing: boolean;
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

interface HotelCardProps {
  hotel: Hotel;
  onToggleFavorite: (hotelId: number) => void;
  isFavorite: boolean;
  isCompact?: boolean;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
}

type ViewMode = 'comfortable' | 'compact';
type SortBy = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'newest';

// Datos de ejemplo con más variedad
const hotelsData: Hotel[] = [
  {
    id: 1,
    title: "Estudio moderno en Gràcia",
    subtitle: "Diseño contemporáneo en barrio bohemio",
    location: "Barcelona, España",
    distance: "2.3 km del centro",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    price: 89,
    rating: 4.92,
    reviews: 184,
    host: "María",
    hostImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    type: "Estudio completo",
    beds: 1,
    baths: 1,
    guests: 2,
    checkin: "Flexible",
    features: ["Vista a la ciudad", "Cocina equipada", "Workspace"],
    available: true,
    newListing: true
  },
  {
    id: 2,
    title: "Apartamento luminoso en Malvarossa",
    subtitle: "A 50m de la playa, vistas espectaculares",
    location: "Valencia, España",
    distance: "5 min andando a la playa",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    price: 134,
    rating: 4.89,
    reviews: 92,
    host: "Carlos",
    hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    type: "Apartamento",
    beds: 2,
    baths: 1,
    guests: 4,
    checkin: "A partir de las 15:00",
    features: ["Vista al mar", "Balcón", "A/C"],
    available: true,
    newListing: false
  },
  {
    id: 3,
    title: "Villa de lujo en Sa Caleta",
    subtitle: "Arquitectura mediterránea con piscina privada",
    location: "Ibiza, España",
    distance: "15 min del aeropuerto",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    price: 450,
    rating: 4.96,
    reviews: 67,
    host: "Alessandro",
    hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    type: "Villa completa",
    beds: 4,
    baths: 3,
    guests: 8,
    checkin: "Check-in autónomo",
    features: ["Piscina privada", "Jardín", "Parking"],
    available: false,
    newListing: false
  },
  {
    id: 4,
    title: "Loft artístico en Chueca",
    subtitle: "Espacio creativo en el corazón de Madrid",
    location: "Madrid, España",
    distance: "10 min a Gran Vía",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    price: 112,
    rating: 4.85,
    reviews: 156,
    host: "Ana",
    hostImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    type: "Loft",
    beds: 1,
    baths: 1,
    guests: 3,
    checkin: "Flexible",
    features: ["Techos altos", "Arte local", "Luminoso"],
    available: true,
    newListing: false
  },
  {
    id: 5,
    title: "Casa típica andaluza",
    subtitle: "Patio tradicional en barrio histórico",
    location: "Sevilla, España",
    distance: "8 min a la Catedral",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    price: 98,
    rating: 4.88,
    reviews: 203,
    host: "Francisco",
    hostImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
    type: "Casa completa",
    beds: 3,
    baths: 2,
    guests: 6,
    checkin: "A partir de las 16:00",
    features: ["Patio andaluz", "AC", "Céntrico"],
    available: true,
    newListing: true
  },
  {
    id: 6,
    title: "Ático con terraza en Guggenheim",
    subtitle: "Vistas panorámicas de la ría de Bilbao",
    location: "Bilbao, España",
    distance: "2 min al museo",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    price: 167,
    rating: 4.94,
    reviews: 89,
    host: "Iker",
    hostImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face",
    type: "Ático",
    beds: 2,
    baths: 2,
    guests: 4,
    checkin: "Check-in autónomo",
    features: ["Terraza", "Vistas", "Moderno"],
    available: true,
    newListing: false
  }
];

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onToggleFavorite, isFavorite, isCompact = false }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  if (isCompact) {
    return (
      <div 
        className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <Image
            width={400}
            height={300}
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onToggleFavorite(hotel.id);
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>

          {hotel.newListing && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Nuevo
            </div>
          )}

          {!hotel.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium">
                No disponible
              </span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                {hotel.title}
              </h3>
              <p className="text-gray-500 text-sm">{hotel.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{hotel.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{hotel.location}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm">{hotel.distance}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Image
                width={50}
                height={50}
                src={hotel.hostImage}
                alt={hotel.host}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">Host: {hotel.host}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">${hotel.price}</div>
              <div className="text-gray-500 text-sm">por noche</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          src={hotel.image}
          alt={hotel.title}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onToggleFavorite(hotel.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {hotel.newListing && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            ✨ Nuevo
          </div>
        )}

        {!hotel.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-semibold shadow-xl">
              <Clock className="w-5 h-5 inline mr-2" />
              No disponible
            </div>
          </div>
        )}

        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
            <h3 className="font-semibold text-gray-900 text-xl leading-tight mb-1">
              {hotel.title}
            </h3>
            <p className="text-gray-600">{hotel.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-gray-500 text-sm">({hotel.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          <span>{hotel.location}</span>
          <span className="text-gray-400">•</span>
          <span>{hotel.distance}</span>
        </div>

        <div className="flex items-center gap-2">
          {hotel.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Image
              width={50}
              height={50}
              src={hotel.hostImage}
              alt={hotel.host}
              className="w-8 h-8 rounded-full ring-2 ring-gray-100"
            />
            <span className="text-gray-600">Anfitrión: {hotel.host}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl">${hotel.price}</div>
            <div className="text-gray-500">por noche</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickFilters: React.FC<QuickFiltersProps> = ({ filters, activeFilters, onFilterChange }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {filters.map((filter) => (
      <button
        key={filter.id}
        onClick={() => onFilterChange(filter.id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
          activeFilters.includes(filter.id)
            ? 'bg-black text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        <span className="text-lg">{filter.icon}</span>
        {filter.label}
      </button>
    ))}
  </div>
);

const AirbnbHotelsView: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('recommended');

  const quickFilters: QuickFilter[] = [
    { id: 'new', label: 'Nuevos', icon: '✨' },
    { id: 'available', label: 'Disponible ahora', icon: '🕐' },
    { id: 'luxury', label: 'Premium', icon: '👑' },
    { id: 'beach', label: 'Cerca de playa', icon: '🏖️' },
    { id: 'center', label: 'Centro ciudad', icon: '🏛️' },
    { id: 'views', label: 'Con vistas', icon: '🌅' }
  ];

  const sortOptions: SortOption[] = [
    { value: 'recommended', label: 'Recomendados' },
    { value: 'price_low', label: 'Precio: menor a mayor' },
    { value: 'price_high', label: 'Precio: mayor a menor' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'newest', label: 'Más recientes' }
  ];

  const toggleFavorite = (hotelId: number): void => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(hotelId)) {
      newFavorites.delete(hotelId);
    } else {
      newFavorites.add(hotelId);
    }
    setFavorites(newFavorites);
  };

  const handleFilterChange = (filterId: string): void => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredAndSortedHotels: Hotel[] = hotelsData
    .filter((hotel) => {
      if (activeFilters.includes('new') && !hotel.newListing) return false;
      if (activeFilters.includes('available') && !hotel.available) return false;
      if (activeFilters.includes('luxury') && hotel.price < 200) return false;
      if (activeFilters.includes('beach') && !hotel.location.includes('Valencia') && !hotel.location.includes('Ibiza')) return false;
      if (activeFilters.includes('center') && !hotel.distance.includes('centro') && !hotel.distance.includes('min')) return false;
      if (activeFilters.includes('views') && !hotel.features.some(f => f.includes('Vista') || f.includes('Vistas'))) return false;
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Encuentra tu hogar perfecto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre alojamientos únicos con anfitriones locales en más de 190 países
          </p>
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <QuickFilters
            filters={quickFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <p className="text-gray-600 font-medium">
              {filteredAndSortedHotels.length} alojamientos
            </p>
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as SortBy)}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('comfortable')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'comfortable' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Vista cómoda"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'compact' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Vista compacta"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'comfortable' 
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {filteredAndSortedHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.has(hotel.id)}
              isCompact={viewMode === 'compact'}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedHotels.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-6">
              <MapPin className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No hay alojamientos disponibles
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Parece que no hay propiedades que coincidan con tus filtros actuales.
              Prueba a ajustar los criterios de búsqueda.
            </p>
            <button
              onClick={() => setActiveFilters([])}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Ver todos los alojamientos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirbnbHotelsView;