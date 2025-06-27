import { Heart, Star, MapPin, Clock, ChevronLeft, ChevronRight, Calendar, Users, Wifi, Car, Coffee, Waves } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { HotelCuatro } from '@/types/hoteles';

interface HotelCardProps {
  hotel: HotelCuatro;
  onToggleFavorite: (hotelId: number) => void;
  isFavorite: boolean;
  viewMode: ViewMode;
}

type ViewMode = 'comfortable' | 'compact' | 'list';

type AmenityKey = 'wifi' | 'parking' | 'coffee' | 'waves';

const amenityIcons: Record<AmenityKey, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  waves: Waves
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onToggleFavorite, isFavorite, viewMode }) => {
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
