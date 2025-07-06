import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Star, MapPin, Users, Calendar, Clock } from 'lucide-react';
import { HotelTres } from '@/types/hoteles';

interface HotelCardProps {
  hotel: HotelTres;
  onToggleFavorite: (hotelId: number) => void;
  isFavorite: boolean;
  isCompact?: boolean;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onToggleFavorite, isFavorite, isCompact = false }) => {
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
              <span>{hotel.checkIn}</span>
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