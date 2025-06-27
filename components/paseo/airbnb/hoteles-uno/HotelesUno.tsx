"use client";
import React, { useState } from 'react';
import { MapPin, Filter, Grid3X3, List } from 'lucide-react';
import { HotelCard } from './HotelCard';
import { FilterButton } from './FilterButton';
import { hotelsDataUno } from '@/data/hoteles';

export default function AirbnbHotelsView() {
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('todos');
  const [priceRange, setPriceRange] = useState('todos');

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'casa', label: 'Casas' },
    { id: 'apartamento', label: 'Apartamentos' },
    { id: 'villa', label: 'Villas' },
    { id: 'superhost', label: 'Superhosts' }
  ];

  const priceFilters = [
    { id: 'todos', label: 'Cualquier precio' },
    { id: 'bajo', label: 'Menos de $100' },
    { id: 'medio', label: '$100 - $200' },
    { id: 'alto', label: 'Más de $200' }
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

  const filteredHotels = hotelsDataUno.filter(hotel => {
    if (activeFilter === 'superhost' && !hotel.superhost) return false;
    if (activeFilter !== 'todos' && activeFilter !== 'superhost') {
      if (!hotel.type.toLowerCase().includes(activeFilter)) return false;
    }
    
    if (priceRange === 'bajo' && hotel.price >= 100) return false;
    if (priceRange === 'medio' && (hotel.price < 100 || hotel.price > 200)) return false;
    if (priceRange === 'alto' && hotel.price <= 200) return false;
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Alojamientos en España
        </h1>
        <p className="text-gray-600">
          Más de {hotelsDataUno.length} alojamientos disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-fit">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          {filters.map(filter => (
            <FilterButton
              key={filter.id}
              active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-fit">
            <span className="text-sm font-medium">Precio:</span>
          </div>
          {priceFilters.map(filter => (
            <FilterButton
              key={filter.id}
              active={priceRange === filter.id}
              onClick={() => setPriceRange(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredHotels.length} alojamientos encontrados
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1 lg:grid-cols-2'
      }`}>
        {filteredHotels.map(hotel => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.has(hotel.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MapPin className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron alojamientos
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros para ver más opciones
          </p>
        </div>
      )}
    </div>
  );
}