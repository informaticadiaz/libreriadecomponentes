# Estructura Modular Login

## 📁 Estructura de Archivos

```folder
src/
├── components/
│   ├── ui/                          # Componentes shadcn/ui (ya existentes)
│   ├── layout/
│   │   └── AuthLayout/
│   │       ├── index.tsx
│   │       └── AuthLayout.module.css
│   ├── forms/
│   │   ├── LoginForm/
│   │   │   ├── index.tsx
│   │   │   ├── LoginForm.types.ts
│   │   │   └── LoginForm.module.css
│   │   ├── RegisterForm/
│   │   │   ├── index.tsx
│   │   │   ├── RegisterForm.types.ts
│   │   │   └── RegisterForm.module.css
│   │   └── ForgotPasswordForm/
│   │       ├── index.tsx
│   │       ├── ForgotPasswordForm.types.ts
│   │       └── ForgotPasswordForm.module.css
│   └── common/
│       ├── LanguageSelector/
│       │   ├── index.tsx
│       │   ├── LanguageSelector.types.ts
│       │   └── languages.ts
│       ├── UserTypeSelector/
│       │   ├── index.tsx
│       │   ├── UserTypeSelector.types.ts
│       │   └── userTypes.ts
│       ├── PasswordInput/
│       │   ├── index.tsx
│       │   └── PasswordInput.types.ts
│       └── AlertMessage/
│           ├── index.tsx
│           └── AlertMessage.types.ts
├── pages/
│   └── auth/
│       └── Login/
│           ├── index.tsx
│           ├── Login.types.ts
│           └── Login.module.css
├── features/
│   └── authentication/
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useLogin.ts
│       │   ├── useRegister.ts
│       │   └── useForgotPassword.ts
│       ├── services/
│       │   ├── authService.ts
│       │   └── authAPI.ts
│       ├── types/
│       │   ├── auth.types.ts
│       │   ├── login.types.ts
│       │   └── register.types.ts
│       └── constants/
│           └── authConstants.ts
├── types/
│   ├── auth.ts
│   └── common.ts
├── utils/
│   ├── validators/
│   │   ├── authValidators.ts
│   │   └── formValidators.ts
│   ├── constants.ts
│   └── helpers.ts
└── i18n/
    ├── locales/
    │   ├── es.json
    │   └── en.json
    └── i18n.config.ts
```

## 🔧 Implementación Modular

### 1. **Types & Interfaces**

```typescript
// src/features/authentication/types/auth.types.ts

// Interfaz simple para el usuario
export interface User {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
}

export interface LoginFormData {
  email: string;
  password: string;
  userType: UserType;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
}

export interface ForgotPasswordData {
  email: string;
}

export type UserType = 'buyer' | 'seller' | 'agent' | 'admin';
export type Language = 'es' | 'en';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### 2. **Custom Hooks**

```typescript
// src/features/authentication/hooks/useLogin.ts
import { useState } from 'react';
import { LoginFormData } from '../types/auth.types';
import { authService } from '../services/authService';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
```

### 3. **Services**

```typescript
// src/features/authentication/services/authService.ts
import { LoginFormData, RegisterFormData, ForgotPasswordData, User } from '../types/auth.types';
import { authAPI } from './authAPI';

export const authService = {
  async login(data: LoginFormData) {
    try {
      const response = await authAPI.login(data);
      
      // Guardar token en localStorage (en producción usar httpOnly cookies)
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterFormData) {
    try {
      const response = await authAPI.register(data);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async forgotPassword(data: ForgotPasswordData) {
    try {
      const response = await authAPI.forgotPassword(data);
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await authAPI.logout();
      
      // Limpiar datos locales
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Obtener usuario actual del localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Verificar si hay sesión activa
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
};
```

```typescript
// src/features/authentication/services/authAPI.ts
import { LoginFormData, RegisterFormData, ForgotPasswordData, User } from '../types/auth.types';

// Simulamos datos de usuarios para testing
const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    userType: 'buyer'
  },
  {
    id: '2', 
    fullName: 'María García',
    email: 'maria@ejemplo.com',
    userType: 'seller'
  }
];

// Simulamos delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  // Simular login
  async login(data: LoginFormData): Promise<{ user: User; token: string }> {
    await delay(1000); // Simular delay de red
    
    // Simular validación básica
    const user = mockUsers.find(u => u.email === data.email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Simular validación de contraseña (en producción sería más seguro)
    if (data.password !== '123456') {
      throw new Error('Contraseña incorrecta');
    }
    
    return {
      user,
      token: 'mock-jwt-token-12345'
    };
  },

  // Simular registro
  async register(data: RegisterFormData): Promise<{ user: User; message: string }> {
    await delay(1200);
    
    // Simular verificación de email existente
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      id: Date.now().toString(),
      fullName: data.fullName,
      email: data.email,
      userType: data.userType
    };
    
    // Agregar a la lista mock
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      message: 'Usuario registrado exitosamente'
    };
  },

  // Simular forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      throw new Error('Email no encontrado');
    }
    
    return {
      message: 'Enlace de recuperación enviado a tu correo'
    };
  },

  // Simular logout
  async logout(): Promise<void> {
    await delay(300);
    // En una app real, aquí invalidarías el token
    console.log('Usuario deslogueado');
  },

  // Simular verificación de token
  async verifyToken(token: string): Promise<User> {
    await delay(500);
    
    if (token === 'mock-jwt-token-12345') {
      return mockUsers[0]; // Retornar usuario mock
    }
    
    throw new Error('Token inválido');
  }
};
```

### 4. **Common Components**

```typescript
// src/components/common/LanguageSelector/index.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { Language } from '@/features/authentication/types/auth.types';
import { LanguageSelectorProps } from './LanguageSelector.types';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onValueChange,
  className = ""
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-24 h-8 ${className}`}>
        <Globe className="w-4 h-4 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">ES</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
};
```

