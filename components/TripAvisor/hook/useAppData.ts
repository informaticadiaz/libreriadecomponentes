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

interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

interface Category {
  name: string;
  icon: string;
  count: string;
}


export const useAppData = () => {
  const places: Place[] = [
    {
      id: 1,
      name: "Museo del Prado",
      category: "Museo",
      rating: 4.5,
      reviews: 15420,
      price: "€€",
      image: "🖼️",
      location: "Madrid, España",
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
      location: "Madrid, España",
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
      location: "Madrid, España",
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

  return { places, categories };
};

