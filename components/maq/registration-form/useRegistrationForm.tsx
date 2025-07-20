import React, { useState, useCallback } from 'react';
import { 
  User, Mail, Phone, Building, MapPin, DollarSign, 
  Lock, Eye, EyeOff, Check, AlertCircle, ChevronRight, ChevronLeft,
  Home, Briefcase, Building2
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Tipos TypeScript
interface UserData {
  // Información Personal
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento?: Date;
  
  // Información Profesional
  tipoUsuario: 'comprador' | 'vendedor' | 'agente' | 'desarrollador';
  empresa?: string;
  licenciaAgente?: string;
  
  // Ubicación y Preferencias
  ciudadInteres: string[];
  rangoPresupuesto?: { min: number; max: number };
  tipoPropiedad?: string[];
  
  // Seguridad
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

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
  className?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormStep {
  title: string;
  fields: string[];
}

// Hook personalizado para validación
const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: string | boolean | string[] | Date | { min: number; max: number } | undefined, formData: Partial<UserData>) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value || (typeof value === 'string' && value.length < 2)) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'apellidos':
        if (!value || (typeof value === 'string' && value.length < 2)) {
          error = 'Los apellidos deben tener al menos 2 caracteres';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'El email es requerido';
        } else if (typeof value === 'string' && !emailRegex.test(value)) {
          error = 'Formato de email inválido';
        }
        break;
      case 'telefono':
        const phoneRegex = /^\+52\s\d{3}\s\d{3}\s\d{4}$/;
        if (!value) {
          error = 'El teléfono es requerido';
        } else if (typeof value === 'string' && !phoneRegex.test(value)) {
          error = 'Formato: +52 XXX XXX XXXX';
        }
        break;
      case 'password':
        if (!value) {
          error = 'La contraseña es requerida';
        } else if (typeof value === 'string' && value.length < 8) {
          error = 'Mínimo 8 caracteres';
        } else if (typeof value === 'string' && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Debe contener mayúscula, minúscula y número';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Confirma tu contraseña';
        } else if (value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
      case 'acceptTerms':
        if (!value) {
          error = 'Debes aceptar los términos y condiciones';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error === '';
  }, []);

  return { errors, validateField, setErrors };
};

