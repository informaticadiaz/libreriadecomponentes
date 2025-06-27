"use client";
import React, { useState } from 'react';
import { Grid3X3, List, Search } from 'lucide-react';
import { HotelDos, ViewMode, Category } from '@/types/hoteles';
import { hotelsDataDos } from '@/data/hoteles';
import { HotelCard } from './HotelCard';
import { CategoryFilter } from './CategoryFilter';

const AirbnbHotelsView: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const categories: Category[] = [
    { id: 'all', label: 'Todos', icon: '🏠' },
    { id: 'trending', label: 'Tendencia', icon: '🔥' },
    { id: 'luxury', label: 'Lujo', icon: '💎' },
    { id: 'unique', label: 'Únicos', icon: '🎨' },
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

  const filteredHotels: HotelDos[] = hotelsDataDos.filter((hotel: HotelDos) => {
    if (activeCategory !== 'all' && hotel.category !== activeCategory) return false;
    if (searchQuery && !hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !hotel.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) return false;
    return true;
  });

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setPriceRange([0, parseInt(e.target.value)]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = (): void => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceRange([0, 500]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Descubre alojamientos únicos
          </h1>
          <p className="text-gray-600 text-lg">
            Encuentra el lugar perfecto para tu próxima aventura
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ubicación o nombre..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 font-medium">
              {filteredHotels.length} alojamientos
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Precio:</span>
              <select
                value={priceRange[1]}
                onChange={handlePriceRangeChange}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1"
              >
                <option value={200}>Hasta $200</option>
                <option value={300}>Hasta $300</option>
                <option value={500}>Hasta $500</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hotels Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredHotels.map((hotel: HotelDos) => (
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
        {filteredHotels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No encontramos alojamientos
            </h3>
            <p className="text-gray-500 mb-4">
              Prueba con otros filtros o términos de búsqueda
            </p>
            <button
              onClick={clearFilters}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirbnbHotelsView;