"use client";
import React, { useState } from 'react';
import { Heart, Search, Grid3X3, List, Eye, Filter} from 'lucide-react';
import { hotelsDataCuatro } from '@/data/hoteles';
import { HotelCard } from './HotelCard';

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

  const filteredAndSortedHotels = hotelsDataCuatro
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