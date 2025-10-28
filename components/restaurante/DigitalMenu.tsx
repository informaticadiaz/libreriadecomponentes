'use client';

import { useState } from 'react';
import Image from 'next/image';

// TypeScript interfaces for type safety
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Sample categories data
// TODO: Replace with dynamic data from Supabase
// Example query: const { data: categories } = await supabase.from('categories').select('*')
const CATEGORIES: Category[] = [
  { id: '1', name: 'Todas', slug: 'todas' },
  { id: '2', name: 'Entradas', slug: 'entradas' },
  { id: '3', name: 'Platos principales', slug: 'platos-principales' },
  { id: '4', name: 'Postres', slug: 'postres' },
  { id: '5', name: 'Bebidas', slug: 'bebidas' },
];

// Sample dishes data with realistic Argentine menu items
// TODO: Replace with dynamic data from Supabase
// Example query: const { data: dishes } = await supabase.from('dishes').select('*').eq('available', true)
const SAMPLE_DISHES: Dish[] = [
  // Entradas
  {
    id: '1',
    name: 'Empanadas Salteñas',
    description: 'Empanadas de carne cortada a cuchillo, cebolla, huevo y especias',
    price: 850,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    category: 'entradas',
    available: true,
  },
  {
    id: '2',
    name: 'Provoleta a la Parrilla',
    description: 'Queso provolone grillado con orégano y aceite de oliva',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1628180188916-b1e5ad556382?w=800&q=80',
    category: 'entradas',
    available: true,
  },
  {
    id: '3',
    name: 'Tabla de Fiambres',
    description: 'Selección de quesos y fiambres argentinos con pan casero',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1542696415-5ef4e4f9b500?w=800&q=80',
    category: 'entradas',
    available: true,
  },
  {
    id: '4',
    name: 'Humita en Chala',
    description: 'Choclo rallado con especias envuelto en hojas de maíz',
    price: 950,
    image: 'https://images.unsplash.com/photo-1625938145312-598c52e77cee?w=800&q=80',
    category: 'entradas',
    available: true,
  },

  // Platos principales
  {
    id: '5',
    name: 'Milanesa con Papas Fritas',
    description: 'Milanesa de ternera empanizada con papas fritas caseras',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80',
    category: 'platos-principales',
    available: true,
  },
  {
    id: '6',
    name: 'Bife de Chorizo',
    description: 'Corte premium de 350g con guarnición a elección',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    category: 'platos-principales',
    available: true,
  },
  {
    id: '7',
    name: 'Locro Norteño',
    description: 'Guiso tradicional de maíz, porotos, zapallo y carnes',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    category: 'platos-principales',
    available: true,
  },
  {
    id: '8',
    name: 'Sorrentinos de Jamón y Queso',
    description: 'Pasta fresca rellena con salsa de tomate casera',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    category: 'platos-principales',
    available: true,
  },
  {
    id: '9',
    name: 'Parrillada para Dos',
    description: 'Selección de carnes a la parrilla: vacío, chorizo, morcilla y mollejas',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    category: 'platos-principales',
    available: true,
  },

  // Postres
  {
    id: '10',
    name: 'Flan Casero con Dulce de Leche',
    description: 'Flan tradicional bañado en dulce de leche y crema',
    price: 1400,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
    category: 'postres',
    available: true,
  },
  {
    id: '11',
    name: 'Torta Rogel',
    description: 'Capas de hojaldre rellenas con dulce de leche y merengue italiano',
    price: 1600,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    category: 'postres',
    available: true,
  },
  {
    id: '12',
    name: 'Panqueques con Dulce de Leche',
    description: 'Panqueques caseros rellenos y bañados en dulce de leche',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80',
    category: 'postres',
    available: true,
  },
  {
    id: '13',
    name: 'Helado Artesanal',
    description: 'Dos bochas de helado de dulce de leche y chocolate',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    category: 'postres',
    available: true,
  },

  // Bebidas
  {
    id: '14',
    name: 'Vino Malbec Copa',
    description: 'Copa de vino tinto Malbec de Mendoza',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    category: 'bebidas',
    available: true,
  },
  {
    id: '15',
    name: 'Cerveza Artesanal',
    description: 'Pinta de cerveza artesanal tirada (IPA o Rubia)',
    price: 950,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
    category: 'bebidas',
    available: true,
  },
  {
    id: '16',
    name: 'Limonada Casera',
    description: 'Limonada natural con menta y jengibre',
    price: 650,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=800&q=80',
    category: 'bebidas',
    available: true,
  },
  {
    id: '17',
    name: 'Café Espresso',
    description: 'Café espresso italiano',
    price: 550,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    category: 'bebidas',
    available: true,
  },
];

