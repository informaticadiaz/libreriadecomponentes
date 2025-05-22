# Arquitectura UI - Aplicación de Búsqueda de Propiedades

## Estructura de Carpetas

```folder
src/
├── components/
│   ├── ui/                          # Componentes base (shadcn/ui)
│   ├── layout/
│   │   ├── Header/
│   │   ├── Navigation/
│   │   └── Container/
│   ├── forms/
│   │   ├── LoginForm/
│   │   ├── SearchForm/
│   │   └── ContactForm/
│   └── common/
│       ├── Button/
│       ├── Input/
│       └── Modal/
├── pages/
│   ├── auth/
│   │   └── Login/                   # Pantalla de inicio de sesión
│   ├── search/
│   │   ├── Landing/                 # Página principal de búsqueda
│   │   ├── Catalog/                 # Lista de propiedades
│   │   ├── Filters/                 # Filtros de búsqueda
│   │   └── LocationSearch/          # Búsqueda por ubicación
│   ├── property/
│   │   ├── Details/                 # Detalles de propiedad
│   │   ├── TechnicalSheet/          # Ficha técnica
│   │   ├── Gallery/                 # Galería de fotos/videos
│   │   └── PaymentOptions/          # Formas de pago
│   └── shared/
│       └── NotFound/
├── features/
│   ├── authentication/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── property-search/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── property-management/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/
│   ├── useAuth.ts
│   ├── useProperties.ts
│   └── useLocation.ts
├── services/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── properties.ts
│   │   └── locations.ts
│   └── storage/
├── types/
│   ├── auth.ts
│   ├── property.ts
│   └── common.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
└── styles/
    ├── globals.css
    └── components/
```

## Descripción de Interfaces

### 1. **Landing/Login (INICIO)**

**Ruta:** `/pages/auth/Login/`

- **Componentes principales:**
  - `LoginForm` - Formulario de autenticación
  - `LanguageSelector` - Selector de idioma
  - `UserTypeSelector` - Selector de tipo de usuario
- **Funcionalidades:**
  - Autenticación de usuarios
  - Selección de idioma
  - Recuperación de contraseña
  - Registro de nuevos usuarios

### 2. **Search Catalog (BUSCADOR/MENÚ CATÁLOGOS)**

**Ruta:** `/pages/search/Catalog/`

- **Componentes principales:**
  - `PropertyFilters` - Filtros de búsqueda (Casas/Departamentos)
  - `LocationFilter` - Filtro por ubicación
  - `PriceRangeFilter` - Filtro por rango de precios
- **Funcionalidades:**
  - Filtrado por tipo de propiedad
  - Filtrado por ubicación
  - Filtrado por precio
  - Búsqueda avanzada

### 3. **Location Search (BÚSQUEDA POR UBICACIÓN)**

**Ruta:** `/pages/search/LocationSearch/`

- **Componentes principales:**
  - `LocationSelector` - Selector de ciudad
  - `AreaSelector` - Selector de área específica
  - `ContinueButton` - Botón de continuar
- **Funcionalidades:**
  - Selección de ciudad donde vive
  - Selección de ciudad donde desea comprar
  - Navegación hacia catálogo filtrado

### 4. **Property Catalog (FILTROS DE CATÁLOGO)**

**Ruta:** `/pages/search/Filters/`

- **Componentes principales:**
  - `PropertyList` - Lista de propiedades disponibles
  - `PropertyCard` - Tarjeta individual de propiedad
  - `FilterSidebar` - Barra lateral de filtros
- **Funcionalidades:**
  - Listado de propiedades con filtros aplicados
  - Vista previa de propiedades
  - Filtros específicos por ubicación

### 5. **Property List (CATÁLOGO)**

**Ruta:** `/pages/property/List/`

- **Componentes principales:**
  - `PropertyGrid` - Grilla de propiedades
  - `PropertyPreview` - Vista previa de cada propiedad
  - `PaginationControls` - Controles de paginación
- **Funcionalidades:**
  - Vista de catálogo completo
  - Navegación entre páginas
  - Acceso rápido a detalles de propiedad

