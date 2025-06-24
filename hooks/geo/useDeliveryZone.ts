// hooks/useDeliveryZone.ts
"use client";

import { useState, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lon: number;
}

interface DeliveryZoneConfig {
  center: Coordinates;
  polygon?: Coordinates[];
  radiusKm?: number;
}

export const useDeliveryZone = (config: DeliveryZoneConfig) => {
  const [lastCheckedAddress, setLastCheckedAddress] = useState<{
    coordinates: Coordinates;
    inZone: boolean;
    address: string;
  } | null>(null);

  // Point in polygon algorithm
  const isPointInPolygon = useCallback((point: Coordinates, polygon: Coordinates[]): boolean => {
    const { lat, lon } = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat;
      const yi = polygon[i].lon;
      const xj = polygon[j].lat;
      const yj = polygon[j].lon;
      
      if (((yi > lon) !== (yj > lon)) && (lat < (xj - xi) * (lon - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }, []);

  // Distance calculation (Haversine formula)
  const calculateDistance = useCallback((point1: Coordinates, point2: Coordinates): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lon - point1.lon) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }, []);

  const isInDeliveryZone = useCallback((coordinates: Coordinates, address?: string): boolean => {
    let inZone = false;

    if (config.polygon) {
      inZone = isPointInPolygon(coordinates, config.polygon);
    } else if (config.radiusKm) {
      const distance = calculateDistance(coordinates, config.center);
      inZone = distance <= config.radiusKm;
    }

    if (address) {
      setLastCheckedAddress({
        coordinates,
        inZone,
        address
      });
    }

    return inZone;
  }, [config, isPointInPolygon, calculateDistance]);

  const getDistanceFromCenter = useCallback((coordinates: Coordinates): number => {
    return calculateDistance(coordinates, config.center);
  }, [calculateDistance, config.center]);

  return {
    isInDeliveryZone,
    getDistanceFromCenter,
    lastCheckedAddress,
    deliveryCenter: config.center
  };
};
