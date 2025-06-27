"use client";
import React, { useState } from 'react';
import { Heart, Star, MapPin, Filter, Grid3X3, List } from 'lucide-react';
import Image from 'next/image';
import { HotelUno } from '@/types/hoteles';

// Datos de ejemplo
const hotelsData = [
  {
    id: 1,
    title: "Casa moderna en el centro",
    location: "Barcelona, España",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    price: 85,
    rating: 4.8,
    reviews: 127,
    type: "Casa completa",
    beds: 3,
    baths: 2,
    guests: 6,
    superhost: true
  },
  {
    id: 2,
    title: "Apartamento con vista al mar",
    location: "Valencia, España",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    price: 120,
    rating: 4.9,
    reviews: 89,
    type: "Apartamento",
    beds: 2,
    baths: 1,
    guests: 4,
    superhost: false
  },
  {
    id: 3,
    title: "Villa de lujo con piscina",
    location: "Ibiza, España",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    price: 350,
    rating: 4.7,
    reviews: 234,
    type: "Villa",
    beds: 4,
    baths: 3,
    guests: 8,
    superhost: true
  },
  {
    id: 4,
    title: "Loft industrial en Malasaña",
    location: "Madrid, España",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    price: 95,
    rating: 4.6,
    reviews: 156,
    type: "Loft",
    beds: 1,
    baths: 1,
    guests: 2,
    superhost: false
  },
  {
    id: 5,
    title: "Casa rural con jardín",
    location: "Sevilla, España",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    price: 75,
    rating: 4.8,
    reviews: 98,
    type: "Casa rural",
    beds: 3,
    baths: 2,
    guests: 6,
    superhost: true
  },
  {
    id: 6,
    title: "Ático moderno con terraza",
    location: "Bilbao, España",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    price: 140,
    rating: 4.9,
    reviews: 203,
    type: "Ático",
    beds: 2,
    baths: 2,
    guests: 4,
    superhost: true
  }
];



const HotelCard = ({ hotel, onToggleFavorite, isFavorite }: { 
  hotel: HotelUno, 
  onToggleFavorite: (id: number) => void, 
  isFavorite: boolean 
}) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3">
        <Image
          width={400}
          height={300}
          src={hotel.image}
          alt={hotel.title}
          className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(hotel.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        {hotel.superhost && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
            Superhost
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">{hotel.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-black" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {hotel.location}
        </div>
        
        <p className="text-gray-500 text-sm">
          {hotel.type} · {hotel.guests} huéspedes · {hotel.beds} habitaciones · {hotel.baths} baños
        </p>
        
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>{hotel.reviews} reseñas</span>
        </div>
        
        <div className="pt-1">
          <span className="font-semibold text-gray-900">${hotel.price}</span>
          <span className="text-gray-500"> /noche</span>
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ active: active, onClick: onClick, children: children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
      active
        ? 'bg-black text-white border-black'
        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
    }`}
  >
    {children}
  </button>
);

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

  const filteredHotels = hotelsData.filter(hotel => {
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
          Más de {hotelsData.length} alojamientos disponibles
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