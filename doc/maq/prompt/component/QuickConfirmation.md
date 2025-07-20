# Prompt para Componente `QuickConfirmation`

## **Descripción del Componente**

Crea un componente `QuickConfirmation` que sirva como pantalla de confirmación exitosa en el flujo de registro/onboarding. Debe transmitir éxito inmediato, mantener el momentum del usuario y proporcionar una transición fluida hacia el siguiente paso del proceso.

## **Especificaciones de Diseño**

### **Layout y Estructura Principal**

- **Contenedor:** Centrado verticalmente, max-width: 400px, padding responsivo
- **Ícono de éxito:** Elemento visual prominente (checkmark animado o similar)
- **Mensaje principal:** "¡Bien rápido!" como título principal
- **Mensaje secundario:** Confirmación específica de la acción completada
- **Progreso:** Indicador opcional del progreso en el flujo
- **CTA:** Botón de continuar bien visible

### **Styling del Contenedor**

```css
Base Container:
- background: white
- border-radius: 12px
- padding: 32px 24px
- text-align: center
- box-shadow: 0 4px 6px rgba(0,0,0,0.07)
- max-width: 400px
- margin: 0 auto

Success State:
- border: 2px solid #10B981
- background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)

Animation Container:
- transform: scale(0.95) al cargar
- animate to scale(1) con ease-out
- duration: 300ms
```

### **Ícono de Éxito**

```css
Success Icon:
- width: 80px
- height: 80px
- background: #10B981
- border-radius: 50%
- margin: 0 auto 24px
- display: flex
- align-items: center
- justify-content: center
- position: relative

Icon Inner:
- checkmark icon (32px)
- color: white
- font-weight: bold

Animation:
- scale from 0 to 1 con bounce effect
- delay: 200ms después del container
- duration: 500ms
```

### **Tipografía y Mensajes**

```css
Main Title ("¡Bien rápido!"):
- font-size: 28px (H1 variant)
- font-weight: 700
- color: #111827
- margin-bottom: 12px
- letter-spacing: -0.02em

Confirmation Message:
- font-size: 16px (Body)
- font-weight: 400
- color: #4B5563
- line-height: 1.5
- margin-bottom: 24px
- max-width: 320px
- margin-left/right: auto

Success Badge (opcional):
- font-size: 12px
- font-weight: 500
- color: #10B981
- background: #D1FAE5
- padding: 4px 12px
- border-radius: 16px
- display: inline-block
- margin-bottom: 16px
```

## **Funcionalidad Requerida**

### **Props Interface**

```typescript
interface QuickConfirmationProps {
  title?: string;
  message: string;
  onContinue: () => void;
  onBack?: () => void;
  continueText?: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  customIcon?: React.ReactNode;
  variant?: 'success' | 'info' | 'warning';
  isLoading?: boolean;
  className?: string;
  showBackButton?: boolean;
}

interface ConfirmationConfig {
  title: string;
  message: string;
  iconType: 'checkmark' | 'clock' | 'user' | 'location';
  nextStepHint?: string;
}
```

### **Estados del Componente**

```typescript
interface QuickConfirmationState {
  isVisible: boolean;
  isAnimating: boolean;
  timeRemaining: number;
  hasAnimationCompleted: boolean;
}
```

### **Variantes de Confirmación**

#### **Registro Completado**

```typescript
const registrationComplete: ConfirmationConfig = {
  title: "¡Bien rápido!",
  message: "Tu cuenta ha sido creada exitosamente. Ya puedes comenzar a explorar propiedades.",
  iconType: "checkmark",
  nextStepHint: "Continuemos con tus preferencias"
};
```

#### **Ubicación Seleccionada**

```typescript
const locationSelected: ConfirmationConfig = {
  title: "¡Excelente elección!",
  message: "Has seleccionado Puerto Vallarta. Encontraremos las mejores propiedades para ti.",
  iconType: "location",
  nextStepHint: "Ahora definamos tu presupuesto"
};
```

#### **Perfil Completado**

```typescript
const profileComplete: ConfirmationConfig = {
  title: "¡Perfecto!",
  message: "Tu perfil está completo. Estamos listos para mostrarte propiedades personalizadas.",
  iconType: "user",
  nextStepHint: "Comencemos la búsqueda"
};
```

## **Componentes Visuales**

### **SuccessIcon Component**

```jsx
const SuccessIcon: React.FC<{ iconType: string; isAnimating: boolean }> = ({
  iconType,
  isAnimating
}) => {
  const iconMap = {
    checkmark: CheckIcon,
    clock: ClockIcon,
    user: UserIcon,
    location: MapPinIcon
  };
  
  const IconComponent = iconMap[iconType] || CheckIcon;
  
  return (
    <div className={cn('success-icon', { animating: isAnimating })}>
      <div className="icon-background">
        <IconComponent className="icon-inner" />
      </div>
      {isAnimating && <div className="ripple-effect" />}
    </div>
  );
};
```

### **ProgressIndicator Component**

```jsx
const ProgressIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <div className="progress-indicator">
      <div className="progress-text">
        Paso {currentStep} de {totalSteps}
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
```

### **AutoAdvanceTimer Component**

