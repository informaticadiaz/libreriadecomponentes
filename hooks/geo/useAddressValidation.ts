// hooks/useAddressValidation.ts
"use client";

import { useState, useCallback } from 'react';
import { useGeoref } from './useGeoref';
import { useDeliveryZone } from './useDeliveryZone';

interface AddressValidationResult {
  success: boolean;
  normalizedAddress?: string;
  coordinates?: { lat: number; lon: number };
  inDeliveryZone?: boolean;
  distance?: number;
  error?: string;
}

interface UseAddressValidationProps {
  deliveryZoneConfig: {
    center: { lat: number; lon: number };
    polygon?: { lat: number; lon: number }[];
    radiusKm?: number;
  };
  province?: string;
}

export const useAddressValidation = ({ 
  deliveryZoneConfig, 
  province = 'buenos aires' 
}: UseAddressValidationProps) => {
  const [result, setResult] = useState<AddressValidationResult | null>(null);
  const { validateAddress, loading } = useGeoref();
  const { isInDeliveryZone, getDistanceFromCenter } = useDeliveryZone(deliveryZoneConfig);

  const validateAndCheckZone = useCallback(async (address: string): Promise<AddressValidationResult> => {
    try {
      // Step 1: Validate address with Georef
      const geoResult = await validateAddress(address, province);
      
      if (!geoResult.isValid || !geoResult.coordinates) {
        const failResult: AddressValidationResult = {
          success: false,
          error: geoResult.error || 'Dirección inválida'
        };
        setResult(failResult);
        return failResult;
      }

      // Step 2: Check if coordinates are in delivery zone
      const inZone = isInDeliveryZone(geoResult.coordinates, address);
      const distance = getDistanceFromCenter(geoResult.coordinates);

      const successResult: AddressValidationResult = {
        success: inZone,
        normalizedAddress: geoResult.normalizedAddress,
        coordinates: geoResult.coordinates,
        inDeliveryZone: inZone,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimals
        error: inZone ? undefined : 'Dirección fuera de la zona de delivery'
      };

      setResult(successResult);
      return successResult;

    } catch (error) {
      const errorResult: AddressValidationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      setResult(errorResult);
      return errorResult;
    }
  }, [validateAddress, isInDeliveryZone, getDistanceFromCenter, province]);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    validateAndCheckZone,
    result,
    loading,
    clearResult
  };
};