### 5. **Form Components**

```typescript
// src/components/forms/LoginForm/index.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight } from 'lucide-react';
import { PasswordInput } from '@/components/common/PasswordInput';
import { UserTypeSelector } from '@/components/common/UserTypeSelector';
import { useLogin } from '@/features/authentication/hooks/useLogin';
import { LoginFormProps } from './LoginForm.types';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  translations,
  initialData
}) => {
  const { login, isLoading } = useLogin();
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async () => {
    try {
      await login(formData);
      onSubmit?.(formData);
    } catch (error) {
      // Error handling is managed by the hook
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{translations.email}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder={translations.email}
            className="pl-10"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <PasswordInput
        label={translations.password}
        placeholder={translations.password}
        value={formData.password}
        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
      />

      <UserTypeSelector
        value={formData.userType}
        onChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
        translations={translations}
      />

      <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? translations.loading : translations.login}
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
};
```

### 6. **Main Page Component**

```typescript
// src/pages/auth/Login/index.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { ForgotPasswordModal } from '@/components/forms/ForgotPasswordForm';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { AlertMessage } from '@/components/common/AlertMessage';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useTranslations } from '@/hooks/useTranslations';
import { LoginPageProps } from './Login.types';

export const LoginPage: React.FC<LoginPageProps> = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { isAuthenticated } = useAuth();
  const translations = useTranslations(currentLanguage);

  const handleLoginSuccess = () => {
    setSuccess(translations.loginSuccess);
    // Handle redirect logic
  };

  const handleRegisterSuccess = () => {
    setSuccess(translations.registerSuccess);
  };

  if (isAuthenticated) {
    // Redirect logic or show authenticated state
    return null;
  }

  return (
    <AuthLayout>
      <div className="absolute top-4 right-4">
        <LanguageSelector
          value={currentLanguage}
          onValueChange={setCurrentLanguage}
        />
      </div>
      
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {translations.title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {translations.subtitle}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <AlertMessage error={error} success={success} />

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{translations.login}</TabsTrigger>
              <TabsTrigger value="register">{translations.register}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4">
              <LoginForm
                onSubmit={handleLoginSuccess}
                translations={translations}
              />
              <div className="mt-4 text-center">
                <ForgotPasswordModal translations={translations} />
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="mt-4">
              <RegisterForm
                onSubmit={handleRegisterSuccess}
                translations={translations}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
```

### 7. **Internationalization**

```json
// src/i18n/locales/es.json
{
  "auth": {
    "title": "Bienvenido",
    "subtitle": "Encuentra tu hogar ideal",
    "login": "Iniciar Sesión",
    "register": "Registrarse",
    "email": "Correo Electrónico",
    "password": "Contraseña",
    "confirmPassword": "Confirmar Contraseña",
    "fullName": "Nombre Completo",
    "userType": "Tipo de Usuario",
    "buyer": "Comprador",
    "seller": "Vendedor",
    "agent": "Agente",
    "admin": "Administrador",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "loading": "Cargando...",
    "loginSuccess": "Inicio de sesión exitoso",
    "registerSuccess": "Registro exitoso. Por favor verifica tu correo."
  }
}
```

## 🎯 **Beneficios de esta Estructura:**

### ✅ **Modularidad**

- Cada componente tiene una responsabilidad específica
- Fácil mantenimiento y testing individual
- Reutilización de componentes entre páginas

### ✅ **Separación de Responsabilidades**

- Logic de negocio en hooks y services
- UI components separados de la lógica
- Types y interfaces centralizados

### ✅ **Escalabilidad**

- Estructura preparada para crecimiento
- Patrones consistentes para nuevas features
- Fácil integración de nuevos componentes

### ✅ **Testing**

- Cada componente se puede testear aisladamente
- Hooks separados para testing de lógica
- Mocking fácil de services

### ✅ **Mantenibilidad**

- Código organizado y predecible
- Cambios localizados sin efectos colaterales
- Documentación implícita por estructura

¿Te gustaría que implemente algún componente específico de esta estructura refactorizada o prefieres que pasemos a trabajar en otra interfaz de la arquitectura?
