// types/georef.ts
export interface GeorefAddress {
  id?: string;
  nomenclatura: string;
  calle?: {
    id: string;
    nombre: string;
    categoria: string;
  };
  altura?: {
    numero: number;
    unidad?: string;
  };
  localidad_censal?: {
    id: string;
    nombre: string;
  };
  departamento?: {
    id: string;
    nombre: string;
  };
  provincia?: {
    id: string;
    nombre: string;
  };
  ubicacion?: {
    lat: number;
    lon: number;
  };
  fuente?: string;
}

export interface AddressValidationResult {
  success: boolean;
  inDeliveryZone?: boolean;  // Opcional para manejar casos de error
  distance?: number;
  coordinates?: {
    lat: number;
    lon: number;
  };
  error?: string;
  validatedAddress?: GeorefAddress;
}
