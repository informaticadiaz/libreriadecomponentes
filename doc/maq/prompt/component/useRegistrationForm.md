# Prompt para Componente `UserRegistrationForm`

## **Descripción del Componente**

Crea un componente `UserRegistrationForm` que capture la información esencial del usuario para registro en una plataforma inmobiliaria. Debe transmitir confianza profesional, validar datos en tiempo real y proporcionar una experiencia fluida paso a paso o en formato compacto.

## **Especificaciones de Diseño**

### **Layout y Estructura**

- **Contenedor principal:** Fondo blanco, border-radius: 8px, shadow: 0 4px 6px rgba(0,0,0,0.07)
- **Header:** Título "Crear mi cuenta" (H2, 24px, font-weight: 600, color: `#111827`)
- **Subtítulo:** "Únete a miles de usuarios que ya confían en nosotros" (16px, font-weight: 400, color: `#4B5563`)
- **Formulario:** Campos organizados en grupos lógicos con spacing de 20px entre secciones
- **Footer:** Links a términos y política de privacidad

### **Campos del Formulario**

#### **Información Personal**

```typescript
- nombre: string (required)
- apellidos: string (required)  
- email: string (required, email validation)
- telefono: string (required, format validation)
- fechaNacimiento: Date (optional, 18+ validation)
```

#### **Información Profesional**

```typescript
- tipoUsuario: 'comprador' | 'vendedor' | 'agente' | 'desarrollador' (required)
- empresa?: string (conditional, required if agente/desarrollador)
- licenciaAgente?: string (conditional, required if agente)
```

#### **Ubicación y Preferencias**

```typescript
- ciudadInteres: string[] (required, autocomplete)
- rangoPresupuesto: { min: number, max: number } (conditional)
- tipoPropiedad: string[] (conditional, multiple select)
```

#### **Seguridad**

```typescript
- password: string (required, strength validation)
- confirmPassword: string (required, match validation)
- acceptTerms: boolean (required)
- acceptMarketing: boolean (optional)
```

### **Estilos de Campos**

#### **Input Fields**

```css
Base State:
- border: 1px solid #D1D5DB
- padding: 12px 16px
- border-radius: 8px
- font-size: 16px
- background: white

Focus State:
- border-color: #3B82F6
- box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
- outline: none

Error State:
- border-color: #EF4444
- box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)

Success State:
- border-color: #10B981
- box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)
```

#### **Labels**

```css
- font-size: 14px
- font-weight: 500
- color: #374151
- margin-bottom: 6px
- display: block
```

#### **Error Messages**

```css
- font-size: 12px
- color: #EF4444
- margin-top: 4px
- display: flex
- align-items: center
- gap: 4px (con ícono de error)
```

#### **Success Messages**

```css
- font-size: 12px
- color: #10B981
- margin-top: 4px
- display: flex
- align-items: center
- gap: 4px (con checkmark)
```

## **Funcionalidad Requerida**

### **Props Interface**

```typescript
interface UserRegistrationFormProps {
  onSubmit: (userData: UserData) => Promise<void>;
  onLoginRedirect: () => void;
  initialValues?: Partial<UserData>;
  isLoading?: boolean;
  serverErrors?: Record<string, string>;
  showStepIndicator?: boolean;
  compactMode?: boolean;
  availableCities?: string[];
  onCitySearch?: (query: string) => Promise<string[]>;
}

interface UserData {
  // ... todos los campos mencionados arriba
}
```

### **Estados del Componente**

- **Validation state:** Real-time validation con debounce (300ms)
- **Loading state:** Botón submit con spinner, campos disabled
- **Error handling:** Display de errores del servidor y cliente
- **Step navigation:** Si showStepIndicator = true, formulario multipaso
- **Auto-save:** Opcional, guardar progreso en localStorage

### **Validaciones en Tiempo Real**

#### **Email Validation**

```typescript
- Formato email válido
- Verificación de dominio existente (opcional)
- Check de email ya registrado (debounced API call)
```

#### **Password Strength**

```typescript
- Mínimo 8 caracteres
- Al menos 1 mayúscula, 1 minúscula, 1 número
- Indicador visual de fortaleza (weak/medium/strong)
- No contener información personal
```

#### **Phone Validation**

```typescript
- Formato mexicano: +52 XXX XXX XXXX
- Auto-formatting mientras se escribe
- Verificación de número válido
```

## **Responsive Design**

### **Mobile First (< 640px)**

```css
Container:
- padding: 16px
- margin: 16px
- full width

Fields:
- stack vertically
- full width inputs
- larger touch targets (min 44px height)

Buttons:
- full width
- padding: 16px
- font-size: 16px
```

