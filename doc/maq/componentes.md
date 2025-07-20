# Componentes

Basándome en el flujo mostrado en la imagen, aquí están los **componentes específicos** que necesitarías desarrollar:

## **Componentes de Onboarding y Autenticación**

- `WelcomeScreen` - Pantalla inicial de bienvenida
- `UserRegistrationForm` - Formulario de datos del usuario
- `CitySelector` - Selector de ciudad con dropdown
- `LocationPicker` - Selección entre Puerto Vallarta/Bahía de Banderas
- `QuickConfirmation` - Pantalla "¡Bien rápido!" con confirmación

## **Componentes de Búsqueda y Filtros**

- `SearchOptionsMenu` - "¿Cómo desea buscar su propiedad?"
- `SearchMethodCard` - Tarjetas de métodos de búsqueda
- `PropertySearchBar` - Barra de búsqueda principal
- `FilterPanel` - Panel lateral de filtros avanzados
- `FilterChips` - Chips de filtros activos
- `SortingDropdown` - Opciones de ordenamiento

## **Componentes de Catálogo**

- `PropertyCatalogGrid` - Vista en grid del catálogo
- `PropertyCard` - Tarjeta individual de propiedad
- `PropertyQuickView` - Vista rápida emergente de propiedad
- `PropertyImageCarousel` - Carrusel de imágenes
- `PropertyPriceTag` - Etiqueta de precio
- `PropertyFeaturesList` - Lista de características

## **Componentes de Navegación y Layout**

- `BottomTabNavigation` - Navegación inferior (visible en pantallas finales)
- `TopHeader` - Header superior con título
- `BackButton` - Botón de regreso
- `ProgressIndicator` - Indicador de progreso en el flujo
- `BreadcrumbNavigation` - Navegación de migas de pan

## **Componentes de Mapas y Geolocalización**

- `InteractiveMap` - Mapa principal con propiedades
- `PropertyMarker` - Marcadores de propiedades en mapa
- `MapControls` - Controles de zoom y navegación
- `LocationToggle` - Alternador entre vista lista/mapa
- `MapFilterOverlay` - Overlay de filtros sobre el mapa

## **Componentes de Vistas Específicas**

- `PropertyListView` - Vista de lista detallada (pantallas finales)
- `PropertyGridView` - Vista en grid compacta
- `CategoryTabs` - Tabs de "Vista Principal", "Vista por Características", etc.
- `PropertyDetailSheet` - Hoja deslizable con detalles completos
- `ContactActionSheet` - Sheet de acciones de contacto

## **Componentes de Estado y Feedback**

- `LoadingPropertyCard` - Skeleton de tarjeta de propiedad
- `EmptyStateMessage` - Mensaje cuando no hay resultados
- `ErrorBoundaryFallback` - Fallback para errores
- `SuccessToast` - Notificación de éxito
- `ConnectionStatus` - Indicador de estado de conexión

## **Componentes de Entrada de Usuario**

- `NumericInput` - Input para precios/rangos
- `LocationInput` - Input con autocompletado de ubicaciones
- `DateRangePicker` - Selector de rango de fechas
- `MultiSelectDropdown` - Dropdown de selección múltiple
- `SliderRange` - Slider para rangos (precio, área, etc.)