// Componente principal
export default function UserRegistrationForm({
  onSubmit,
  onLoginRedirect,
  initialValues = {},
  isLoading = false,
  serverErrors = {},
  showStepIndicator = false,
  compactMode = false,
  availableCities = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  onCitySearch,
  className,
  ...props
}: UserRegistrationFormProps) {
  const [formData, setFormData] = useState<Partial<UserData>>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    tipoUsuario: 'comprador',
    ciudadInteres: [],
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false,
    ...initialValues
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [filteredCities, setFilteredCities] = useState(availableCities);

  const { errors, validateField } = useFormValidation();

  const steps: FormStep[] = [
    { title: 'Información Personal', fields: ['nombre', 'apellidos', 'email', 'telefono'] },
    { title: 'Información Profesional', fields: ['tipoUsuario', 'empresa', 'licenciaAgente'] },
    { title: 'Preferencias', fields: ['ciudadInteres', 'rangoPresupuesto', 'tipoPropiedad'] },
    { title: 'Seguridad', fields: ['password', 'confirmPassword', 'acceptTerms'] }
  ];

  // Formatear teléfono automáticamente
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return '+52';
    if (numbers.length <= 5) return `+52 ${numbers.slice(2)}`;
    if (numbers.length <= 8) return `+52 ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
    return `+52 ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 12)}`;
  };

  // Manejar cambios en los campos
  const handleFieldChange = useCallback((name: string, value: string | boolean | string[]) => {
    let processedValue: string | boolean | string[] = value;

    if (name === 'telefono' && typeof value === 'string') {
      processedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Validar con debounce
    setTimeout(() => {
      validateField(name, processedValue, { ...formData, [name]: processedValue });
    }, 300);
  }, [formData, validateField]);

  // Buscar ciudades
  const handleCitySearch = useCallback(async (query: string) => {
    setCitySearch(query);
    if (onCitySearch && query.length > 2) {
      const cities = await onCitySearch(query);
      setFilteredCities(cities);
    } else {
      setFilteredCities(availableCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      ));
    }
  }, [onCitySearch, availableCities]);

  // Navegar pasos
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Validar paso actual
  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => {
      const value = formData[field as keyof UserData];
      if (!value && ['nombre', 'apellidos', 'email', 'telefono', 'tipoUsuario', 'password', 'confirmPassword', 'acceptTerms'].includes(field)) {
        return false;
      }
      return validateField(field, value, formData) && !errors[field];
    });
  };

  // Enviar formulario
  const handleSubmit = async () => {
    const requiredFields = ['nombre', 'apellidos', 'email', 'telefono', 'tipoUsuario', 'password', 'confirmPassword', 'acceptTerms'];
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof UserData];
      if (!validateField(field, value, formData)) {
        hasErrors = true;
      }
    });

    if (!hasErrors && formData.acceptTerms) {
      await onSubmit(formData as UserData);
    }
  };

  // Componentes de UI reutilizables
  const FormField = ({ 
    name, 
    label, 
    type = 'text', 
    required = false, 
    icon: Icon,
    placeholder,
    children 
  }: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    placeholder?: string;
    children?: React.ReactNode;
  }) => {
    const hasError = errors[name] || serverErrors[name];
    const hasSuccess = formData[name as keyof UserData] && !hasError;

    return (
      <div className="space-y-2 animate-in fade-in duration-300">
        <label htmlFor={name} className="block text-sm font-medium text-white/90">
          {label} {required && <span className="text-red-300">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          )}
          {children || (
            <input
              id={name}
              type={type}
              value={formData[name as keyof UserData] as string || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(name, e.target.value)}
              placeholder={placeholder}
              className={cn(
                "w-full px-4 py-3 border rounded-lg text-base transition-all duration-200 ease-in-out",
                "bg-white/10 backdrop-blur-sm text-white placeholder-white/60",
                "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                Icon ? "pl-10" : "",
                hasError 
                  ? 'border-red-400 bg-red-900/20' 
                  : hasSuccess
                    ? 'border-green-400 bg-green-900/20'
                    : 'border-white/30 hover:border-white/50',
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isLoading}
              aria-describedby={hasError ? `${name}-error` : undefined}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-required={required}
            />
          )}
          {hasSuccess && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
          )}
        </div>
        {hasError && (
          <div id={`${name}-error`} role="alert" className="flex items-center gap-1 text-sm text-red-300">
            <AlertCircle className="w-4 h-4" />
            {hasError}
          </div>
        )}
      </div>
    );
  };

  const UserTypeCard = ({ type, icon: Icon, title, description }: {
    type: 'comprador' | 'vendedor' | 'agente' | 'desarrollador';
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }) => (
    <label className={cn(
      "cursor-pointer block p-4 border-2 rounded-lg transition-all duration-200",
      "bg-white/10 backdrop-blur-sm hover:bg-white/20",
      formData.tipoUsuario === type 
        ? 'border-white bg-white/25' 
        : 'border-white/30 hover:border-white/50'
    )}>
      <input
        type="radio"
        name="tipoUsuario"
        value={type}
        checked={formData.tipoUsuario === type}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('tipoUsuario', e.target.value)}
        className="sr-only"
      />
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "w-6 h-6 mt-1",
          formData.tipoUsuario === type ? 'text-white' : 'text-white/70'
        )} />
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-sm text-white/80">{description}</div>
        </div>
      </div>
    </label>
  );

  const StepIndicator = () => (
    <div className="mb-8 animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
              index === currentStep 
                ? 'bg-white text-blue-600' 
                : index < currentStep 
                  ? 'bg-green-400 text-white' 
                  : 'bg-white/20 text-white/60 backdrop-blur-sm'
            )}>
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-1 mx-2 rounded-full transition-all duration-200",
                index < currentStep ? 'bg-green-400' : 'bg-white/20'
              )} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-white">{steps[currentStep].title}</h3>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Información Personal
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="nombre"
                label="Nombre"
                required
                icon={User}
                placeholder="Tu nombre"
              />
              <FormField
                name="apellidos"
                label="Apellidos"
                required
                icon={User}
                placeholder="Tus apellidos"
              />
            </div>
            <FormField
              name="email"
              label="Correo electrónico"
              type="email"
              required
              icon={Mail}
              placeholder="tu@email.com"
            />
            <FormField
              name="telefono"
              label="Teléfono"
              required
              icon={Phone}
              placeholder="+52 XXX XXX XXXX"
            />
          </div>
        );

      case 1: // Información Profesional
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-4">
                ¿Qué tipo de usuario eres? *
              </label>
              <div className="space-y-3">
                <UserTypeCard
                  type="comprador"
                  icon={Home}
                  title="Comprador"
                  description="Busco propiedades para comprar"
                />
                <UserTypeCard
                  type="vendedor"
                  icon={DollarSign}
                  title="Vendedor"
                  description="Quiero vender mi propiedad"
                />
                <UserTypeCard
                  type="agente"
                  icon={Briefcase}
                  title="Agente Inmobiliario"
                  description="Soy un profesional del sector"
                />
                <UserTypeCard
                  type="desarrollador"
                  icon={Building2}
                  title="Desarrollador"
                  description="Desarrollo proyectos inmobiliarios"
                />
              </div>
            </div>

            {(formData.tipoUsuario === 'agente' || formData.tipoUsuario === 'desarrollador') && (
              <FormField
                name="empresa"
                label="Empresa"
                required
                icon={Building}
                placeholder="Nombre de tu empresa"
              />
            )}

            {formData.tipoUsuario === 'agente' && (
              <FormField
                name="licenciaAgente"
                label="Licencia de Agente"
                required
                placeholder="Número de licencia"
              />
            )}
          </div>
        );

      case 2: // Preferencias
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Ciudades de interés *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCitySearch(e.target.value)}
                  placeholder="Buscar ciudades..."
                  className="w-full pl-10 pr-4 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:border-white/50 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
              </div>
              
              {citySearch && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        const newCities = formData.ciudadInteres?.includes(city)
                          ? formData.ciudadInteres.filter(c => c !== city)
                          : [...(formData.ciudadInteres || []), city];
                        handleFieldChange('ciudadInteres', newCities);
                        setCitySearch('');
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/20 border-b border-white/10 last:border-b-0 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}

              {formData.ciudadInteres && formData.ciudadInteres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.ciudadInteres.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm"
                    >
                      {city}
                      <button
                        type="button"
                        onClick={() => {
                          const newCities = formData.ciudadInteres?.filter(c => c !== city) || [];
                          handleFieldChange('ciudadInteres', newCities);
                        }}
                        className="ml-1 text-white/80 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Seguridad
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <FormField
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              required
              icon={Lock}
              placeholder="Mínimo 8 caracteres"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('password', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border rounded-lg text-base transition-all duration-200",
                    "bg-white/10 backdrop-blur-sm text-white placeholder-white/60",
                    "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                    errors.password 
                      ? 'border-red-400 bg-red-900/20' 
                      : formData.password && !errors.password
                        ? 'border-green-400 bg-green-900/20'
                        : 'border-white/30 hover:border-white/50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </FormField>

            <FormField
              name="confirmPassword"
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              icon={Lock}
              placeholder="Repite tu contraseña"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('confirmPassword', e.target.value)}
                  placeholder="Repite tu contraseña"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border rounded-lg text-base transition-all duration-200",
                    "bg-white/10 backdrop-blur-sm text-white placeholder-white/60",
                    "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                    errors.confirmPassword 
                      ? 'border-red-400 bg-red-900/20' 
                      : formData.confirmPassword && !errors.confirmPassword
                        ? 'border-green-400 bg-green-900/20'
                        : 'border-white/30 hover:border-white/50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </FormField>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('acceptTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-white/50 focus:ring-2"
                  required
                />
                <span className="text-sm text-white/90">
                  Acepto los{' '}
                  <a href="#" className="text-white underline hover:text-white/80">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-white underline hover:text-white/80">
                    política de privacidad
                  </a>
                  *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptMarketing || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('acceptMarketing', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-white/50 focus:ring-2"
                />
                <span className="text-sm text-white/90">
                  Quiero recibir ofertas y noticias por email
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main 
      role="main" 
      aria-label="Formulario de registro"
      className={cn(
        "min-h-screen w-full relative overflow-hidden",
        "bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500",
        "flex items-center justify-center py-8",
        className
      )}
      {...props}
    >
      {/* Elementos decorativos de fondo */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-8 transform rotate-12">
          <Home size={120} className="text-white" />
        </div>
        <div className="absolute bottom-1/4 left-8 transform -rotate-12">
          <Building2 size={80} className="text-white" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
          <Building size={200} className="text-white opacity-30" />
        </div>
      </div>

      <div className={cn(
        "relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8",
        compactMode ? 'max-w-md' : 'max-w-2xl'
      )}>
        {/* Container principal */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 border border-white/20 animate-in fade-in duration-700">
          {/* Header */}
          <div className="text-center mb-8 animate-in slide-in-from-top duration-500 delay-200">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Crear mi cuenta
            </h2>
            <p className="text-white/80">
              Únete a miles de usuarios que ya confían en nosotros
            </p>
          </div>

          {/* Indicador de pasos */}
          {showStepIndicator && <StepIndicator />}

          {/* Formulario */}
          <div className="space-y-6">
            {renderStepContent()}

            {/* Botones de navegación */}
            <div className="flex items-center justify-between pt-6 border-t border-white/20 animate-in slide-in-from-bottom duration-500 delay-300">
              {showStepIndicator && currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onLoginRedirect}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                  disabled={isLoading}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>

                {showStepIndicator ? (
                  currentStep === steps.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !formData.acceptTerms}
                      className={cn(
                        "flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium",
                        "hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200 hover:scale-[0.98] active:scale-95",
                        "shadow-lg hover:shadow-xl"
                      )}
                    >
                      {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={cn(
                        "flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium",
                        "hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200 hover:scale-[0.98] active:scale-95",
                        "shadow-lg hover:shadow-xl"
                      )}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.acceptTerms}
                    className={cn(
                      "bg-white text-blue-600 px-8 py-3 rounded-lg font-medium",
                      "hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-200 hover:scale-[0.98] active:scale-95",
                      "shadow-lg hover:shadow-xl"
                    )}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-white/70 animate-in fade-in duration-500 delay-500">
            Al crear una cuenta, aceptas nuestros{' '}
            <a href="#" className="text-white underline hover:text-white/80">términos de servicio</a>{' '}
            y{' '}
            <a href="#" className="text-white underline hover:text-white/80">política de privacidad</a>.
          </div>
        </div>
      </div>

      {/* Gradiente adicional para mejor legibilidad */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </main>
  );
}