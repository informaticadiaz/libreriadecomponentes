# Prompt para Componente `CitySelector`

## **Descripción del Componente**

Crea un componente `CitySelector` con dropdown inteligente para selección de ciudades en una plataforma inmobiliaria. Debe incluir búsqueda con autocomplete, ciudades populares, validación en tiempo real y soporte para selección múltiple según el contexto de uso.

## **Especificaciones de Diseño**

### **Layout y Estructura Principal**

- **Contenedor:** Position relative para dropdown positioning
- **Input principal:** Base styling siguiendo el sistema de diseño inmobiliario
- **Dropdown:** Floating panel con z-index apropiado, shadow elevada
- **Max height:** 320px para dropdown con scroll interno
- **Width:** 100% del contenedor padre, min-width: 280px

### **Styling del Input**

```css
Base State:
- border: 1px solid #D1D5DB
- padding: 12px 16px 12px 44px (espacio para ícono)
- border-radius: 8px
- font-size: 16px
- background: white
- placeholder: "Buscar ciudad..." color #9CA3AF

Focus State:
- border-color: #3B82F6
- box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
- outline: none

With Selection:
- padding-right: 40px (espacio para clear button)
- border-color: #10B981

Loading State:
- cursor: progress
- background con spinner sutil
```

### **Dropdown Panel**

```css
Container:
- background: white
- border: 1px solid #E5E7EB
- border-radius: 8px
- box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1)
- margin-top: 4px
- overflow: hidden

Sections:
- padding: 8px 0
- border-bottom: 1px solid #F3F4F6 (entre secciones)

Items:
- padding: 12px 16px
- cursor: pointer
- transition: background-color 0.15s ease

Item Hover:
- background: #F8FAFC

Item Selected:
- background: #EFF6FF
- border-left: 3px solid #3B82F6
- font-weight: 500
```

### **Iconografía**

- **Search icon:** Lucide MapPin (20px) en input, color `#6B7280`
- **Loading spinner:** Dentro del input, reemplaza search icon
- **Clear button:** X icon (16px) al final del input cuando hay selección
- **Dropdown arrow:** ChevronDown (16px) que rota en estado open
- **City icons:** Pequeños iconos distintivos por tipo de ciudad

## **Funcionalidad Requerida**

### **Props Interface**

```typescript
interface CitySelectorProps {
  value?: string | string[];
  onChange: (city: string | string[]) => void;
  onCityDetails?: (city: CityData) => void;
  placeholder?: string;
  multiple?: boolean;
  maxSelections?: number;
  popularCities?: string[];
  excludeCities?: string[];
  allowCustom?: boolean;
  showStateInfo?: boolean;
  filterByAvailability?: boolean;
  isLoading?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  'aria-label'?: string;
}

interface CityData {
  id: string;
  name: string;
  state: string;
  country: string;
  population?: number;
  propertyCount?: number;
  avgPrice?: number;
  coordinates?: { lat: number; lng: number };
  isPopular?: boolean;
  alias?: string[];
}
```

### **Estados del Componente**

```typescript
interface CitySelectorState {
  isOpen: boolean;
  searchQuery: string;
  suggestions: CityData[];
  selectedCities: CityData[];
  isLoading: boolean;
  error: string | null;
  highlightedIndex: number;
  hasTyped: boolean;
}
```

### **Funcionalidad de Búsqueda**

- **Autocomplete:** Búsqueda en tiempo real con debounce de 200ms
- **Fuzzy matching:** Tolerancia a errores tipográficos menores
- **Alias support:** Búsqueda por nombres alternativos ("DF" → "Ciudad de México")
- **State inclusion:** Mostrar estado/región para ciudades duplicadas
- **Minimum chars:** Iniciar búsqueda desde 2 caracteres

## **Secciones del Dropdown**

### **1. Ciudades Populares** (cuando no hay búsqueda)

```jsx
<DropdownSection title="Ciudades Populares" icon={TrendingUpIcon}>
  {popularCities.map(city => (
    <CityItem
      key={city.id}
      city={city}
      badge="Popular"
      showPropertyCount={true}
    />
  ))}
</DropdownSection>
```

### **2. Resultados de Búsqueda**

```jsx
<DropdownSection title={`${results.length} ciudades encontradas`}>
  {results.map((city, index) => (
    <CityItem
      key={city.id}
      city={city}
      highlighted={index === highlightedIndex}
      searchQuery={searchQuery}
      showStateInfo={showStateInfo}
    />
  ))}
</DropdownSection>
```

### **3. Ciudades Recientes** (si hay historial)

```jsx
<DropdownSection title="Búsquedas Recientes" icon={ClockIcon}>
  {recentCities.map(city => (
    <CityItem city={city} badge="Reciente" />
  ))}
</DropdownSection>
```

### **4. Footer de Acción**

```jsx
<DropdownFooter>
  {allowCustom && searchQuery && !exactMatch && (
    <CustomCityOption
      query={searchQuery}
      onClick={() => handleCustomCity(searchQuery)}
    />
  )}
  <PoweredByText>Powered by geocoding API</PoweredByText>
</DropdownFooter>
```

## **Componente CityItem**

### **Estructura**

```jsx
<div className="city-item">
  <div className="city-main">
    <span className="city-name">
      {highlightMatch(city.name, searchQuery)}
    </span>
    <span className="city-state">{city.state}</span>
    {badge && <Badge variant={badge} />}
  </div>
  
  {showPropertyCount && city.propertyCount && (
    <div className="city-meta">
      <span className="property-count">
        {formatNumber(city.propertyCount)} propiedades
      </span>
      {city.avgPrice && (
        <span className="avg-price">
          Promedio: {formatCurrency(city.avgPrice)}
        </span>
      )}
    </div>
  )}
</div>
```

