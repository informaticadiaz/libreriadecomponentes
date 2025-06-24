// components/QuilmesAddressSearchSelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ValidationResult } from './ValidationResult';
import { useQuilmesSearch } from '@/hooks/geo/useQuilmesSearch';
import { useAddressSelection } from '@/hooks/geo/useAddressSelection';
import type { GeorefAddress, AddressValidationResult } from '@/types/georef';

interface QuilmesAddressSearchSelectorProps {
  deliveryZoneConfig: {
    center: { lat: number; lon: number };
    polygon?: { lat: number; lon: number }[];
    radiusKm?: number;
  };
  title?: string;
  onAddressConfirmed?: (address: GeorefAddress, validationResult: AddressValidationResult) => void;
}

export const QuilmesAddressSearchSelector: React.FC<QuilmesAddressSearchSelectorProps> = ({
  deliveryZoneConfig,
  title = "Buscar Dirección en Quilmes",
  onAddressConfirmed
}) => {
  const [query, setQuery] = useState('');
  const [addresses, setAddresses] = useState<GeorefAddress[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  
  const { 
    searchQuilmesAddresses, 
    searchQuilmesStreets,
    loading, 
    error,
    streetSuggestions
  } = useQuilmesSearch();
  
  const { 
    selectedAddress, 
    selectAddress, 
    clearSelection 
  } = useAddressSelection({ 
    deliveryZoneConfig,
    onAddressSelected: (result) => {
      onAddressConfirmed?.(result.address, result.validationResult);
    }
  });

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.length >= 3) {
        console.log('🔍 Searching Quilmes addresses for:', query);
        const results = await searchQuilmesAddresses(query);
        setAddresses(results);
        
        // Also search for street suggestions
        const streetQuery = query.split(/\s+/).find(part => part.length >= 3 && !/^\d+$/.test(part));
        if (streetQuery) {
          searchQuilmesStreets(streetQuery);
        }
      } else {
        setAddresses([]);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchQuilmesAddresses, searchQuilmesStreets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(newQuery.length >= 2);
  };

  const handleStreetSuggestionClick = (streetName: string) => {
    // Replace the street part in the query with the suggested street
    const parts = query.split(/\s+/);
    const numberPart = parts.find(part => /^\d+$/.test(part));
    
    if (numberPart) {
      setQuery(`${streetName} ${numberPart}`);
    } else {
      setQuery(streetName);
    }
    setShowSuggestions(false);
  };

  const handleAddressSelect = async (address: GeorefAddress) => {
    console.log('🎯 Address selected:', address);
    await selectAddress(address);
  };

  const handleClearAll = () => {
    setQuery('');
    setAddresses([]);
    setShowSuggestions(false);
    clearSelection();
  };

  const clearInput = () => {
    setQuery('');
    setAddresses([]);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">
          Búsqueda inteligente con sugerencias de calles para Quilmes
        </p>
      </div>

      {/* Enhanced Search Input */}
      <div className="flex justify-center mb-4">
        <div className="relative w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Buscar en Quilmes (ej: Gutierrez 2444)"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
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
          
          <p className="mt-1 text-sm text-gray-600">
            🏘️ Búsqueda limitada a Quilmes | Escribe al menos 3 caracteres
          </p>
          
          {/* Street Suggestions Dropdown */}
          {showSuggestions && streetSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-gray-500 mb-2">💡 Sugerencias de calles:</p>
                {streetSuggestions.slice(0, 5).map((street) => (
                  <button
                    key={street.id}
                    onClick={() => handleStreetSuggestionClick(street.nombre)}
                    className="w-full text-left p-2 hover:bg-blue-50 rounded text-sm transition-colors"
                  >
                    <span className="font-medium">{street.nombre}</span>
                    <span className="text-gray-500 ml-2">({street.categoria})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Quilmes Search Debug:</strong><br/>
          Query: {query} | Addresses: {addresses.length} | 
          Loading: {loading.toString()} | Error: {error || 'none'} |
          Street Suggestions: {streetSuggestions.length}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Address Results */}
      {query.length >= 3 && !loading && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md">
            {addresses.length > 0 ? (
              <div className="border border-gray-200 rounded-lg bg-white shadow-sm max-h-96 overflow-y-auto">
                <div className="p-2">
                  <p className="text-sm text-gray-600 mb-2 px-2">
                    🏠 {addresses.length} dirección{addresses.length !== 1 ? 'es' : ''} encontrada{addresses.length !== 1 ? 's' : ''} en Quilmes:
                  </p>
                  
                  {addresses.map((address, index) => (
                    <button
                      key={`${address.calle?.id || 'addr'}-${index}`}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 mb-1"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {address.nomenclatura}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          📍 {address.localidad_censal?.nombre || address.departamento?.nombre}, {address.provincia?.nombre}
                        </div>
                        
                        {address.ubicacion && (
                          <div className="text-xs text-gray-500">
                            Coordenadas: {address.ubicacion.lat.toFixed(4)}, {address.ubicacion.lon.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : query.length >= 3 && (
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="text-center">
                  <p className="text-yellow-800 font-medium">🔍 No se encontraron direcciones en Quilmes</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Búsqueda: <strong>{query}</strong>
                  </p>
                  <div className="mt-3 text-xs text-yellow-600">
                    <p><strong>💡 Sugerencias:</strong></p>
                    <ul className="mt-1 space-y-1 text-left">
                      <li>• Usa el nombre completo de la calle (ej: 336 Gutierrez en lugar de Gutierrez)</li>
                      <li>• Prueba con: Rivadavia 100, Mitre 500, San Martin 200</li>
                      <li>• Verifica la ortografía</li>
                      <li>• Usa las sugerencias de calles que aparecen al escribir</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Address Validation */}
      {selectedAddress && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dirección Seleccionada en Quilmes:
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-medium text-green-900">
                {selectedAddress.address.nomenclatura}
              </p>
              <p className="text-sm text-green-700">
                📍 {selectedAddress.address.localidad_censal?.nombre || selectedAddress.address.departamento?.nombre}, {selectedAddress.address.provincia?.nombre}
              </p>
            </div>
          </div>
          
          <ValidationResult
            result={selectedAddress.validationResult}
            onClear={handleClearAll}
          />
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="mb-2">
          🏘️ <strong>Búsqueda especializada para Quilmes</strong> - Con sugerencias inteligentes de calles
        </p>
        <p className="mb-2">
          💡 <strong>Tip:</strong> Si no encuentras tu calle, usa las sugerencias que aparecen al escribir
        </p>
        <p>
          🤖 Sistema con búsqueda fuzzy y múltiples estrategias para mejor precisión
        </p>
      </div>
    </div>
  );
};