```jsx
const AutoAdvanceTimer: React.FC<{
  delay: number;
  onComplete: () => void;
  isActive: boolean;
}> = ({ delay, onComplete, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(delay);
  
  // Timer logic implementation
  
  return (
    <div className="auto-advance-timer">
      <div className="timer-text">
        Continuando automáticamente en {timeLeft}s
      </div>
      <div className="timer-ring">
        <svg className="timer-circle">
          <circle 
            className="timer-progress"
            style={{ 
              strokeDashoffset: `${(timeLeft / delay) * 283}px` 
            }}
          />
        </svg>
      </div>
    </div>
  );
};
```

## **Responsive Design**

### **Mobile (< 640px)**

```css
Container:
- padding: 24px 16px
- margin: 16px
- border-radius: 8px

Success Icon:
- width: 64px
- height: 64px

Main Title:
- font-size: 24px

Continue Button:
- width: 100%
- padding: 16px
- font-size: 16px
- margin-top: 24px

Progress Indicator:
- simplified layout
- smaller text (12px)
```

### **Tablet (640px - 1024px)**

```css
Container:
- padding: 32px 24px
- margin: 24px auto

Success Icon:
- width: 72px
- height: 72px

Main Title:
- font-size: 26px

Continue Button:
- max-width: 280px
- margin: 24px auto 0
```

### **Desktop (> 1024px)**

```css
Container:
- padding: 40px 32px
- margin: 32px auto

Success Icon:
- width: 80px
- height: 80px

Main Title:
- font-size: 28px

Continue Button:
- max-width: 200px
- margin: 32px auto 0

Auto Advance Timer:
- position: absolute
- top: 16px
- right: 16px
```

## **Implementación Técnica**

### **Estructura del Componente**

```jsx
const QuickConfirmation: React.FC<QuickConfirmationProps> = ({
  title = "¡Bien rápido!",
  message,
  onContinue,
  onBack,
  continueText = "Continuar",
  showProgress = false,
  currentStep,
  totalSteps,
  autoAdvance = false,
  autoAdvanceDelay = 3000,
  variant = 'success',
  isLoading = false,
  showBackButton = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Animation effects
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Auto advance logic
  useEffect(() => {
    if (autoAdvance && !isLoading) {
      const timer = setTimeout(onContinue, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, autoAdvanceDelay, onContinue, isLoading]);
  
  return (
    <div className={cn('quick-confirmation', variant, { visible: isVisible })} {...props}>
      {showProgress && currentStep && totalSteps && (
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      )}
      
      <SuccessIcon iconType="checkmark" isAnimating={isAnimating} />
      
      <div className="confirmation-content">
        <h1 className="confirmation-title">{title}</h1>
        <p className="confirmation-message">{message}</p>
      </div>
      
      <div className="confirmation-actions">
        {showBackButton && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="back-button"
            disabled={isLoading}
          >
            Anterior
          </button>
        )}
        
        <button
          type="button"
          onClick={onContinue}
          className="continue-button primary"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : continueText}
        </button>
      </div>
      
      {autoAdvance && !isLoading && (
        <AutoAdvanceTimer
          delay={autoAdvanceDelay / 1000}
          onComplete={onContinue}
          isActive={true}
        />
      )}
    </div>
  );
};
```

### **Animaciones CSS**

```css
@keyframes slideInScale {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes iconBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.quick-confirmation {
  animation: slideInScale 0.3s ease-out;
}

.success-icon.animating .icon-background {
  animation: iconBounce 0.5s ease-out 0.2s both;
}

.ripple-effect {
  position: absolute;
  inset: -10px;
  border: 2px solid #10B981;
  border-radius: 50%;
  opacity: 0.3;
  animation: ripple 1s ease-out;
}
```

## **Accesibilidad**

### **ARIA Implementation**

```jsx
<div
  role="alert"
  aria-live="polite"
  aria-labelledby="confirmation-title"
  aria-describedby="confirmation-message"
>
  <h1 id="confirmation-title">{title}</h1>
  <p id="confirmation-message">{message}</p>
  
  {autoAdvance && (
    <div aria-live="polite" aria-atomic="true">
      Continuando automáticamente en {timeLeft} segundos
    </div>
  )}
</div>
```

### **Keyboard Navigation**

- **Tab:** Navegar entre botones
- **Enter:** Activar botón enfocado
- **Escape:** Cancelar auto-advance (si está activo)
- **Focus visible:** Ring azul claro alrededor de elementos enfocados

## **Testing Strategy**

### **Unit Tests**

- Renderizado con diferentes props
- Funcionalidad de auto-advance
- Manejo de animaciones
- Estados de loading

### **Integration Tests**

- Flujo completo de confirmación
- Transiciones entre pasos
- Manejo de errores

### **A11y Tests**

- Screen reader announcements
- Keyboard navigation
- Focus management
- Animation preferences (prefers-reduced-motion)

## **Performance Optimizations**

### **Animation Performance**

```typescript
// Usar will-change para optimizar animaciones
const useOptimizedAnimation = () => {
  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.style.willChange = 'transform, opacity';
      
      return () => {
        element.style.willChange = 'auto';
      };
    }
  }, []);
};
```

### **Auto-advance Cleanup**

```typescript
// Limpiar timers correctamente
useEffect(() => {
  if (autoAdvance) {
    const timer = setTimeout(onContinue, autoAdvanceDelay);
    
    return () => {
      clearTimeout(timer);
    };
  }
}, [autoAdvance, autoAdvanceDelay, onContinue]);
```

Este componente está diseñado para proporcionar feedback inmediato y positivo al usuario, manteniendo el momentum en el flujo de onboarding mientras transmite la confianza profesional característica de monopolio.com.mx.
