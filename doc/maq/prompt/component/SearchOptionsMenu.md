# Prompt para Componente `SearchOptionsMenu`

## **Descripción del Componente**

Crea un componente `SearchOptionsMenu` que presente diferentes métodos de búsqueda de propiedades de manera clara y atractiva. Debe guiar al usuario a seleccionar el tipo de búsqueda que mejor se adapte a sus necesidades, manteniendo la confianza profesional de la plataforma inmobiliaria.

## **Especificaciones de Diseño**

### **Layout y Estructura Principal**

- **Contenedor:** Centrado, max-width: 600px, padding responsivo
- **Header:** Título principal con subtítulo explicativo
- **Grid de opciones:** Layout flexible responsive (2 columnas en desktop, 1 en mobile)
- **Spacing:** Sistema de 24px entre cards, 32px entre secciones principales
- **Background:** Fondo neutro (`#F9FAFB`) para contenedor principal

### **Styling del Header**

```css
Header Container:
- text-align: center
- margin-bottom: 32px
- padding: 0 16px

Main Title:
- font-size: 24px (H2)
- font-weight: 600
- color: #111827
- line-height: 1.3
- margin-bottom: 8px

Subtitle:
- font-size: 16px (Body)
- font-weight: 400
- color: #4B5563
- line-height: 1.5
- max-width: 480px
- margin: 0 auto
```

### **Search Option Cards**

```css
Base Card:
- background: white
- border: 2px solid #E5E7EB
- border-radius: 12px
- padding: 24px
- cursor: pointer
- transition: all 0.2s ease
- min-height: 160px
- display: flex
- flex-direction: column
- align-items: center
- text-align: center

Hover State:
- border-color: #3B82F6
- box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15)
- transform: translateY(-2px)

Active/Selected State:
- border-color: #10B981
- background: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)
- box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2)

Disabled State:
- opacity: 0.6
- cursor: not-allowed
- border-color: #D1D5DB
```

### **Card Content Structure**

```jsx
<SearchOptionCard>
  <IconContainer>
    <OptionIcon />
    {isPopular && <PopularBadge />}
  </IconContainer>
  
  <CardContent>
    <OptionTitle />
    <OptionDescription />
    <FeaturesList />
  </CardContent>
  
  <CardFooter>
    <ActionHint />
    <DifficultyIndicator />
  </CardFooter>
</SearchOptionCard>
```

### **Iconografía y Visual Elements**

```css
Icon Container:
- width: 64px
- height: 64px
- background: linear-gradient(135deg, #3B82F6, #1E40AF)
- border-radius: 16px
- display: flex
- align-items: center
- justify-content: center
- margin-bottom: 16px
- position: relative

Icon:
- width: 32px
- height: 32px
- color: white
- stroke-width: 1.5

Popular Badge:
- position: absolute
- top: -8px
- right: -8px
- background: #F59E0B
- color: white
- font-size: 10px
- font-weight: 600
- padding: 2px 6px
- border-radius: 8px
- text-transform: uppercase
```

## **Funcionalidad Requerida**

### **Props Interface**

```typescript
interface SearchOptionsMenuProps {
  onOptionSelect: (option: SearchOption) => void;
  selectedOption?: SearchOptionType;
  availableOptions?: SearchOptionType[];
  showPopularIndicator?: boolean;
  showDifficulty?: boolean;
  allowMultipleSelection?: boolean;
  isLoading?: boolean;
  className?: string;
  onCustomSearch?: () => void;
}

interface SearchOption {
  id: SearchOptionType;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  difficulty: 'easy' | 'medium' | 'advanced';
  isPopular?: boolean;
  isRecommended?: boolean;
  estimatedTime: string;
  userType: UserType[];
}

type SearchOptionType = 
  | 'by-location'
  | 'by-budget'
  | 'by-features'
  | 'by-type'
  | 'ai-assisted'
  | 'map-search';

type UserType = 'first-time' | 'investor' | 'family' | 'professional';
```

### **Opciones de Búsqueda Predefinidas**

#### **Búsqueda por Ubicación**

```typescript
const locationSearch: SearchOption = {
  id: 'by-location',
  title: 'Por Ubicación',
  description: 'Encuentra propiedades en zonas específicas que te interesan',
  icon: MapPinIcon,
  features: [
    'Buscar por colonia o área',
    'Ver propiedades en el mapa',
    'Filtros de proximidad'
  ],
  difficulty: 'easy',
  isPopular: true,
  estimatedTime: '2-3 min',
  userType: ['first-time', 'family']
};
```

#### **Búsqueda por Presupuesto**

