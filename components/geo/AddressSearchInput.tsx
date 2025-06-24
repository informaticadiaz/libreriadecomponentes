// components/AddressSearchInput.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAddressSearch } from '@/hooks/geo/useAddressSearch';

interface AddressSearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  maxResults?: number;
  debounceMs?: number;
}

export const AddressSearchInput: React.FC<AddressSearchInputProps> = ({
  onSearch,
  placeholder = "Buscar dirección (ej: Gutierrez 2444)",
  maxResults = 10,
  debounceMs = 500
}) => {
  const [query, setQuery] = useState('');
  const { searchAddresses, loading } = useAddressSearch();
  const debounceRef = useRef<NodeJS.Timeout | null>(null); // ✅ Valor inicial agregado

  // Debounced search effect
  useEffect(() => {
    console.log('🎯 Input effect triggered with query:', query);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      console.log('⏰ Debounce finished, executing search for:', query);
      
      if (query.trim().length >= 3) {
        console.log('✅ Query length >= 3, calling searchAddresses');
        searchAddresses(query, maxResults);
        onSearch?.(query);
      } else {
        console.log('❌ Query too short, not searching');
        onSearch?.('');
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAddresses, maxResults, debounceMs, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('⌨️ Input changed to:', newQuery);
    setQuery(newQuery);
  };

  const clearInput = () => {
    console.log('🧹 Clearing input');
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Loading spinner or clear button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : query && (
            <button
              onClick={clearInput}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Search hint */}
      <p className="mt-1 text-sm text-gray-600">
        Escribe al menos 3 caracteres para buscar
      </p>
      
      {/* Debug info for input component */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-1 text-xs text-gray-500">
          Input Debug: {query} | Length: {query.length} | Loading: {loading.toString()}
        </div>
      )}
    </div>
  );
};