### **Tablet (640px - 1024px)**

```css
Container:
- max-width: 480px
- margin: 24px auto
- padding: 24px

Fields:
- some 2-column layouts (nombre/apellidos)
- maintain good spacing
```

### **Desktop (> 1024px)**

```css
Container:
- max-width: 520px
- margin: 32px auto
- padding: 32px

Fields:
- strategic 2-column layouts
- optimal form completion flow
```

## **Implementación Técnica**

### **Estructura del Componente**

```jsx
<form className="registration-form" onSubmit={handleSubmit}>
  <FormHeader />
  
  {showStepIndicator && <StepIndicator />}
  
  <FormSection title="Información Personal">
    <FormField name="nombre" />
    <FormField name="apellidos" />
    <FormField name="email" />
    <FormField name="telefono" />
  </FormSection>
  
  <FormSection title="Información Profesional">
    <UserTypeSelector />
    <ConditionalFields />
  </FormSection>
  
  <FormSection title="Preferencias">
    <CitySelector />
    <BudgetRange />
    <PropertyTypeSelector />
  </FormSection>
  
  <FormSection title="Seguridad">
    <PasswordField />
    <ConfirmPasswordField />
  </FormSection>
  
  <FormSection title="Términos">
    <CheckboxField name="acceptTerms" />
    <CheckboxField name="acceptMarketing" />
  </FormSection>
  
  <FormActions>
    <SubmitButton />
    <LoginRedirectLink />
  </FormActions>
</form>
```

### **Componentes Especializados**

#### **UserTypeSelector**

```jsx
// Radio buttons estilizados como cards
// Iconos para cada tipo de usuario
// Descripción breve de cada rol
```

#### **CitySelector**

```jsx
// Autocomplete con búsqueda
// Lista de ciudades populares
// Validación de ciudad existente
```

#### **BudgetRange**

```jsx
// Dual range slider
// Input numéricos sincronizados
// Formato de moneda mexicana
```

#### **PasswordStrengthIndicator**

```jsx
// Barra de progreso visual
// Lista de requisitos con checkmarks
// Feedback en tiempo real
```

## **Validación y Manejo de Errores**

### **Client-Side Validation**

```typescript
const validationSchema = {
  nombre: {
    required: 'El nombre es requerido',
    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
  },
  email: {
    required: 'El email es requerido',
    pattern: { value: emailRegex, message: 'Email inválido' },
    validate: async (value) => await checkEmailExists(value)
  },
  // ... más validaciones
}
```

### **Server-Side Error Handling**

```typescript
// Mapeo de errores del servidor a campos específicos
// Mensajes de error user-friendly
// Retry logic para errores temporales
```

## **Accesibilidad**

### **Form Accessibility**

```html
<fieldset aria-labelledby="personal-info-legend">
  <legend id="personal-info-legend">Información Personal</legend>
  
  <label htmlFor="nombre-input">
    Nombre *
    <input 
      id="nombre-input"
      aria-describedby="nombre-error nombre-help"
      aria-invalid={hasError}
      aria-required="true"
    />
  </label>
  
  <div id="nombre-help" className="field-help">
    Ingresa tu nombre completo
  </div>
  
  {error && (
    <div id="nombre-error" role="alert" className="field-error">
      {error.message}
    </div>
  )}
</fieldset>
```

### **Keyboard Navigation**

- Tab order lógico
- Skip links si es formulario largo
- Enter para submit
- Escape para cancelar/limpiar

## **Performance Optimizations**

### **Code Splitting**

```typescript
// Lazy load validaciones complejas
const validateEmail = lazy(() => import('./validators/email'));

// Conditional imports para campos especializados
const AgentFields = lazy(() => import('./AgentFields'));
```

### **Debouncing**

```typescript
// API calls para validación
const debouncedEmailCheck = useDebouncedCallback(checkEmail, 300);

// Auto-save funcionalidad  
const debouncedAutoSave = useDebouncedCallback(saveForm, 1000);
```

## **Testing Strategy**

### **Unit Tests**

- Validación de cada campo
- Manejo de estados de error
- Conditional rendering de campos
- Form submission flow

### **Integration Tests**

- Complete registration flow
- Error recovery scenarios
- API integration testing

### **A11y Testing**

- Screen reader compatibility
- Keyboard-only navigation
- Color contrast validation
- Focus management

Este prompt está diseñado para crear un formulario de registro robusto que mantenga la confianza profesional de monopolio.com.mx mientras proporciona una experiencia de usuario fluida y accesible para el onboarding de usuarios inmobiliarios.