```typescript
const budgetSearch: SearchOption = {
  id: 'by-budget',
  title: 'Por Presupuesto',
  description: 'Define tu rango de inversión y encuentra opciones que se ajusten',
  icon: DollarSignIcon,
  features: [
    'Rango de precios personalizado',
    'Opciones de financiamiento',
    'Cálculo de pagos mensuales'
  ],
  difficulty: 'easy',
  isRecommended: true,
  estimatedTime: '3-4 min',
  userType: ['first-time', 'investor']
};
```

#### **Búsqueda por Características**

```typescript
const featuresSearch: SearchOption = {
  id: 'by-features',
  title: 'Por Características',
  description: 'Especifica amenidades y features que buscas en tu propiedad',
  icon: SlidersIcon,
  features: [
    'Número de habitaciones',
    'Amenidades específicas',
    'Condiciones de la propiedad'
  ],
  difficulty: 'medium',
  estimatedTime: '4-5 min',
  userType: ['family', 'professional']
};
```

#### **Búsqueda Asistida por IA**

```typescript
const aiAssistedSearch: SearchOption = {
  id: 'ai-assisted',
  title: 'Búsqueda Inteligente',
  description: 'Describe tu propiedad ideal y nuestra IA encontrará coincidencias',
  icon: SparklesIcon,
  features: [
    'Descripción en lenguaje natural',
    'Recomendaciones personalizadas',
    'Aprendizaje de preferencias'
  ],
  difficulty: 'easy',
  isPopular: true,
  estimatedTime: '1-2 min',
  userType: ['first-time', 'family', 'investor']
};
```

#### **Búsqueda en Mapa**

```typescript
const mapSearch: SearchOption = {
  id: 'map-search',
  title: 'Explorar en Mapa',
  description: 'Navega visualmente por las propiedades disponibles',
  icon: MapIcon,
  features: [
    'Vista satelital y calles',
    'Filtros visuales',
    'Información de la zona'
  ],
  difficulty: 'medium',
  estimatedTime: '5-10 min',
  userType: ['investor', 'professional']
};
```

#### **Búsqueda por Tipo**

```typescript
const typeSearch: SearchOption = {
  id: 'by-type',
  title: 'Por Tipo de Propiedad',
  description: 'Filtra por casas, departamentos, terrenos o comerciales',
  icon: HomeIcon,
  features: [
    'Categorías específicas',
    'Filtros por uso',
    'Opciones de inversión'
  ],
  difficulty: 'easy',
  estimatedTime: '2-3 min',
  userType: ['investor', 'professional']
};
```

## **Responsive Design**

### **Mobile (< 640px)**

```css
Container:
- padding: 16px
- max-width: 100%

Grid:
- grid-template-columns: 1fr
- gap: 16px

Cards:
- min-height: 140px
- padding: 20px

Icon Container:
- width: 56px
- height: 56px

Icon:
- width: 28px
- height: 28px

Title:
- font-size: 18px

Description:
- font-size: 14px
- line-height: 1.4
```

### **Tablet (640px - 1024px)**

```css
Container:
- padding: 24px
- max-width: 580px

Grid:
- grid-template-columns: repeat(2, 1fr)
- gap: 20px

Cards:
- min-height: 150px
- padding: 22px
```

### **Desktop (> 1024px)**

```css
Container:
- padding: 32px
- max-width: 600px

Grid:
- grid-template-columns: repeat(2, 1fr)
- gap: 24px

Cards:
- min-height: 160px
- padding: 24px

Hover Effects:
- Enhanced shadows
- Smooth transitions
- Scale effect on hover (1.02)
```

## **Implementación Técnica**

### **Estructura del Componente**

```jsx
const SearchOptionsMenu: React.FC<SearchOptionsMenuProps> = ({
  onOptionSelect,
  selectedOption,
  availableOptions = Object.keys(defaultOptions),
  showPopularIndicator = true,
  showDifficulty = true,
  isLoading = false,
  ...props
}) => {
  const [hoveredOption, setHoveredOption] = useState<SearchOptionType | null>(null);
  
  const filteredOptions = useMemo(() => 
    defaultOptions.filter(option => availableOptions.includes(option.id)),
    [availableOptions]
  );
  
  return (
    <div className="search-options-menu" {...props}>
      <MenuHeader />
      
      <SearchOptionsGrid
        options={filteredOptions}
        selectedOption={selectedOption}
        hoveredOption={hoveredOption}
        onOptionSelect={onOptionSelect}
        onOptionHover={setHoveredOption}
        showPopularIndicator={showPopularIndicator}
        showDifficulty={showDifficulty}
        isLoading={isLoading}
      />
      
      <MenuFooter onCustomSearch={onCustomSearch} />
    </div>
  );
};
```

### **SearchOptionCard Component**

