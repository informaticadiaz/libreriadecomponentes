import React, { useState } from 'react';
import Image from 'next/image';
import { HotelCardProps, AmenityType } from '@/types/hoteles';
import { Heart, Star, MapPin, Wifi, Car, Coffee, Waves } from 'lucide-react';

const amenityIcons: Record<AmenityType, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  waves: Waves
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onToggleFavorite, isFavorite, viewMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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

  if (viewMode === 'list') {
    return (
      <div className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4">
        <div className="flex gap-4">
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              width={400}
              height={300}
              src={hotel.images[currentImageIndex]}
              alt={hotel.title}
              className="w-full h-full object-cover rounded-xl"
            />
            {hotel.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  →
                </button>
              </>
            )}
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onToggleFavorite(hotel.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            {hotel.discount > 0 && (
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                -{hotel.discount}%
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  {hotel.superhost && (
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                      ⭐ Superhost
                    </span>
                  )}
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{hotel.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hotel.location}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-black" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                  <span className="text-gray-500 text-sm">({hotel.reviews})</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">
                {hotel.type} • {hotel.guests} huéspedes • {hotel.beds} habitaciones • {hotel.baths} baños
              </p>
              
              <div className="flex items-center gap-3 mb-3">
                {hotel.amenities.slice(0, 3).map((amenity: AmenityType) => {
                  const Icon = amenityIcons[amenity];
                  return Icon ? <Icon key={amenity} className="w-4 h-4 text-gray-500" /> : null;
                })}
                {hotel.instantBook && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Reserva instantánea
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hotel.originalPrice > hotel.price && (
                  <span className="text-gray-400 line-through text-sm">${hotel.originalPrice}</span>
                )}
                <span className="font-bold text-lg text-gray-900">${hotel.price}</span>
                <span className="text-gray-600">/noche</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3 overflow-hidden rounded-2xl">
        <Image
          width={400}
          height={300}
          src={hotel.images[currentImageIndex]}
          alt={hotel.title}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {hotel.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              →
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {hotel.images.map((_, index: number) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onToggleFavorite(hotel.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        
        {hotel.superhost && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            ⭐ Superhost
          </div>
        )}
        
        {hotel.discount > 0 && (
          <div className="absolute top-12 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            -{hotel.discount}%
          </div>
        )}
        
        {hotel.instantBook && (
          <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-xs">
            Reserva instantánea
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{hotel.title}</h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 fill-current text-black" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {hotel.location}
        </div>
        
        <p className="text-gray-500 text-sm">
          {hotel.guests} huéspedes • {hotel.beds} habitaciones
        </p>
        
        <div className="flex items-center gap-2">
          {hotel.amenities.slice(0, 3).map((amenity: AmenityType) => {
            const Icon = amenityIcons[amenity];
            return Icon ? <Icon key={amenity} className="w-4 h-4 text-gray-500" /> : null;
          })}
        </div>
        
        <div className="flex items-center gap-2 pt-1">
          {hotel.originalPrice > hotel.price && (
            <span className="text-gray-400 line-through text-sm">${hotel.originalPrice}</span>
          )}
          <span className="font-bold text-gray-900">${hotel.price}</span>
          <span className="text-gray-500 text-sm">/noche</span>
        </div>
      </div>
    </div>
  );
};