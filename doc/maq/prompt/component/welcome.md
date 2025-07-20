# Prompt para Componente `WelcomeScreen`

## **Descripción del Componente**

Crea un componente `WelcomeScreen` que sirva como pantalla inicial de bienvenida para una aplicación inmobiliaria móvil. Este componente debe transmitir confianza profesional y guiar al usuario hacia el registro/login de manera clara y atractiva.

## **Especificaciones de Diseño**

### **Layout y Estructura**

- **Contenedor principal:** Full height viewport, fondo degradado sutil del azul corporativo (`#1E40AF`) al azul claro (`#3B82F6`)
- **Logo/Branding:** Posicionado en el tercio superior, con ícono de casa/edificio estilizado
- **Título principal:** "Bienvenido a [AppName]" usando H1 (32px, font-weight: 700, color blanco)
- **Subtítulo:** Descripción del valor proposición usando body text (16px, font-weight: 400, color blanco con 90% opacity)
- **CTAs:** Dos botones principales centrados en la parte inferior

### **Elementos Visuales**

- **Ilustración/Ícono:** Elemento gráfico que represente propiedades/inmobiliaria, color blanco con opacity 20% como elemento decorativo de fondo
- **Spacing:** Utilizar el sistema de espaciado (múltiplos de 4px), con separación grande (48px) entre secciones principales
- **Border radius:** 8px en todos los elementos con bordes redondeados

### **Botones de Acción**

```css
Botón Primario ("Comenzar"): 
- bg-white, text-blue-600, hover:bg-gray-50
- padding: 16px 32px, rounded-lg, font-weight: 600
- width: 100% en mobile, max-width: 280px en desktop

Botón Secundario ("Ya tengo cuenta"):
- border-white, text-white, hover:bg-white/10
- padding: 14px 32px, rounded-lg, font-weight: 500
- width: 100% en mobile, max-width: 280px en desktop
```

## **Funcionalidad Requerida**

### **Props Interface**

```typescript
interface WelcomeScreenProps {
  onStart: () => void;           // Callback para botón "Comenzar"
  onLogin: () => void;           // Callback para "Ya tengo cuenta"
  appName: string;               // Nombre de la aplicación
  subtitle?: string;             // Subtítulo personalizable
  logoSrc?: string;              // URL del logo opcional
  isLoading?: boolean;           // Estado de carga
}
```

### **Estados del Componente**

- **Loading state:** Skeleton loaders para botones cuando `isLoading = true`
- **Interactive states:** Hover y focus states claramente definidos
- **Accessibility:** Focus trap, screen reader support, keyboard navigation

## **Responsive Design**

### **Mobile First (< 640px)**

- Padding horizontal: 16px
- Stack vertical con spacing de 32px
- Botones full-width con margin bottom 12px
- Font sizes: H1 28px, body 14px

### **Tablet (640px - 1024px)**

- Padding horizontal: 24px
- Mantener stack vertical
- Botones con max-width 280px centrados
- Font sizes originales

### **Desktop (> 1024px)**

- Max-width: 480px centrado
- Padding horizontal: 32px
- Considera layout horizontal si es necesario

## **Implementación Técnica**

### **Estructura del Componente**

```jsx
<div className="welcome-screen-container">
  <div className="welcome-content">
    <div className="branding-section">
      {/* Logo/Ícono */}
      {/* Título principal */}
      {/* Subtítulo */}
    </div>
    <div className="illustration-section">
      {/* Elemento gráfico decorativo */}
    </div>
    <div className="actions-section">
      {/* Botón primario */}
      {/* Botón secundario */}
    </div>
  </div>
</div>
```

### **Animaciones (opcional)**

- **Fade in:** Entrada suave de elementos con stagger (0.2s delay entre elementos)
- **Button interactions:** Subtle scale (0.98) en active state
- **Background:** Gentle gradient animation si el performance lo permite

## **Accesibilidad**

### **Requisitos WCAG**

- **Contraste:** Verificar ratio 4.5:1 mínimo para todos los textos
- **Focus indicators:** Ring azul visible en todos los elementos interactivos
- **Screen readers:** Proper heading hierarchy, descriptive button texts
- **Keyboard navigation:** Tab order lógico, escape key handling

### **Semantic HTML**

```html
<main role="main" aria-label="Pantalla de bienvenida">
  <section aria-labelledby="welcome-title">
    <h1 id="welcome-title">...</h1>
    <p aria-describedby="welcome-subtitle">...</p>
  </section>
  <section aria-label="Acciones principales">
    <button aria-describedby="start-description">...</button>
    <button aria-describedby="login-description">...</button>
  </section>
</main>
```

## **Testing Considerations**

### **Unit Tests**

- Renderizado correcto con props requeridas
- Callbacks ejecutados correctamente
- Estados de loading manejados apropiadamente

### **Visual Testing**

- Screenshot testing en diferentes viewports
- Verificación de espaciado y tipografía
- Estados hover/focus/active

### **Accessibility Testing**

- Screen reader compatibility
- Keyboard-only navigation
- Color contrast validation

## **Performance**

### **Optimizaciones**

- **Lazy loading:** Para ilustraciones/imágenes pesadas
- **Preload:** Fuentes críticas y assets de la siguiente pantalla
- **Minimal bundle:** Solo importar utilities de Tailwind necesarias

### **Loading Strategy**

- Mostrar estructura inmediatamente
- Progressive enhancement para animaciones
- Graceful degradation en conexiones lentas

Este prompt está diseñado para crear un `WelcomeScreen` que sea la primera impresión perfecta de una aplicación inmobiliaria profesional, siguiendo los principios de diseño de monopolio.com.mx mientras mantiene la usabilidad móvil óptima.
