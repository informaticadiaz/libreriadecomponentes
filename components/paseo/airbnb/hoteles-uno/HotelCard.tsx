import { HotelUno } from '@/types/hoteles';
import Image from 'next/image';
import { Heart, Star, MapPin } from 'lucide-react';

export const HotelCard = ({ hotel, onToggleFavorite, isFavorite }: { 
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