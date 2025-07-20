# Prompt para Componente `LocationPicker`

## **Descripción del Componente**

Crea un componente `LocationPicker` específico para seleccionar entre Puerto Vallarta y Bahía de Banderas. Debe presentar ambas opciones como cards atractivas con información relevante del mercado inmobiliario, estadísticas clave y elementos visuales que ayuden al usuario a tomar una decisión informada.

## **Especificaciones de Diseño**

### **Layout y Estructura Principal**

- **Contenedor:** Flex layout responsive (column en mobile, row en desktop)
- **Título principal:** "¿En qué zona buscas propiedades?" (H2, 24px, font-weight: 600)
- **Subtítulo:** "Selecciona la ubicación de tu interés para ver propiedades disponibles"
- **Cards:** Dos opciones principales con información detallada
- **Spacing:** 24px entre cards en desktop, 16px en mobile

### **Design de Location Cards**

```css
Base Card:
- background: white
- border: 2px solid #E5E7EB
- border-radius: 12px
- padding: 24px
- cursor: pointer
- transition: all 0.2s ease
- min-height: 280px (desktop)

Hover State:
- border-color: #3B82F6
- box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15)
- transform: translateY(-2px)

Selected State:
- border-color: #10B981
- background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)
- box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2)

Disabled/Loading State:
- opacity: 0.6
- cursor: not-allowed
- border-color: #D1D5DB
```

### **Contenido de Cards**

#### **Header Section**

```jsx
<CardHeader>
  <LocationImage src={locationImage} alt={locationName} />
  <div className="location-title">
    <h3 className="location-name">{locationName}</h3>
    <span className="location-region">{regionInfo}</span>
    {isPopular && <Badge variant="popular">Más buscado</Badge>}
  </div>
  <SelectionIndicator selected={isSelected} />
</CardHeader>
```

#### **Stats Section**

```jsx
<StatsGrid>
  <StatItem 
    icon={HomeIcon}
    label="Propiedades"
    value={formatNumber(propertyCount)}
    trend={propertyTrend}
  />
  <StatItem 
    icon={DollarSignIcon}
    label="Precio promedio"
    value={formatCurrency(avgPrice)}
    subtitle="por m²"
  />
  <StatItem 
    icon={TrendingUpIcon}
    label="Plusvalía"
    value={`+${appreciationRate}%`}
    subtitle="último año"
  />
  <StatItem 
    icon={MapPinIcon}
    label="Zonas activas"
    value={activeZones}
    subtitle="disponibles"
  />
</StatsGrid>
```

#### **Features Section**

```jsx
<FeaturesList>
  {keyFeatures.map(feature => (
    <FeatureItem key={feature.id}>
      <FeatureIcon icon={feature.icon} />
      <FeatureText>{feature.text}</FeatureText>
    </FeatureItem>
  ))}
</FeaturesList>
```

## **Funcionalidad Requerida**

### **Props Interface**

```typescript
interface LocationPickerProps {
  value?: LocationOption;
  onChange: (location: LocationOption) => void;
  onLocationDetails?: (location: LocationData) => void;
  showPropertyCount?: boolean;
  showPriceInfo?: boolean;
  showTrends?: boolean;
  allowDeselection?: boolean;
  isLoading?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

interface LocationOption {
  id: 'puerto-vallarta' | 'bahia-banderas';
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
}

interface LocationData {
  id: string;
  name: string;
  displayName: string;
  region: string;
  state: string;
  image: string;
  description: string;
  stats: LocationStats;
  features: LocationFeature[];
  popularAreas: string[];
  isPopular: boolean;
}

interface LocationStats {
  propertyCount: number;
  avgPricePerM2: number;
  appreciationRate: number;
  activeZones: number;
  avgRentYield: number;
  popularPropertyTypes: string[];
  priceRange: { min: number; max: number };
  lastUpdated: Date;
}

interface LocationFeature {
  id: string;
  icon: IconType;
  text: string;
  category: 'lifestyle' | 'investment' | 'infrastructure' | 'amenities';
}
```

