
// hooks/useAddressSelection.ts
"use client";

import { useState, useCallback } from 'react';
import { useAddressValidation } from './useAddressValidation';
import type { GeorefAddress, AddressValidationResult } from '@/types/georef';

interface SelectedAddress {
  address: GeorefAddress;
  validationResult: AddressValidationResult;
}

interface UseAddressSelectionProps {
  deliveryZoneConfig: {
    center: { lat: number; lon: number };
    polygon?: { lat: number; lon: number }[];
    radiusKm?: number;
  };
  onAddressSelected?: (result: SelectedAddress) => void;
}

export const useAddressSelection = ({ 
  deliveryZoneConfig, 
  onAddressSelected 
}: UseAddressSelectionProps) => {
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const { validateAndCheckZone } = useAddressValidation({ deliveryZoneConfig });

  const selectAddress = useCallback(async (address: GeorefAddress): Promise<SelectedAddress | null> => {
    try {
      console.log('🎯 Selecting address:', address);
      
      // Validate the selected address with delivery zone
      const validationResult = await validateAndCheckZone(address.nomenclatura);
      
      // Ensure inDeliveryZone has a default value
      const normalizedResult: AddressValidationResult = {
        ...validationResult,
        inDeliveryZone: validationResult.inDeliveryZone ?? false
      };
      
      const selection: SelectedAddress = {
        address,
        validationResult: normalizedResult
      };
      
      setSelectedAddress(selection);
      onAddressSelected?.(selection);
      
      console.log('✅ Address selected and validated:', selection);
      return selection;
    } catch (error) {
      console.error('❌ Error validating selected address:', error);
      
      // Create error validation result
      const errorResult: AddressValidationResult = {
        success: false,
        inDeliveryZone: false,
        error: error instanceof Error ? error.message : 'Error desconocido al validar la dirección'
      };
      
      const errorSelection: SelectedAddress = {
        address,
        validationResult: errorResult
      };
      
      setSelectedAddress(errorSelection);
      onAddressSelected?.(errorSelection);
      
      return errorSelection;
    }
  }, [validateAndCheckZone, onAddressSelected]);

  const clearSelection = useCallback(() => {
    console.log('🧹 Clearing address selection');
    setSelectedAddress(null);
  }, []);

  return {
    selectedAddress,
    selectAddress,
    clearSelection
  };
};

export type { SelectedAddress, UseAddressSelectionProps, GeorefAddress, AddressValidationResult };