```jsx
const SearchOptionCard: React.FC<SearchOptionCardProps> = ({
  option,
  isSelected,
  isHovered,
  onClick,
  onHover,
  showPopularIndicator,
  showDifficulty,
  isLoading
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(option);
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={cn(
        'search-option-card',
        {
          'selected': isSelected,
          'hovered': isHovered,
          'loading': isLoading
        }
      )}
      onClick={() => onClick(option)}
      onMouseEnter={() => onHover(option.id)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Seleccionar búsqueda ${option.title}`}
      aria-describedby={`option-${option.id}-description`}
    >
      <IconContainer 
        icon={option.icon}
        isPopular={option.isPopular && showPopularIndicator}
        isRecommended={option.isRecommended}
      />
      
      <CardContent 
        title={option.title}
        description={option.description}
        features={option.features}
        optionId={option.id}
      />
      
      <CardFooter 
        estimatedTime={option.estimatedTime}
        difficulty={option.difficulty}
        showDifficulty={showDifficulty}
      />
    </div>
  );
};
```

### **Animation Hooks**

```typescript
const useCardAnimation = (isSelected: boolean, isHovered: boolean) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isSelected || isHovered) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isSelected, isHovered]);
  
  return { isAnimating };
};

const useStaggeredAnimation = (options: SearchOption[]) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  
  useEffect(() => {
    options.forEach((_, index) => {
      setTimeout(() => {
        setVisibleIndexes(prev => [...prev, index]);
      }, index * 100);
    });
  }, [options]);
  
  return { visibleIndexes };
};
```

## **Accesibilidad**

### **ARIA Implementation**

```jsx
<div
  role="menu"
  aria-labelledby="search-options-title"
  aria-describedby="search-options-description"
>
  <h2 id="search-options-title">¿Cómo desea buscar su propiedad?</h2>
  <p id="search-options-description">
    Seleccione el método de búsqueda que mejor se adapte a sus necesidades
  </p>
  
  {options.map(option => (
    <div
      key={option.id}
      role="menuitem"
      aria-label={`${option.title}: ${option.description}`}
      aria-describedby={`option-${option.id}-features`}
      tabIndex={0}
    >
      {/* Card content */}
      <div id={`option-${option.id}-features`} className="sr-only">
        Características: {option.features.join(', ')}
      </div>
    </div>
  ))}
</div>
```

### **Keyboard Navigation**

- **Tab:** Navegar entre opciones
- **Enter/Space:** Seleccionar opción
- **Arrow Keys:** Navegación alternativa en grid
- **Escape:** Deseleccionar opción actual
- **Home/End:** Ir a primera/última opción

## **Estados y Animaciones**

### **Loading States**

```jsx
const LoadingCard: React.FC = () => (
  <div className="search-option-card loading">
    <Skeleton className="icon-skeleton" />
    <Skeleton className="title-skeleton" />
    <Skeleton className="description-skeleton" />
    <Skeleton className="features-skeleton" />
  </div>
);
```

### **Entrada Staggered**

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-option-card {
  animation: fadeInUp 0.3s ease-out both;
}

.search-option-card:nth-child(1) { animation-delay: 0ms; }
.search-option-card:nth-child(2) { animation-delay: 100ms; }
.search-option-card:nth-child(3) { animation-delay: 200ms; }
.search-option-card:nth-child(4) { animation-delay: 300ms; }
```

## **Testing Strategy**

### **Unit Tests**

- Renderizado de todas las opciones
- Selección de opciones
- Estados hover y focus
- Filtrado de opciones disponibles

### **Integration Tests**

- Flujo completo de selección
- Navegación con teclado
- Responsive behavior

### **A11y Tests**

- Screen reader compatibility
- Keyboard-only navigation
- Focus management
- Color contrast validation

## **Performance Optimizations**

### **Memoization**

```typescript
const SearchOptionsGrid = memo(({ options, ...props }) => {
  const memoizedOptions = useMemo(() => 
    options.map(option => ({
      ...option,
      // Pre-calculate any expensive operations
    })), 
    [options]
  );
  
  return (
    <div className="options-grid">
      {memoizedOptions.map(option => (
        <SearchOptionCard key={option.id} option={option} {...props} />
      ))}
    </div>
  );
});
```

### **Icon Optimization**

```typescript
// Preload icons para mejor performance
const preloadIcons = () => {
  defaultOptions.forEach(option => {
    const IconComponent = option.icon;
    // Preload icon component
  });
};
```

Este componente está diseñado para guiar efectivamente a los usuarios a través de las diferentes opciones de búsqueda de propiedades, manteniendo la confianza profesional y la usabilidad intuitiva características de monopolio.com.mx.