### **Data Específica por Ubicación**

#### **Puerto Vallarta**

```typescript
const puertoVallartaData: LocationData = {
  id: 'puerto-vallarta',
  name: 'Puerto Vallarta',
  displayName: 'Puerto Vallarta',
  region: 'Jalisco',
  state: 'Jalisco',
  image: '/images/puerto-vallarta.jpg',
  description: 'Destino turístico internacional con gran potencial de inversión',
  isPopular: true,
  stats: {
    propertyCount: 1250,
    avgPricePerM2: 25000,
    appreciationRate: 8.5,
    activeZones: 12,
    avgRentYield: 6.2,
    popularPropertyTypes: ['Condominios', 'Casas de playa', 'Departamentos'],
    priceRange: { min: 1500000, max: 15000000 }
  },
  features: [
    { id: 'beach', icon: 'Waves', text: 'Acceso directo a playa', category: 'lifestyle' },
    { id: 'airport', icon: 'Plane', text: 'Aeropuerto internacional', category: 'infrastructure' },
    { id: 'tourism', icon: 'Camera', text: 'Alta demanda turística', category: 'investment' },
    { id: 'marina', icon: 'Anchor', text: 'Marina de clase mundial', category: 'amenities' }
  ],
  popularAreas: ['Zona Romántica', 'Marina Vallarta', 'Versalles', 'Centro']
};
```

#### **Bahía de Banderas**

```typescript
const bahiaBanderasData: LocationData = {
  id: 'bahia-banderas',
  name: 'Bahía de Banderas',
  displayName: 'Bahía de Banderas',
  region: 'Riviera Nayarit',
  state: 'Nayarit',
  image: '/images/bahia-banderas.jpg',
  description: 'Zona emergente con gran crecimiento y oportunidades de inversión',
  isPopular: false,
  stats: {
    propertyCount: 890,
    avgPricePerM2: 18500,
    appreciationRate: 12.3,
    activeZones: 8,
    avgRentYield: 7.1,
    popularPropertyTypes: ['Desarrollos nuevos', 'Casas', 'Terrenos'],
    priceRange: { min: 1200000, max: 12000000 }
  },
  features: [
    { id: 'growth', icon: 'TrendingUp', text: 'Mayor crecimiento de la región', category: 'investment' },
    { id: 'nature', icon: 'TreePine', text: 'Entorno natural preservado', category: 'lifestyle' },
    { id: 'new-dev', icon: 'Building', text: 'Desarrollos de lujo nuevos', category: 'amenities' },
    { id: 'value', icon: 'DollarSign', text: 'Mejor relación precio-valor', category: 'investment' }
  ],
  popularAreas: ['Nuevo Vallarta', 'Flamingos', 'Bucerías', 'La Cruz de Huanacaxtle']
};
```

## **Styling de Componentes**

### **LocationCard Styling**

```css
.location-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 420px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.location-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #E5E7EB;
}

.location-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.location-region {
  font-size: 14px;
  color: #6B7280;
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.selection-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  border: 2px solid #D1D5DB;
  border-radius: 50%;
  background: white;
  transition: all 0.2s ease;
}

.selection-indicator.selected {
  border-color: #10B981;
  background: #10B981;
}

.selection-indicator.selected::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### **Stats Grid Styling**

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.stat-icon {
  width: 20px;
  height: 20px;
  color: #3B82F6;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.2;
}

.stat-subtitle {
  font-size: 11px;
  color: #9CA3AF;
  line-height: 1.2;
}
```

### **Features List Styling**

```css
.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: #10B981;
  flex-shrink: 0;
}

.feature-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.3;
}
```

## **Responsive Design**

### **Mobile (< 640px)**

```css
.location-picker {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.location-card {
  max-width: none;
  min-height: 240px;
}

.stats-grid {
  grid-template-columns: 1fr;
  gap: 12px;
}

.card-header {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.location-image {
  width: 100%;
  height: 120px;
  align-self: stretch;
}
```

