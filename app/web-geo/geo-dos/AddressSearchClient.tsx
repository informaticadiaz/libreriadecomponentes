// app/address-search/AddressSearchClient.tsx
"use client";

import React from 'react';
import { QuilmesAddressSearchSelector } from '@/components/geo/QuilmesAddressSearchSelector';
import type { GeorefAddress, AddressValidationResult } from '@/types/georef';

interface AddressSearchClientProps {
  deliveryZoneConfig: {
    center: { lat: number; lon: number };
    polygon?: { lat: number; lon: number }[];
    radiusKm?: number;
  };
  title?: string;
}

interface StoredAddressData {
  address: GeorefAddress;
  validationResult: AddressValidationResult;
  timestamp: string;
}

export const AddressSearchClient: React.FC<AddressSearchClientProps> = ({
  deliveryZoneConfig,
  title = "Buscar mi Dirección de Delivery"
}) => {
  // This function runs on the client
  const handleAddressConfirmed = (address: GeorefAddress, validationResult: AddressValidationResult) => {
    console.log('Address confirmed:', address);
    console.log('Validation result:', validationResult);
    
    // Here you could:
    // - Save to local storage
    // - Call API routes
    // - Update state
    // - Navigate to another page
    // - Show success message
    
    // Example: Save to localStorage
    if (typeof window !== 'undefined') {
      const dataToStore: StoredAddressData = {
        address,
        validationResult,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('selectedAddress', JSON.stringify(dataToStore));
      console.log('✅ Address saved to localStorage');
    }
    
    // Example: Show success alert based on validation result
    if (validationResult.success && validationResult.inDeliveryZone) {
      const distance = validationResult.distance ? ` (${validationResult.distance.toFixed(1)} km)` : '';
      alert(`✅ ¡Perfecto! Hacemos delivery en: ${address.nomenclatura}${distance}`);
    } else if (validationResult.success && !validationResult.inDeliveryZone) {
      const distance = validationResult.distance ? ` - Distancia: ${validationResult.distance.toFixed(1)} km` : '';
      alert(`❌ Lo sentimos, no hacemos delivery en: ${address.nomenclatura}${distance}`);
    } else {
      const errorMsg = validationResult.error || 'Error desconocido';
      alert(`⚠️ Error al validar la dirección: ${errorMsg}`);
    }
  };

  return (
    <QuilmesAddressSearchSelector
      deliveryZoneConfig={deliveryZoneConfig}
      title={title}
      onAddressConfirmed={handleAddressConfirmed}
    />
  );
};