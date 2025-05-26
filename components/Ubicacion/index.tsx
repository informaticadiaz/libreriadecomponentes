"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Navigation, ChevronRight } from 'lucide-react';

const LocationSelector = () => {
  const [currentCity, setCurrentCity] = useState('');
  const [desiredCity, setDesiredCity] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleLocationSearch = () => {
    console.log('Buscar por ubicación');
    // Aquí iría la lógica para búsqueda por ubicación
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
            className="w-full h-12 text-category-commercial hover:bg-category-commercial-bg hover:text-category-commercial transition-all duration-200"
          >
            <Navigation className="w-5 h-5 mr-2" />
            BÚSQUEDA POR UBICACIÓN
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