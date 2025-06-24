// components/DeliveryZoneValidator.tsx
"use client";

import React from 'react';
import { AddressInput } from './AddressInput';
import { ValidationResult } from './ValidationResult';
import { useAddressValidation } from '@/hooks/geo/useAddressValidation';

interface DeliveryZoneValidatorProps {
  deliveryZoneConfig: {
    center: { lat: number; lon: number };
    polygon?: { lat: number; lon: number }[];
    radiusKm?: number;
  };
  province?: string;
  title?: string;
}

export const DeliveryZoneValidator: React.FC<DeliveryZoneValidatorProps> = ({
  deliveryZoneConfig,
  province = 'buenos aires',
  title = 'Verificar Zona de Delivery'
}) => {
  const { validateAndCheckZone, result, loading, clearResult } = useAddressValidation({
    deliveryZoneConfig,
    province
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">
          Ingresa tu dirección para verificar si hacemos delivery en tu zona
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <AddressInput
          onAddressSubmit={validateAndCheckZone}
          loading={loading}
          disabled={loading}
        />
      </div>

      {result && (
        <ValidationResult
          result={result}
          onClear={clearResult}
        />
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Utilizamos el servicio oficial de normalización de direcciones del gobierno argentino
        </p>
      </div>
    </div>
  );
};
