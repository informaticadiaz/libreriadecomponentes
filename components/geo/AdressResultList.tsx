
// components/AddressResultsList.tsx
"use client";

import React from 'react';

interface AddressResult {
  altura: { valor: number; unidad: string };
  calle: { nombre: string; categoria: string; id: string };
  ubicacion: { lat: number; lon: number } | null;
  provincia: { nombre: string; id: string };
  departamento: { nombre: string; id: string };
  localidad_censal: { nombre: string; id: string };
  nomenclatura: string;
}

interface AddressResultsListProps {
  addresses: AddressResult[];
  onAddressSelect: (address: AddressResult) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  lastQuery?: string;
}

export const AddressResultsList: React.FC<AddressResultsListProps> = ({
  addresses,
  onAddressSelect,
  loading = false,
  error = null,
  emptyMessage = "No se encontraron direcciones",
  lastQuery = ''
}) => {
  // Debug info - can be removed in production
  console.log('🔍 AddressResultsList render:', {
    addresses: addresses.length,
    loading,
    error,
    lastQuery
  });

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-600">Buscando direcciones...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md">
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <div className="flex-1">
              <span className="text-red-700 block">{error}</span>
              {lastQuery && (
                <span className="text-red-600 text-sm">Query: {lastQuery}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (addresses.length === 0 && lastQuery) {
    return (
      <div className="w-full max-w-md">
        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <div className="text-center">
            <p className="text-yellow-800 font-medium">🔍 {emptyMessage}</p>
            <p className="text-yellow-700 text-sm mt-1">
              Búsqueda: <strong>{lastQuery}</strong>
            </p>
            <div className="mt-3 text-xs text-yellow-600">
              <p><strong>Sugerencias:</strong></p>
              <ul className="mt-1 space-y-1">
                <li>• Intenta con solo calle y altura: Corrientes 1234</li>
                <li>• Verifica la ortografía</li>
                <li>• Usa nombres de calles completos</li>
                <li>• Prueba sin tildes o caracteres especiales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm max-h-96 overflow-y-auto">
        <div className="p-2">
          <p className="text-sm text-gray-600 mb-2 px-2">
            {addresses.length} resultado{addresses.length !== 1 ? 's' : ''} encontrado{addresses.length !== 1 ? 's' : ''}:
          </p>
          
          {addresses.map((address, index) => (
            <button
              key={`${address.calle.id}-${index}`}
              onClick={() => onAddressSelect(address)}
              className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 mb-1"
            >
              <div className="space-y-1">
                {/* Main address */}
                <div className="font-medium text-gray-900">
                  {address.nomenclatura}
                </div>
                
                {/* Location details */}
                <div className="text-sm text-gray-600">
                  📍 {address.localidad_censal.nombre}, {address.departamento.nombre}, {address.provincia.nombre}
                </div>
                
                {/* Coordinates if available */}
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
    </div>
  );
};
