"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  MapPin, 
  Camera, 
  Heart,
  Filter,
  ChevronDown,
  Clock,
  Phone,
  Globe,
  Share,
  Bookmark,
  ChevronRight,
  Award,
  Users,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';

// Interfaces
interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  location: string;
  description: string;
  badge: string;
  isOpen: boolean;
  hours: string;
  phone: string;
  website: string;
  topReview: Review;
}

interface Category {
  name: string;
  icon: string;
  count: string;
}

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "lg";
}

interface PlaceCardProps {
  place: Place;
}

interface PlaceDetailProps {
  place: Place;
}

const TripAdvisorApp = () => {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Datos de lugares típicos de TripAdvisor
  const places: Place[] = [
    {
      id: 1,
      name: "Museo del Prado",
      category: "Museo",
      rating: 4.5,
      reviews: 15420,
      price: "€€",
      image: "🖼️",
      location: "Costa, Argentina",
      description: "Una de las pinacotecas más importantes del mundo",
      badge: "Travellers' Choice 2024",
      isOpen: true,
      hours: "10:00 - 20:00",
      phone: "+34 91 330 2800",
      website: "www.museodelprado.es",
      topReview: {
        user: "María G.",
        rating: 5,
        date: "Hace 2 días",
        text: "Imprescindible visita en Madrid. Las obras de Velázquez y Goya son espectaculares.",
        helpful: 24,
        avatar: "👩‍🎨"
      }
    },
    {
      id: 2,
      name: "Restaurante Casa Botín",
      category: "Restaurante",
      rating: 4.2,
      reviews: 8934,
      price: "€€€",
      image: "🍽️",
      location: "Costa, Argentina",
      description: "El restaurante más antiguo del mundo según Guinness",
      badge: "Certificado de Excelencia",
      isOpen: true,
      hours: "12:00 - 16:00, 20:00 - 00:00",
      phone: "+34 91 366 4217",
      website: "www.botin.es",
      topReview: {
        user: "Carlos R.",
        rating: 4,
        date: "Hace 1 semana",
        text: "Cochinillo espectacular, ambiente histórico único. Un poco caro pero vale la pena.",
        helpful: 18,
        avatar: "👨‍💼"
      }
    },
    {
      id: 3,
      name: "Parque del Retiro",
      category: "Parque",
      rating: 4.6,
      reviews: 12567,
      price: "Gratis",
      image: "🌳",
      location: "Costa, Argentina",
      description: "Parque histórico en el corazón de Madrid",
      badge: "Patrimonio de la Humanidad",
      isOpen: true,
      hours: "06:00 - 24:00",
      phone: "N/A",
      website: "N/A",
      topReview: {
        user: "Ana L.",
        rating: 5,
        date: "Hace 3 días",
        text: "Perfecto para pasear y relajarse. El Palacio de Cristal es precioso.",
        helpful: 31,
        avatar: "👩‍🦱"
      }
    }
  ];

  const categories: Category[] = [
    { name: "Restaurantes", icon: "🍽️", count: "15,234" },
    { name: "Hoteles", icon: "🏨", count: "2,456" },
    { name: "Atracciones", icon: "🎭", count: "892" },
    { name: "Experiencias", icon: "🎪", count: "1,567" }
  ];

  // Header Component
  const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => (
    <div className="bg-green-600 text-white px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button 
              onClick={() => setSelectedPlace(null)}
              className="p-1 hover:bg-green-700 rounded"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-green-700 rounded">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-green-700 rounded">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  // Rating Stars Component
  const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = "sm" }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < fullStars 
                ? 'text-green-500 fill-current' 
                : i === fullStars && hasHalfStar
                ? 'text-green-500 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Place Card Component
  const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => (
    <div 
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden active:scale-95 transition-transform cursor-pointer"
      onClick={() => setSelectedPlace(place)}
    >
      {/* Image and Badge */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <span className="text-6xl">{place.image}</span>
        {place.badge && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Award className="w-3 h-3 mr-1" />
            {place.badge}
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md active:bg-gray-50">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{place.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{place.category}</p>
            <div className="flex items-center space-x-2 mb-2">
              <RatingStars rating={place.rating} />
              <span className="text-sm font-medium text-gray-700">{place.rating}</span>
              <span className="text-sm text-gray-500">({place.reviews.toLocaleString()} opiniones)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">{place.price}</div>
            {place.isOpen && (
              <div className="text-xs text-green-600 font-medium">Abierto</div>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {place.location}
        </div>

        <p className="text-sm text-gray-700 mb-3">{place.description}</p>

        {/* Top Review Preview */}
        <div className="bg-gray-50 rounded-lg p-3 border">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              {place.topReview.avatar}
            </div>
            <span className="text-sm font-medium">{place.topReview.user}</span>
            <RatingStars rating={place.topReview.rating} />
            <span className="text-xs text-gray-500">{place.topReview.date}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">&ldquo;{place.topReview.text}&rdquo;</p>
          <div className="flex items-center text-xs text-gray-500">
            <ThumbsUp className="w-3 h-3 mr-1" />
            {place.topReview.helpful} personas encontraron esto útil
          </div>
        </div>
      </div>
    </div>
  );

  // Place Detail Screen
  const PlaceDetail: React.FC<PlaceDetailProps> = ({ place }) => (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header title={place.name} showBack={true} />
      
      {/* Hero Image */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <span className="text-8xl">{place.image}</span>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          Ver todas las fotos
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-3 bg-white rounded-full shadow-md active:bg-gray-50">
            <Share className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 bg-white rounded-full shadow-md active:bg-gray-50">
            <Bookmark className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="p-4 space-y-4">
        {/* Main Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
              <p className="text-gray-600 text-lg">{place.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{place.price}</div>
              {place.isOpen && (
                <div className="text-sm text-green-600 font-medium flex items-center justify-end">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Abierto ahora
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <RatingStars rating={place.rating} size="lg" />
            <span className="text-xl font-bold">{place.rating}</span>
            <span className="text-gray-600">({place.reviews.toLocaleString()} opiniones)</span>
          </div>

          {place.badge && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center text-green-700">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-medium">{place.badge}</span>
              </div>
            </div>
          )}

          <p className="text-gray-700 mb-4 text-base">{place.description}</p>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3" />
              <span className="text-base">{place.hours}</span>
            </div>
            {place.phone !== "N/A" && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3" />
                <span className="text-base">{place.phone}</span>
              </div>
            )}
            {place.website !== "N/A" && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-5 h-5 mr-3" />
                <span className="text-base">{place.website}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <span className="text-base">{place.location}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-green-600 text-white py-4 rounded-xl font-medium text-base active:bg-green-700">
            Escribir opinión
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 py-4 rounded-xl font-medium text-base active:bg-gray-50">
            Cómo llegar
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 py-4 rounded-xl font-medium text-base active:bg-gray-50">
            Llamar
          </button>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Opiniones</h3>
            <button className="text-green-600 font-medium text-base">Ver todas</button>
          </div>

          {/* Review */}
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                {place.topReview.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-base">{place.topReview.user}</h4>
                <div className="flex items-center space-x-2">
                  <RatingStars rating={place.topReview.rating} />
                  <span className="text-sm text-gray-500">{place.topReview.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-3 text-base">&ldquo;{place.topReview.text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-gray-500">
                <button className="flex items-center space-x-2 active:text-green-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-base">Útil ({place.topReview.helpful})</span>
                </button>
                <button className="flex items-center space-x-2 active:text-green-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-base">Responder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Explore Screen
  const ExploreScreen = () => (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header title="Costa, Argentina" />
      
      {/* Search Bar */}
      <div className="bg-white p-4 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Restaurantes, hoteles, atracciones..."
            className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
          />
        </div>
        
        {/* Filters */}
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-full font-medium active:bg-green-700">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-full active:bg-gray-200">
            <span>Precio</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-full active:bg-gray-200">
            <span>Distancia</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Explorar por categoría</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 active:bg-gray-100 cursor-pointer">
              <span className="text-3xl">{category.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-base">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} lugares</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Places */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Principales atracciones</h2>
          <button className="text-green-600 font-medium">Ver todas</button>
        </div>
        
        {places.map(place => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="flex justify-around">
        {[
          { id: 'explore', icon: Search, label: 'Explorar' },
          { id: 'saved', icon: Bookmark, label: 'Guardados' },
          { id: 'trips', icon: MapPin, label: 'Viajes' },
          { id: 'profile', icon: Users, label: 'Perfil' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors active:scale-95 ${
              activeTab === tab.id 
                ? 'text-green-600' 
                : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-50 relative overflow-hidden">
      {/* Main Content */}
      <div className="h-full overflow-y-auto">
        {selectedPlace ? (
          <PlaceDetail place={selectedPlace} />
        ) : (
          <ExploreScreen />
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TripAdvisorApp;