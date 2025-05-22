"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Globe, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

// Tipos de datos
interface LoginFormData {
  email: string;
  password: string;
  userType: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

interface ForgotPasswordData {
  email: string;
}

// Componente principal de la página de Login
const LoginPage = () => {
  // Estados principales
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para formularios
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    userType: 'buyer'
  });
  
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer'
  });
  
  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordData>({
    email: ''
  });

  // Configuración de idiomas
  const languages = {
    es: {
      title: 'Bienvenido',
      subtitle: 'Encuentra tu hogar ideal',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      fullName: 'Nombre Completo',
      userType: 'Tipo de Usuario',
      buyer: 'Comprador',
      seller: 'Vendedor',
      agent: 'Agente',
      admin: 'Administrador',
      forgotPassword: '¿Olvidaste tu contraseña?',
      dontHaveAccount: '¿No tienes cuenta?',
      alreadyHaveAccount: '¿Ya tienes cuenta?',
      signUp: 'Regístrate',
      signIn: 'Inicia Sesión',
      resetPassword: 'Restablecer Contraseña',
      sendResetLink: 'Enviar Enlace',
      enterEmail: 'Ingresa tu correo electrónico',
      resetDescription: 'Te enviaremos un enlace para restablecer tu contraseña',
      loading: 'Cargando...',
      loginSuccess: 'Inicio de sesión exitoso',
      registerSuccess: 'Registro exitoso. Por favor verifica tu correo.',
      resetSuccess: 'Enlace de restablecimiento enviado'
    },
    en: {
      title: 'Welcome',
      subtitle: 'Find your ideal home',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      userType: 'User Type',
      buyer: 'Buyer',
      seller: 'Seller',
      agent: 'Agent',
      admin: 'Administrator',
      forgotPassword: 'Forgot your password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      resetPassword: 'Reset Password',
      sendResetLink: 'Send Reset Link',
      enterEmail: 'Enter your email address',
      resetDescription: "We'll send you a link to reset your password",
      loading: 'Loading...',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful. Please verify your email.',
      resetSuccess: 'Reset link sent'
    }
  };

  const t = languages[currentLanguage as keyof typeof languages];

  // Componente Selector de Idioma
  const LanguageSelector = () => (
    <div className="absolute top-4 right-4">
      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
        <SelectTrigger className="w-24 h-8">
          <Globe className="w-4 h-4 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">ES</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Componente Selector de Tipo de Usuario
  const UserTypeSelector = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label htmlFor="userType">{t.userType}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <User className="w-4 h-4 mr-2" />
          <SelectValue placeholder={t.userType} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buyer">{t.buyer}</SelectItem>
          <SelectItem value="seller">{t.seller}</SelectItem>
          <SelectItem value="agent">{t.agent}</SelectItem>
          <SelectItem value="admin">{t.admin}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Manejadores de eventos
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría la lógica real de autenticación
      console.log('Login data:', loginData);
      
      setSuccess(t.loginSuccess);
      // Redirect logic here
    } catch {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Register data:', registerData);
      setSuccess(t.registerSuccess);
    } catch {
      setError('Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Forgot password:', forgotPasswordData);
      setSuccess(t.resetSuccess);
    } catch {
      setError('Error al enviar el enlace. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente del Formulario de Login
  const LoginForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t.email}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder={t.email}
            className="pl-10"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">{t.password}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t.password}
            className="pl-10 pr-10"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <UserTypeSelector
        value={loginData.userType}
        onChange={(value) => setLoginData({ ...loginData, userType: value })}
      />

      <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
        {isLoading ? t.loading : t.login}
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );

  // Componente del Formulario de Registro
  const RegisterForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t.fullName}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="fullName"
            type="text"
            placeholder={t.fullName}
            className="pl-10"
            value={registerData.fullName}
            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerEmail">{t.email}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="registerEmail"
            type="email"
            placeholder={t.email}
            className="pl-10"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerPassword">{t.password}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="registerPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder={t.password}
            className="pl-10 pr-10"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder={t.confirmPassword}
            className="pl-10"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            required
          />
        </div>
      </div>

      <UserTypeSelector
        value={registerData.userType}
        onChange={(value) => setRegisterData({ ...registerData, userType: value })}
      />

      <Button onClick={handleRegister} className="w-full" disabled={isLoading}>
        {isLoading ? t.loading : t.register}
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );

  // Modal de Recuperación de Contraseña
  const ForgotPasswordModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm">
          {t.forgotPassword}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.resetPassword}</DialogTitle>
          <DialogDescription>
            {t.resetDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgotEmail">{t.enterEmail}</Label>
            <Input
              id="forgotEmail"
              type="email"
              placeholder={t.email}
              value={forgotPasswordData.email}
              onChange={(e) => setForgotPasswordData({ email: e.target.value })}
              required
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleForgotPassword} disabled={isLoading}>
            {isLoading ? t.loading : t.sendResetLink}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <LanguageSelector />
      
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription className="text-gray-600">{t.subtitle}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t.login}</TabsTrigger>
              <TabsTrigger value="register">{t.register}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4">
              <LoginForm />
              <div className="mt-4 text-center">
                <ForgotPasswordModal />
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="mt-4">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;