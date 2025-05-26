"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Home, Building2, MapPin, ChevronRight } from 'lucide-react';

// Definir tipos específicos
type PriceRangeKey = 'nuevos_min' | 'nuevos_max' | 'lujo_min';

interface PriceRanges {
  nuevos_min: string;
  nuevos_max: string;
  lujo_min: string;
}

const CatalogSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRanges, setPriceRanges] = useState<PriceRanges>({
    nuevos_min: '',
    nuevos_max: '',
    lujo_min: ''
  });

  const categories = [
    {
      id: 'nuevos',
      title: "Casas y Departamentos Nuevos",
      description: "Propiedades recién construidas con garantía",
      icon: <Home className="w-6 h-6" />,
      color: "border-border hover:border-category-home hover:bg-category-home-bg transition-all duration-200",
      selectedColor: "border-category-home bg-category-home-bg shadow-lg",
      accentColor: "text-category-home",
      bgAccent: "bg-category-home",
      fields: [
        { key: 'nuevos_min' as PriceRangeKey, label: 'Precio mínimo', placeholder: '$0' },
        { key: 'nuevos_max' as PriceRangeKey, label: 'Precio máximo', placeholder: '$999,999' }
      ]
    },
    {
      id: 'lujo',
      title: "Casas y Departamentos de Lujo",
      description: "Propiedades premium con acabados exclusivos",
      icon: <Building2 className="w-6 h-6" />,
      color: "border-border hover:border-category-luxury hover:bg-category-luxury-bg transition-all duration-200",
      selectedColor: "border-category-luxury bg-category-luxury-bg shadow-lg",
      accentColor: "text-category-luxury",
      bgAccent: "bg-category-luxury",
      fields: [
        { key: 'lujo_min' as PriceRangeKey, label: 'Precio desde', placeholder: '$500,000' }
      ]
    },
    {
      id: 'comercial',
      title: "Propiedades Comerciales",
      description: "Oficinas, locales, naves industriales y terrenos",
      icon: <MapPin className="w-6 h-6" />,
      color: "border-border hover:border-category-commercial hover:bg-category-commercial-bg transition-all duration-200",
      selectedColor: "border-category-commercial bg-category-commercial-bg shadow-lg",
      accentColor: "text-category-commercial",
      bgAccent: "bg-category-commercial",
      fields: []
    }
  ];

  const handlePriceChange = (key: PriceRangeKey, value: string) => {
    setPriceRanges(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Seleccione el Catálogo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore nuestra selección de propiedades organizadas por categoría
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedCategory === category.id 
                ? category.selectedColor + ' shadow-md'
                : category.color
            }`}
          >
            <div onClick={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id 
                      ? 'bg-card border border-border shadow-sm' 
                      : 'bg-muted/30'
                  }`}>
                    <div className={selectedCategory === category.id ? category.accentColor : 'text-muted-foreground'}>
                      {category.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform text-muted-foreground ${
                    selectedCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardContent>
            </div>

            {/* Expanded Content - Price Range Inputs */}
            {selectedCategory === category.id && category.fields.length > 0 && (
              <CardContent className="pt-0 border-t border-border/30 mt-4">
                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${category.bgAccent}`}></div>
                    <span className="text-sm font-medium text-card-foreground/90">
                      Configurar rango de precios
                    </span>
                  </div>
                  
                  <div className="grid gap-4">
                    {category.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium text-card-foreground/80">
                          {field.label}
                        </Label>
                        <Input
                          id={field.key}
                          type="text"
                          placeholder={field.placeholder}
                          value={priceRanges[field.key]}
                          onChange={(e) => handlePriceChange(field.key, e.target.value)}
                          className="h-11 bg-background/80 border-border focus:border-ring focus:ring-ring/30 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Buscar en Catálogos
        </Button>
        
        <Button 
          size="lg"
          className="flex items-center gap-2"
          disabled={!selectedCategory}
        >
          Ver Catálogo Seleccionado
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Selected Category Badge */}
      {selectedCategory && selectedCategoryData && (
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-sm py-2 px-4">
            Categoría seleccionada: {selectedCategoryData.title}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CatalogSelector;