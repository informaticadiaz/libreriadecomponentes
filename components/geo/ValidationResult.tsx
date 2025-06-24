// components/ValidationResult.tsx
"use client";

import React from 'react';

interface ValidationResultProps {
  result: {
    success: boolean;
    normalizedAddress?: string;
    coordinates?: { lat: number; lon: number };
    inDeliveryZone?: boolean;
    distance?: number;
    error?: string;
  };
  onClear: () => void;
}

export const ValidationResult: React.FC<ValidationResultProps> = ({ result, onClear }) => {
  const getStatusColor = () => {
    if (result.success && result.inDeliveryZone) return 'bg-green-50 border-green-200';
    if (!result.success) return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getStatusIcon = () => {
    if (result.success && result.inDeliveryZone) return '✅';
    if (!result.success) return '❌';
    return '⚠️';
  };

  const getStatusText = () => {
    if (result.success && result.inDeliveryZone) return '¡Dirección válida! Hacemos delivery aquí';
    if (!result.success) return 'Dirección no válida';
    return 'Dirección válida pero fuera de zona de delivery';
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getStatusIcon()}</span>
            <h3 className="font-medium text-gray-900">{getStatusText()}</h3>
          </div>
          
          {result.normalizedAddress && (
            <p className="text-sm text-gray-700 mb-2">
              <strong>Dirección normalizada:</strong> {result.normalizedAddress}
            </p>
          )}
          
          {result.coordinates && (
            <p className="text-sm text-gray-600 mb-2">
              📍 Coordenadas: {result.coordinates.lat.toFixed(6)}, {result.coordinates.lon.toFixed(6)}
            </p>
          )}
          
          {result.distance !== undefined && (
            <p className="text-sm text-gray-600 mb-2">
              📏 Distancia desde centro: {result.distance} km
            </p>
          )}
          
          {result.error && (
            <p className="text-sm text-red-600 mb-2">
              <strong>Error:</strong> {result.error}
            </p>
          )}
        </div>
        
        <button
          onClick={onClear}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          title="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