### 6. **Property Details (PROPIEDAD ITEM)**

**Ruta:** `/pages/property/Details/`

- **Componentes principales:**
  - `PropertyHeader` - Encabezado con información básica
  - `TechnicalSheetButton` - Acceso a ficha técnica
  - `PropertyActions` - Acciones disponibles (ver, contactar)
  - `PaymentOptionsButton` - Acceso a formas de pago
- **Funcionalidades:**
  - Vista detallada de la propiedad
  - Acceso a ficha técnica
  - Opciones de contacto y pago

### 7. **Technical Sheet (FICHA TÉCNICA)**

**Ruta:** `/pages/property/TechnicalSheet/`

- **Componentes principales:**
  - `RentalInfo` - Información de renta
  - `PropertySpecs` - Especificaciones técnicas
  - `LocationDetails` - Detalles de ubicación
- **Funcionalidades:**
  - Información detallada de rentas
  - Especificaciones técnicas completas
  - Mensualidad y plusvalía

### 8. **Property Gallery (VER PROPIEDAD DETALLE)**

**Ruta:** `/pages/property/Gallery/`

- **Componentes principales:**
  - `ImageGallery` - Galería de imágenes
  - `VideoPlayer` - Reproductor de videos
  - `VRViewer` - Visor de realidad aumentada/3D
  - `FloorPlans` - Planos de la propiedad
- **Funcionalidades:**
  - Galería multimedia completa
  - Videos promocionales
  - Experiencia de realidad aumentada
  - Visualización de planos

### 9. **Payment Options (FORMAS DE PAGO Y FINANCIACIÓN)**

**Ruta:** `/pages/property/PaymentOptions/`

- **Componentes principales:**
  - `PaymentMethodSelector` - Selector de métodos de pago
  - `FinancingCalculator` - Calculadora de financiamiento
  - `ContactForm` - Formulario de contacto
- **Funcionalidades:**
  - Diferentes opciones de pago
  - Cálculo de financiamiento
  - Contacto directo con asesores

## Componentes Reutilizables

### Core Components

- `Button` - Botones con diferentes variantes
- `Input` - Campos de entrada de datos
- `Select` - Selectores dropdown
- `Card` - Tarjetas de contenido
- `Modal` - Ventanas modales
- `Loading` - Indicadores de carga

### Layout Components

- `AppHeader` - Encabezado principal
- `Navigation` - Navegación entre secciones
- `Sidebar` - Barra lateral para filtros
- `Footer` - Pie de página

### Feature-Specific Components

- `PropertyCard` - Tarjeta de propiedad
- `FilterPanel` - Panel de filtros
- `SearchBar` - Barra de búsqueda
- `LocationPicker` - Selector de ubicación
- `PriceRange` - Selector de rango de precios

## Estado Global

### Context Providers

```typescript
// AuthContext - Manejo de autenticación
// PropertyContext - Estado de propiedades
// SearchContext - Estado de búsqueda y filtros
// UIContext - Estado de la interfaz (modales, loading, etc.)
```

### Custom Hooks

```typescript
// useAuth() - Manejo de autenticación
// useProperties() - Manejo de propiedades
// useSearch() - Manejo de búsqueda y filtros
// useLocation() - Manejo de ubicaciones
```

## Consideraciones Técnicas

### Responsive Design

- Mobile-first approach (pantallas mostradas son móviles)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Componentes adaptables para desktop

### Performance

- Lazy loading para imágenes y videos
- Paginación en listas de propiedades
- Caching de búsquedas frecuentes
- Optimización de imágenes

### Accesibilidad

- Navegación por teclado
- Lectores de pantalla
- Contraste adecuado
- Textos alternativos

### SEO

- Meta tags dinámicos
- URLs amigables
- Structured data para propiedades
- Sitemap dinámico

## Próximos Pasos

1. **Configuración inicial del proyecto**
2. **Implementación de componentes base**
3. **Desarrollo de las páginas principales**
4. **Integración con APIs**
5. **Testing y optimización**
6. **Deploy y monitoreo**
