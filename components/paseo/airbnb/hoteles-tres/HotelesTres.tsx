"use client";
import React, { useState } from 'react';
import { MapPin, Eye, SlidersHorizontal } from 'lucide-react';
import { HotelTres } from '@/types/hoteles';
import { hotelsDataTres } from '@/data/hoteles';
import { HotelCard } from './HotelCard';
import { QuickFilters } from './QuickFilters';


interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}

interface SortOption {
  value: string;
  label: string;
}

type ViewMode = 'comfortable' | 'compact';
type SortBy = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'newest';

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

  const filteredAndSortedHotels: HotelTres[] = hotelsDataTres
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
        <div className="mb-8 w-[calc(100vw-4rem)] overflow-x-auto">
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