"use client";
import { 
  Search, 
  Filter,
  ChevronDown,
} from 'lucide-react';




export const SearchBar = () => (
  <div className="bg-white p-4 shadow-sm">
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Restaurantes, hoteles, atracciones..."
        className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
      />
    </div>
    
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
);