### **Tablet (640px - 1024px)**

```css
.location-picker {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.stats-grid {
  grid-template-columns: repeat(2, 1fr);
}
```

### **Desktop (> 1024px)**

```css
.location-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
}

.location-card {
  min-height: 320px;
}

.stats-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
```

## **Implementación Técnica**

### **Estructura del Componente**

```jsx
const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  showPropertyCount = true,
  showPriceInfo = true,
  showTrends = true,
  isLoading = false,
  ...props
}) => {
  const locations = [puertoVallartaData, bahiaBanderasData];
  
  return (
    <div className="location-picker" {...props}>
      <PickerHeader />
      
      <div className="locations-grid">
        {locations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            isSelected={value?.id === location.id}
            onClick={() => onChange(location)}
            showPropertyCount={showPropertyCount}
            showPriceInfo={showPriceInfo}
            showTrends={showTrends}
            isLoading={isLoading}
          />
        ))}
      </div>
      
      {value && <SelectedLocationSummary location={value} />}
    </div>
  );
};
```

### **LocationCard Component**

```jsx
const LocationCard: React.FC<LocationCardProps> = ({
  location,
  isSelected,
  onClick,
  showPropertyCount,
  showPriceInfo,
  showTrends,
  isLoading
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(location);
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={cn('location-card', { selected: isSelected })}
      onClick={() => onClick(location)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Seleccionar ${location.name}`}
    >
      <CardHeader location={location} isSelected={isSelected} />
      <StatsGrid location={location} show={{ propertyCount, priceInfo, trends }} />
      <FeaturesList features={location.features.slice(0, 4)} />
    </div>
  );
};
```

### **Animation y Transitions**

```typescript
const useCardAnimation = (isSelected: boolean) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isSelected) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isSelected]);
  
  return { isAnimating };
};
```

## **Accesibilidad**

### **ARIA Implementation**

```jsx
<div
  role="radiogroup"
  aria-labelledby="location-picker-title"
  aria-describedby="location-picker-description"
>
  <h2 id="location-picker-title">¿En qué zona buscas propiedades?</h2>
  <p id="location-picker-description">
    Selecciona la ubicación de tu interés para ver propiedades disponibles
  </p>
  
  {locations.map(location => (
    <div
      key={location.id}
      role="radio"
      aria-checked={value?.id === location.id}
      aria-labelledby={`location-${location.id}-title`}
      aria-describedby={`location-${location.id}-stats`}
      tabIndex={value?.id === location.id ? 0 : -1}
    >
      {/* Card content */}
    </div>
  ))}
</div>
```

### **Keyboard Navigation**

- **Tab:** Navegar entre cards
- **Enter/Space:** Seleccionar ubicación
- **Arrow Keys:** Navegación alternativa entre opciones
- **Focus visible:** Ring azul claro alrededor de la card enfocada

## **Performance Optimizations**

### **Image Optimization**

```typescript
const LocationImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="location-image"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
    />
  );
};
```

### **Data Fetching**

```typescript
const useLocationStats = (locationId: string) => {
  return useQuery({
    queryKey: ['location-stats', locationId],
    queryFn: () => fetchLocationStats(locationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });
};
```

## **Testing Strategy**

### **Unit Tests**

- Selection functionality
- Keyboard navigation
- Data display accuracy
- Responsive behavior

### **Integration Tests**

- Complete location selection flow
- API integration for real-time stats
- Error handling scenarios

### **A11y Tests**

- Screen reader compatibility
- Keyboard-only navigation
- Focus management
- Color contrast validation

Este componente está diseñado para proporcionar una experiencia de selección de ubicación profesional y informativa que ayude a los usuarios a tomar decisiones inmobiliarias informadas entre Puerto Vallarta y Bahía de Banderas, manteniendo los estándares de calidad de monopolio.com.mx.
