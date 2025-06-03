"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Navigation, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LocationSelector = () => {
  const [currentCity, setCurrentCity] = useState('');
  const [desiredCity, setDesiredCity] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('');

  // Validar formulario cuando cambien los inputs
  React.useEffect(() => {
    setIsFormValid(currentCity.trim() !== '' && desiredCity.trim() !== '');
  }, [currentCity, desiredCity]);

  const handleCurrentCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCity(e.target.value);
  };

  const handleDesiredCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesiredCity(e.target.value);
  };

  const handleContinue = () => {
    if (isFormValid) {
      console.log('Ubicación actual:', currentCity);
      console.log('Ubicación deseada:', desiredCity);
      // Aquí iría la lógica para continuar
    }
  };

  // Función para obtener el nombre de la ciudad desde coordenadas
  const getCityFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Usando la API de Nominatim (OpenStreetMap) para geocodificación inversa
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener información de ubicación');
      }

      const data = await response.json();
      
      // Extraer ciudad, estado y país
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.municipality || '';
      const state = address.state || address.province || '';
      const country = address.country || '';
      
      // Construir el nombre completo de la ubicación
      let fullLocation = '';
      if (city) fullLocation += city;
      if (state && city) fullLocation += `, ${state}`;
      if (country) fullLocation += `, ${country}`;
      
      return fullLocation || 'Ubicación no identificada';
    } catch (error) {
      console.error('Error en geocodificación:', error);
      throw new Error('No se pudo determinar la ciudad');
    }
  };

  const handleLocationSearch = async () => {
    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      setLocationError('Su navegador no soporta geolocalización');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError('');
    setDetectedLocation('');

    try {
      // Solicitar permisos y obtener ubicación
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutos
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Coordenadas obtenidas:', { latitude, longitude });

      // Obtener el nombre de la ciudad
      const cityName = await getCityFromCoordinates(latitude, longitude);
      
      setDetectedLocation(cityName);
      setCurrentCity(cityName);
      
      console.log('Ubicación detectada:', cityName);
      
    } catch (error: any) {
      console.error('Error al obtener ubicación:', error);
      
      let errorMessage = '';
      
      if (error.code === 1) {
        errorMessage = 'Permisos de ubicación denegados. Por favor, active la ubicación y permita el acceso.';
      } else if (error.code === 2) {
        errorMessage = 'No se pudo determinar su ubicación. Verifique su conexión a internet.';
      } else if (error.code === 3) {
        errorMessage = 'Tiempo de espera agotado. Intente nuevamente.';
      } else {
        errorMessage = error.message || 'Error al obtener la ubicación';
      }
      
      setLocationError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-category-home-bg border border-category-home/20">
            <MapPin className="w-8 h-8 text-category-home" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Seleccione
        </h1>
        <p className="text-lg text-muted-foreground">
          las ciudades de su interés
        </p>
      </div>

      {/* Error Alert */}
      {locationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {locationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {detectedLocation && !locationError && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            ✓ Ubicación detectada: {detectedLocation}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Card */}
      <Card className="border-border shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-center text-card-foreground">
            Ubicaciones
          </CardTitle>
          <CardDescription className="text-center">
            Ingrese su ubicación actual y donde desea buscar propiedades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ciudad donde vive */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-category-home rounded-full"></div>
              <Label htmlFor="current-city" className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
                Ciudad donde vive
              </Label>
            </div>
            <Input
              id="current-city"
              type="text"
              placeholder="Ej: Buenos Aires, Ciudad de México..."
              value={currentCity}
              onChange={handleCurrentCityChange}
              className="h-12 text-lg bg-background/80 border-border focus:border-category-home focus:ring-category-home/30 transition-all"
            />
          </div>

          {/* Ciudad donde desea comprar */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-category-luxury rounded-full"></div>
              <Label htmlFor="desired-city" className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
                Ciudad donde desea comprar
              </Label>
            </div>
            <Input
              id="desired-city"
              type="text"
              placeholder="Ej: Madrid, Barcelona, Bogotá..."
              value={desiredCity}
              onChange={handleDesiredCityChange}
              className="h-12 text-lg bg-background/80 border-border focus:border-category-luxury focus:ring-category-luxury/30 transition-all"
            />
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button 
              onClick={handleContinue}
              disabled={!isFormValid}
              className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
                isFormValid 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              CONTINUAR
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search by Location */}
      <Card className="border-dashed border-2 border-border/50 hover:border-border transition-colors">
        <CardContent className="p-4">
          <Button 
            variant="ghost"
            onClick={handleLocationSearch}
            disabled={isLoadingLocation}
            className="w-full h-12 text-category-commercial hover:bg-category-commercial-bg hover:text-category-commercial transition-all duration-200 disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                DETECTANDO UBICACIÓN...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 mr-2" />
                BÚSQUEDA POR UBICACIÓN
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      {(currentCity || desiredCity) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {currentCity && (
            <Badge variant="secondary" className="text-xs py-1 px-3">
              <MapPin className="w-3 h-3 mr-1" />
              Vive en: {currentCity}
            </Badge>
          )}
          {desiredCity && (
            <Badge variant="secondary" className="text-xs py-1 px-3">
              <Search className="w-3 h-3 mr-1" />
              Busca en: {desiredCity}
            </Badge>
          )}
        </div>
      )}

      {/* Form Validation Indicator */}
      {isFormValid && (
        <div className="text-center">
          <Badge className="bg-success/10 text-success border-success/20">
            ✓ Formulario completo - Listo para continuar
          </Badge>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;