"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Interfaces para la API de GeoRef
interface GeoRefProvincia {
  id: string;
  nombre: string;
}

interface GeoRefDepartamento {
  id: string;
  nombre: string;
}

interface GeoRefMunicipio {
  id: string;
  nombre: string;
}

interface GeoRefUbicacion {
  provincia: GeoRefProvincia;
  departamento: GeoRefDepartamento;
  municipio?: GeoRefMunicipio;
}

interface GeoRefCalle {
  id: string;
  nombre: string;
  categoria?: string;
  nomenclatura?: string;
}

interface GeoRefUbicacionResponse {
  ubicacion: GeoRefUbicacion;
}

interface GeoRefCallesResponse {
  calles: GeoRefCalle[];
}

// Interfaces para coordenadas y ubicación
interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationData extends GeoRefUbicacion {
  nearbyStreets: GeoRefCalle[];
  coordinates: Coordinates;
  accuracy: number;
}

// Cliente GeoRef tipado
class GeoRefClient {
  async reverseGeocode(lat: number, lon: number): Promise<GeoRefUbicacion> {
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/ubicacion?lat=${lat}&lon=${lon}&campos=provincia,departamento,municipio`
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data: GeoRefUbicacionResponse = await response.json();
      return data.ubicacion;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`Error al consultar GeoRef: ${message}`);
    }
  }

  async findNearbyStreets(lat: number, lon: number, departmentId: string): Promise<GeoRefCalle[]> {
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/calles?departamento=${departmentId}&max=50`
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data: GeoRefCallesResponse = await response.json();
      return data.calles || [];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`Error al buscar calles: ${message}`);
    }
  }
}

const GeoRefLocationFinder: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Instancia del cliente GeoRef
  const georefClient = new GeoRefClient();

  // Función para obtener ubicación actual
  const getCurrentLocation = useCallback(async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es soportada por este navegador');
      return;
    }

    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // Cache por 1 minuto
    };

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setLocation({ lat: latitude, lon: longitude });
        setAccuracy(accuracy);
        
        try {
          // Georreferenciación reversa con GeoRef
          const geoData = await georefClient.reverseGeocode(latitude, longitude);
          
          // Buscar calles cercanas
          let nearbyStreets: GeoRefCalle[] = [];
          if (geoData.departamento?.id) {
            nearbyStreets = await georefClient.findNearbyStreets(
              latitude, 
              longitude, 
              geoData.departamento.id
            );
          }
          
          setLocationData({
            ...geoData,
            nearbyStreets: nearbyStreets.slice(0, 10), // Solo las primeras 10
            coordinates: { lat: latitude, lon: longitude },
            accuracy
          });
          
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error desconocido';
          setError(message);
        } finally {
          setLoading(false);
        }
      },
      (error: GeolocationPositionError) => {
        setLoading(false);
        let errorMessage = 'Error al obtener ubicación';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Habilítalo en tu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado al obtener ubicación.';
            break;
          default:
            errorMessage = `Error de geolocalización: ${error.message}`;
        }
        
        setError(errorMessage);
      },
      options
    );
  }, [georefClient]);

  // Función para seguimiento continuo
  const startWatching = useCallback((): void => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es soportada');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000
    };

    const id = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        setAccuracy(accuracy);
      },
      (error: GeolocationPositionError) => {
        console.error('Error en watchPosition:', error);
      },
      options
    );

    setWatchId(id);
  }, []);

  const stopWatching = useCallback((): void => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Funciones de utilidad
  const formatAccuracy = (acc: number | null): string => {
    if (!acc) return 'Desconocida';
    if (acc < 10) return `${Math.round(acc)}m (Muy precisa)`;
    if (acc < 50) return `${Math.round(acc)}m (Buena)`;
    if (acc < 100) return `${Math.round(acc)}m (Regular)`;
    return `${Math.round(acc)}m (Baja precisión)`;
  };

  const formatCoordinates = (lat: number, lon: number): string => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📍 ¿Dónde Estoy?
        </h1>
        <p className="text-gray-600">
          Encuentra tu ubicación actual y las calles cercanas usando GeoRef Argentina
        </p>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
            {loading ? 'Obteniendo ubicación...' : 'Obtener Mi Ubicación'}
          </button>

          {!watchId ? (
            <button
              onClick={startWatching}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Seguir Ubicación
            </button>
          ) : (
            <button
              onClick={stopWatching}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Clock className="w-5 h-5" />
              Detener Seguimiento
            </button>
          )}
        </div>

        {watchId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-medium">
              🟢 Seguimiento activo - Tu ubicación se actualiza automáticamente
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Coordenadas actuales */}
      {location && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Coordenadas Actuales</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Latitud:</strong> {location.lat.toFixed(6)}
            </div>
            <div>
              <strong>Longitud:</strong> {location.lon.toFixed(6)}
            </div>
            <div>
              <strong>Precisión:</strong> {formatAccuracy(accuracy)}
            </div>
            <div>
              <strong>Coordenadas:</strong> {formatCoordinates(location.lat, location.lon)}
            </div>
          </div>
        </div>
      )}

      {/* Información de ubicación */}
      {locationData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Tu Ubicación</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información administrativa */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Información Administrativa
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provincia:</span>
                  <span className="font-medium">{locationData.provincia?.nombre}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Departamento:</span>
                  <span className="font-medium">{locationData.departamento?.nombre}</span>
                </div>
                
                {locationData.municipio && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Municipio:</span>
                    <span className="font-medium">{locationData.municipio.nombre}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información técnica */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Información Técnica
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitud:</span>
                  <span className="font-mono">{locationData.coordinates.lat.toFixed(6)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitud:</span>
                  <span className="font-mono">{locationData.coordinates.lon.toFixed(6)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Precisión GPS:</span>
                  <span className="font-medium">{formatAccuracy(locationData.accuracy)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calles cercanas */}
      {locationData?.nearbyStreets && locationData.nearbyStreets.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🛣️ Calles en esta zona
            <span className="text-sm font-normal text-gray-500">
              ({locationData.departamento?.nombre})
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {locationData.nearbyStreets.map((street, index) => (
              <div
                key={street.id || index}
                className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">
                    {street.categoria || 'CALLE'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-800 font-medium">
                    {street.nombre}
                  </span>
                </div>
                {street.nomenclatura && (
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {street.nomenclatura}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            💡 <strong>Tip:</strong> Estas son algunas calles de tu departamento. 
            Para encontrar la calle exacta, puedes usar la función de direcciones de GeoRef.
          </div>
        </div>
      )}

      {/* Mapa embed (opcional) */}
      {location && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📍 Mapa de Ubicación
          </h3>
          
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lon-0.01},${location.lat-0.01},${location.lon+0.01},${location.lat+0.01}&layer=mapnik&marker=${location.lat},${location.lon}`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              title="Mapa de ubicación"
            />
          </div>
          
          <div className="mt-4 flex gap-4 justify-center">
            <a
              href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver en Google Maps
            </a>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver en OpenStreetMap
            </a>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      {!location && !loading && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            🚀 Cómo usar esta herramienta:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Haz clic en <strong>"Obtener Mi Ubicación"</strong> para obtener tu posición actual</li>
            <li>Permite el acceso a tu ubicación cuando el navegador lo solicite</li>
            <li>La aplicación consultará automáticamente la API GeoRef de Argentina</li>
            <li>Verás tu provincia, departamento, municipio y calles cercanas</li>
            <li>Usa <strong>"Seguir Ubicación"</strong> para actualizaciones automáticas mientras te mueves</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default GeoRefLocationFinder;