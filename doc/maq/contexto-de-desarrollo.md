# Contexto de Desarrollo - Plataforma Inmobiliaria Mobile

## **Información del Proyecto**

### **Descripción General**

Desarrollo de componentes React/Next.js para una aplicación móvil inmobiliaria inspirada en **monopolio.com.mx**. La plataforma utiliza IA para democratizar información compleja del mercado inmobiliario mexicano, enfocándose en Puerto Vallarta y Bahía de Banderas.

### **Recursos de Referencia**

- **URL Principal:** [https://monopolio.com.mx/](https://monopolio.com.mx/)
- **Imagen de Flujo:** Diagrama móvil con 10+ pantallas mostrando el user journey completo
- **Plataforma Objetivo:** Aplicación móvil-first con comportamiento responsive

### **Stack Tecnológico**

- **Framework:** Next.js con React
- **Styling:** Tailwind CSS siguiendo sistema de diseño custom
- **Componentes:** Biblioteca propia basada en shadcn/ui patterns
- **Iconografía:** Lucide React
- **Tipografía:** Inter font family

---

## **Filosofía de Diseño**

### **Principios Fundamentales**

1. **Confianza y Profesionalismo:** Transmitir solidez y expertise técnico para decisiones de alto valor
2. **Accesibilidad de Datos:** Hacer información compleja del mercado inmobiliario simple y comprensible
3. **Mobile-First:** Experiencia optimizada para dispositivos móviles con progressive enhancement

### **Paleta de Colores Establecida**

```css
/* Colores Primarios */
--blue-corporate: #1E40AF;  /* CTAs primarios, headers */
--blue-light: #3B82F6;      /* Hover states, links */
--blue-soft: #EFF6FF;       /* Fondos cards, focus states */

/* Colores Secundarios */
--green-money: #10B981;     /* Precios, valores positivos */
--green-light: #D1FAE5;     /* Alertas positivas */

/* Estados */
--orange-attention: #F59E0B; /* Advertencias */
--red-critical: #EF4444;     /* Errores */
--gray-neutral: #6B7280;     /* Texto secundario */

/* Escala de Grises */
--text-primary: #111827;
--text-secondary: #4B5563;
--borders: #E5E7EB;
--backgrounds: #F9FAFB;
```

### **Sistema Tipográfico**

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Jerarquía */
H1: 32px, weight: 700, line-height: 1.2
H2: 24px, weight: 600, line-height: 1.3
H3: 20px, weight: 600, line-height: 1.4
Body: 16px, weight: 400, line-height: 1.5
Small: 14px, weight: 400, line-height: 1.4
Caption: 12px, weight: 500, line-height: 1.3
```

### **Sistema de Espaciado**

Basado en múltiplos de 4px:

- **Micro:** 4px, 8px
- **Pequeño:** 12px, 16px
- **Medio:** 20px, 24px
- **Grande:** 32px, 40px
- **Extra Grande:** 48px, 64px

---

## **Arquitectura de Componentes**

### **Estructura por Categorías**

#### **Onboarding y Autenticación**

- `WelcomeScreen` ✅ **PROMPT CREADO**
- `UserRegistrationForm` ✅ **PROMPT CREADO**
- `CitySelector` ✅ **PROMPT CREADO**
- `LocationPicker` ✅ **PROMPT CREADO**
- `QuickConfirmation` ✅ **PROMPT CREADO**

#### **Búsqueda y Filtros**

- `SearchOptionsMenu` ✅ **PROMPT CREADO**
- `SearchMethodCard` ⏳ **PENDIENTE**
- `PropertySearchBar` ⏳ **PENDIENTE**
- `FilterPanel` ⏳ **PENDIENTE**
- `FilterChips` ⏳ **PENDIENTE**
- `SortingDropdown` ⏳ **PENDIENTE**

#### **Catálogo y Propiedades**

- `PropertyCatalogGrid` ⏳ **PENDIENTE**
- `PropertyCard` ⏳ **PENDIENTE**
- `PropertyQuickView` ⏳ **PENDIENTE**
- `PropertyImageCarousel` ⏳ **PENDIENTE**
- `PropertyPriceTag` ⏳ **PENDIENTE**
- `PropertyFeaturesList` ⏳ **PENDIENTE**

#### **Navegación y Layout**

- `BottomTabNavigation` ⏳ **PENDIENTE**
- `TopHeader` ⏳ **PENDIENTE**
- `BackButton` ⏳ **PENDIENTE**
- `ProgressIndicator` ⏳ **PENDIENTE**
- `BreadcrumbNavigation` ⏳ **PENDIENTE**

#### **Mapas y Geolocalización**

- `InteractiveMap` ⏳ **PENDIENTE**
- `PropertyMarker` ⏳ **PENDIENTE**
- `MapControls` ⏳ **PENDIENTE**
- `LocationToggle` ⏳ **PENDIENTE**
- `MapFilterOverlay` ⏳ **PENDIENTE**

#### **Vistas Específicas**

- `PropertyListView` ⏳ **PENDIENTE**
- `PropertyGridView` ⏳ **PENDIENTE**
- `CategoryTabs` ⏳ **PENDIENTE**
- `PropertyDetailSheet` ⏳ **PENDIENTE**
- `ContactActionSheet` ⏳ **PENDIENTE**

#### **Estado y Feedback**

- `LoadingPropertyCard` ⏳ **PENDIENTE**
- `EmptyStateMessage` ⏳ **PENDIENTE**
- `ErrorBoundaryFallback` ⏳ **PENDIENTE**
- `SuccessToast` ⏳ **PENDIENTE**
- `ConnectionStatus` ⏳ **PENDIENTE**

#### **Entrada de Usuario**

- `NumericInput` ⏳ **PENDIENTE**
- `LocationInput` ⏳ **PENDIENTE**
- `DateRangePicker` ⏳ **PENDIENTE**
- `MultiSelectDropdown` ⏳ **PENDIENTE**
- `SliderRange` ⏳ **PENDIENTE**

---

## **Prompts Completados**

### **1. WelcomeScreen**

Pantalla inicial de bienvenida con:

- Fondo degradado azul corporativo
- Logo/branding centrado
- CTAs principales (Comenzar/Ya tengo cuenta)
- Responsive design móvil-first
- Animaciones de entrada suaves

### **2. UserRegistrationForm**

Formulario de registro completo con:

- Validación en tiempo real
- Campos organizados por secciones
- Estados de error/éxito
- Responsive layouts
- Accesibilidad completa

### **3. CitySelector**

Selector con dropdown inteligente:

- Autocomplete con fuzzy matching
- Ciudades populares/recientes
- API integration para búsqueda
- Virtualización para listas grandes
- Keyboard navigation

### **4. LocationPicker**

Selección específica Puerto Vallarta/Bahía de Banderas:

- Cards informativas con estadísticas
- Datos del mercado inmobiliario
- Features específicas por ubicación
- Diseño comparativo
- Animaciones de selección

### **5. QuickConfirmation**

Pantalla de confirmación exitosa:

- Feedback visual con animaciones
- Auto-advance opcional
- Progress indicators
- Variantes según contexto
- Manejo de estados

### **6. SearchOptionsMenu**

Menú de opciones de búsqueda:

- Cards interactivas por método
- Iconografía específica
- Indicadores de dificultad/popularidad
- Grid responsive
- Staggered animations

---

## **Patrones de Desarrollo Establecidos**

### **Estructura de Props Interface**

```typescript
interface ComponentProps {
  // Props principales
  value?: T;
  onChange: (value: T) => void;
  
  // Configuración
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  
  // Estados
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
  
  // Styling
  className?: string;
  
  // Callbacks
  onFocus?: () => void;
  onBlur?: () => void;
}
```

### **Estados Comunes**

```typescript
interface ComponentState {
  isVisible: boolean;
  isAnimating: boolean;
  isLoading: boolean;
  error: string | null;
  hasInteracted: boolean;
}
```

### **Responsive Breakpoints**

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */
```

### **Accesibilidad Standards**

- ARIA labels y descriptions
- Keyboard navigation completa
- Focus management
- Screen reader compatibility
- Color contrast WCAG AA+

---

## **Instrucciones para Continuar**

### **Al Retomar el Desarrollo:**

1. **Revisar contexto completo:** Leer este archivo, consultar monopolio.com.mx y la imagen de flujo
2. **Verificar stack tecnológico:** Confirmar Next.js + Tailwind CSS + Lucide React
3. **Seguir patrones establecidos:** Usar las interfaces de props y estados definidos
4. **Mantener sistema de diseño:** Adherirse a la paleta de colores y tipografía
5. **Priorizar responsive design:** Mobile-first approach

### **Próximos Componentes Sugeridos:**

1. `SearchMethodCard` - Completar el flow de búsqueda
2. `PropertyCard` - Elemento fundamental para catálogos
3. `PropertySearchBar` - Componente de búsqueda principal
4. `FilterPanel` - Sistema de filtros avanzados
5. `InteractiveMap` - Integración de mapas

### **Template para Nuevos Prompts:**

```markdown
# Prompt para Componente `ComponentName`

## **Descripción del Componente**
[Descripción clara del propósito y contexto]

## **Especificaciones de Diseño**
[Layout, styling usando el sistema establecido]

## **Funcionalidad Requerida**
[Props interface, estados, comportamientos]

## **Responsive Design**
[Mobile/Tablet/Desktop specifications]

## **Implementación Técnica**
[Estructura, hooks, animaciones]

## **Accesibilidad**
[ARIA, keyboard navigation, a11y requirements]

## **Testing Strategy**
[Unit, integration, a11y testing approaches]
```

### **Recursos de Consulta Rápida:**

- **Colores:** Usar variables CSS establecidas
- **Espaciado:** Múltiplos de 4px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- **Tipografía:** Inter font family con jerarquía establecida
- **Iconos:** Lucide React con tamaños estándar (16, 20, 24, 32px)
- **Animaciones:** Smooth transitions (0.2s ease), subtle effects
- **Shadows:** Cards (0 1px 3px rgba(0,0,0,0.1)), Elevated (0 4px 6px rgba(0,0,0,0.07))

---

## **Notas Importantes**

- **Mantener coherencia:** Todos los componentes deben sentirse parte del mismo sistema
- **Priorizar UX:** La experiencia de usuario es más importante que efectos visuales complejos
- **Performance first:** Optimizar carga, animaciones y interacciones
- **Contexto inmobiliario:** Recordar que es una plataforma financiera de alto valor
- **Localización mexicana:** Considerar formatos de moneda, fechas y convenciones locales

**Última actualización:** [Fecha actual]  
**Estado del proyecto:** Fase de desarrollo de componentes base  
**Progreso:** 6/35 componentes con prompts completados