### **Styling CityItem**

```css
.city-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 6px;
}

.city-main {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.city-name {
  font-weight: 500;
  color: #111827;
  font-size: 15px;
}

.city-state {
  font-size: 13px;
  color: #6B7280;
  background: #F3F4F6;
  padding: 2px 6px;
  border-radius: 4px;
}

.city-meta {
  text-align: right;
  font-size: 12px;
  color: #9CA3AF;
  line-height: 1.3;
}

.property-count {
  display: block;
  font-weight: 500;
  color: #10B981;
}
```

## **Responsive Design**

### **Mobile (< 640px)**

```css
Input:
- font-size: 16px (prevent zoom)
- padding: 16px 16px 16px 48px
- height: 48px (touch-friendly)

Dropdown:
- max-height: 60vh
- full-width
- position: fixed bottom for better UX

CityItem:
- padding: 16px
- larger touch targets
- stack city meta info
```

### **Tablet (640px - 1024px)**

```css
Dropdown:
- max-width: 400px
- position: absolute
- normal dropdown behavior

CityItem:
- maintain horizontal layout
- optimize spacing
```

### **Desktop (> 1024px)**

```css
Dropdown:
- max-width: 480px
- enhanced hover states
- keyboard navigation indicators

CityItem:
- rich information display
- hover previews
```

## **Implementación Técnica**

### **Hooks Principales**

```typescript
// Manejo de búsqueda con debounce
const useDebouncedSearch = (query: string, delay: number) => {
  // Implementation
};

// API calls para ciudades
const useCitySearch = (query: string) => {
  // React Query implementation
};

// Gestión del dropdown
const useDropdownPosition = (isOpen: boolean) => {
  // Positioning logic
};

// Keyboard navigation
const useKeyboardNavigation = (items: CityData[], onSelect: Function) => {
  // Arrow keys, Enter, Escape handling
};
```

### **API Integration**

```typescript
interface CitySearchAPI {
  searchCities: (query: string, options?: SearchOptions) => Promise<CityData[]>;
  getPopularCities: (limit?: number) => Promise<CityData[]>;
  getCityDetails: (cityId: string) => Promise<CityData>;
  validateCity: (cityName: string) => Promise<boolean>;
}

interface SearchOptions {
  limit?: number;
  includeState?: boolean;
  filterByPropertyAvailability?: boolean;
  excludeCities?: string[];
}
```

## **Funciones Utility**

### **Text Highlighting**

```typescript
const highlightMatch = (text: string, query: string): ReactNode => {
  // Highlight matching characters in search results
};

const fuzzyMatch = (text: string, query: string): number => {
  // Calculate similarity score for fuzzy matching
};
```

### **Formatters**

```typescript
const formatPropertyCount = (count: number): string => {
  // "1,234 propiedades" formatting
};

const formatCurrency = (amount: number): string => {
  // Mexican peso formatting
};

const formatCityDisplay = (city: CityData): string => {
  // "Ciudad de México, CDMX" formatting
};
```

## **Accesibilidad**

### **ARIA Implementation**

```jsx
<div
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-owns="city-listbox"
>
  <input
    aria-autocomplete="list"
    aria-activedescendant={highlightedIndex >= 0 ? `city-${highlightedIndex}` : undefined}
    aria-describedby="city-help city-error"
  />
</div>

<ul
  id="city-listbox"
  role="listbox"
  aria-label="Ciudades disponibles"
>
  {suggestions.map((city, index) => (
    <li
      id={`city-${index}`}
      role="option"
      aria-selected={isSelected(city)}
      aria-describedby={`city-${index}-details`}
    >
      {/* City content */}
    </li>
  ))}
</ul>
```

### **Keyboard Navigation**

- **Arrow Keys:** Navegación por opciones
- **Enter:** Seleccionar ciudad highlightada
- **Escape:** Cerrar dropdown
- **Tab:** Salir del componente
- **Backspace:** Remover última selección (modo múltiple)

## **Performance Optimizations**

### **Virtualization**

```typescript
// Para listas grandes de ciudades
const VirtualizedCityList = ({ cities, itemHeight = 56 }) => {
  // React Window implementation
};
```

### **Caching**

```typescript
// Cache de búsquedas recientes
const searchCache = new Map<string, CityData[]>();

// Cache de ciudades populares
const popularCitiesCache = useMemo(() => getPopularCities(), []);
```

### **Debouncing**

```typescript
// Optimización de API calls
const debouncedSearch = useDebouncedCallback(searchCities, 200);

// Local storage para ciudades recientes
const debouncedSaveRecent = useDebouncedCallback(saveRecentCities, 500);
```

## **Testing Strategy**

### **Unit Tests**

- City search functionality
- Selection/deselection logic
- Keyboard navigation
- API integration mocking

### **Integration Tests**

- Complete city selection flow
- Multiple selection scenarios
- Error handling paths

### **A11y Tests**

- Screen reader compatibility
- Keyboard-only navigation
- Focus management
- ARIA attributes validation

Este componente está diseñado para proporcionar una experiencia de selección de ciudades profesional y fluida que se alinee con los estándares de calidad de monopolio.com.mx, facilitando la búsqueda y selección de ubicaciones para usuarios inmobiliarios.
