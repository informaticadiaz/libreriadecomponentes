import { HotelDos } from '../types/hoteles';

export const hotelsDataDos: HotelDos[] = [
  {
    id: 1,
    title: "Casa moderna en el centro histórico",
    location: "Barcelona, España",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
    ],
    price: 85,
    originalPrice: 110,
    rating: 4.8,
    reviews: 127,
    type: "Casa completa",
    beds: 3,
    baths: 2,
    guests: 6,
    superhost: true,
    amenities: ['wifi', 'parking', 'coffee'],
    instantBook: true,
    discount: 23,
    category: 'trending'
  },
  {
    id: 2,
    title: "Apartamento minimalista vista mar",
    location: "Valencia, España",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
    ],
    price: 120,
    originalPrice: 140,
    rating: 4.9,
    reviews: 89,
    type: "Apartamento",
    beds: 2,
    baths: 1,
    guests: 4,
    superhost: false,
    amenities: ['wifi', 'waves'],
    instantBook: false,
    discount: 14,
    category: 'luxury'
  },
  {
    id: 3,
    title: "Villa mediterránea con piscina infinita",
    location: "Ibiza, España",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    ],
    price: 350,
    originalPrice: 420,
    rating: 4.7,
    reviews: 234,
    type: "Villa",
    beds: 4,
    baths: 3,
    guests: 8,
    superhost: true,
    amenities: ['wifi', 'parking', 'waves'],
    instantBook: true,
    discount: 17,
    category: 'luxury'
  },
  {
    id: 4,
    title: "Loft industrial con estilo único",
    location: "Madrid, España",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
    ],
    price: 95,
    originalPrice: 95,
    rating: 4.6,
    reviews: 156,
    type: "Loft",
    beds: 1,
    baths: 1,
    guests: 2,
    superhost: false,
    amenities: ['wifi', 'coffee'],
    instantBook: true,
    discount: 0,
    category: 'trending'
  },
  {
    id: 5,
    title: "Casa rural con encanto andaluz",
    location: "Sevilla, España",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop"
    ],
    price: 75,
    originalPrice: 90,
    rating: 4.8,
    reviews: 98,
    type: "Casa rural",
    beds: 3,
    baths: 2,
    guests: 6,
    superhost: true,
    amenities: ['wifi', 'parking'],
    instantBook: false,
    discount: 17,
    category: 'unique'
  },
  {
    id: 6,
    title: "Ático moderno con terraza panorámica",
    location: "Bilbao, España",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
    ],
    price: 140,
    originalPrice: 170,
    rating: 4.9,
    reviews: 203,
    type: "Ático",
    beds: 2,
    baths: 2,
    guests: 4,
    superhost: true,
    amenities: ['wifi', 'parking', 'coffee'],
    instantBook: true,
    discount: 18,
    category: 'luxury'
  }
];