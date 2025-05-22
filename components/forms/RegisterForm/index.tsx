// src/components/forms/RegisterForm/index.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { RegisterFormData, UserType } from '@/features/authentication/types/auth.types';
import { authService } from '@/features/authentication/services/authService';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  translations: any; // Simplificado por ahora
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  translations
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer'
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Validación básica
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      await authService.register(formData);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof RegisterFormData, value: string | UserType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Nombre Completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName">{translations?.fullName || 'Nombre Completo'}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="fullName"
            type="text"
            placeholder={translations?.fullName || 'Nombre Completo'}
            className="pl-10"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="registerEmail">{translations?.email || 'Email'}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="registerEmail"
            type="email"
            placeholder={translations?.email || 'Email'}
            className="pl-10"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />
        </div>
      </div>
      
      {/* Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="registerPassword">{translations?.password || 'Contraseña'}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="registerPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder={translations?.password || 'Contraseña'}
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
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

      {/* Confirmar Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{translations?.confirmPassword || 'Confirmar Contraseña'}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder={translations?.confirmPassword || 'Confirmar Contraseña'}
            className="pl-10"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Tipo de Usuario */}
      <div className="space-y-2">
        <Label htmlFor="userType">{translations?.userType || 'Tipo de Usuario'}</Label>
        <Select 
          value={formData.userType} 
          onValueChange={(value: UserType) => updateField('userType', value)}
        >
          <SelectTrigger>
            <User className="w-4 h-4 mr-2" />
            <SelectValue placeholder={translations?.userType || 'Tipo de Usuario'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">{translations?.buyer || 'Comprador'}</SelectItem>
            <SelectItem value="seller">{translations?.seller || 'Vendedor'}</SelectItem>
            <SelectItem value="agent">{translations?.agent || 'Agente'}</SelectItem>
            <SelectItem value="admin">{translations?.admin || 'Administrador'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botón de Registro */}
      <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? (translations?.loading || 'Cargando...') : (translations?.register || 'Registrarse')}
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
};