export default function DigitalMenu() {
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState<string>('todas');

  // Filter dishes based on selected category
  const filteredDishes = activeCategory === 'todas' 
    ? SAMPLE_DISHES 
    : SAMPLE_DISHES.filter(dish => dish.category === activeCategory);

  // Format price to Argentine pesos
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Nuestro Menú
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Cocina argentina tradicional
              </p>
            </div>
            
            {/* Optional: Add logo or cart icon here */}
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter Buttons */}
      <div className="bg-white border-b border-neutral-200 sticky top-[88px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav 
            className="flex gap-2 overflow-x-auto scrollbar-hide"
            role="navigation"
            aria-label="Categorías del menú"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  ${
                    activeCategory === category.slug
                      ? 'bg-red-500 text-white shadow-md hover:bg-red-600'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
                aria-pressed={activeCategory === category.slug}
                aria-label={`Filtrar por ${category.name}`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content - Dishes Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-sm text-neutral-600">
            {filteredDishes.length} {filteredDishes.length === 1 ? 'plato' : 'platos'} 
            {activeCategory !== 'todas' && (
              <span className="font-medium">
                {' '}en {CATEGORIES.find(c => c.slug === activeCategory)?.name}
              </span>
            )}
          </p>
        </div>

        {/* Dishes Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Lista de platos"
        >
          {filteredDishes.map((dish) => (
            <article
              key={dish.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              role="listitem"
            >
              {/* Dish Image */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={false}
                />
                
                {/* Availability badge (optional) */}
                {!dish.available && (
                  <div className="absolute top-3 right-3 bg-neutral-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                    No disponible
                  </div>
                )}
              </div>

              {/* Dish Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
                    {dish.name}
                  </h3>
                  <span className="ml-2 text-red-600 font-bold text-lg whitespace-nowrap">
                    {formatPrice(dish.price)}
                  </span>
                </div>

                <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                  {dish.description}
                </p>

                {/* Action Button */}
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!dish.available}
                  aria-label={`Agregar ${dish.name} al pedido`}
                >
                  {dish.available ? 'Agregar al pedido' : 'No disponible'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-neutral-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No hay platos disponibles
            </h3>
            <p className="text-neutral-600">
              Intenta seleccionar otra categoría
            </p>
          </div>
        )}
      </main>

      {/* Footer (Optional) */}
      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-neutral-600">
            Carta digital creada con Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}

/*
 * INTEGRATION NOTES FOR SUPABASE:
 * 
 * 1. Create tables in Supabase:
 *    - categories: id (uuid), name (text), slug (text), order (int)
 *    - dishes: id (uuid), name (text), description (text), price (numeric), 
 *              image (text), category_slug (text), available (boolean), created_at (timestamp)
 * 
 * 2. Install Supabase client:
 *    npm install @supabase/supabase-js
 * 
 * 3. Create Supabase client (lib/supabase.ts):
 *    import { createClient } from '@supabase/supabase-js'
 *    export const supabase = createClient(
 *      process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *    )
 * 
 * 4. Fetch data in a Server Component (app/menu/page.tsx):
 *    import { supabase } from '@/lib/supabase'
 *    import DigitalMenu from '@/components/DigitalMenu'
 *    
 *    export default async function MenuPage() {
 *      const { data: categories } = await supabase.from('categories').select('*').order('order')
 *      const { data: dishes } = await supabase.from('dishes').select('*').eq('available', true)
 *      
 *      return <DigitalMenu categories={categories} dishes={dishes} />
 *    }
 * 
 * 5. Update component to accept props:
 *    interface DigitalMenuProps {
 *      categories?: Category[]
 *      dishes?: Dish[]
 *    }
 *    
 *    export default function DigitalMenu({ categories = CATEGORIES, dishes = SAMPLE_DISHES }: DigitalMenuProps)
 * 
 * 6. For real-time updates, use Supabase subscriptions in a client component
 */