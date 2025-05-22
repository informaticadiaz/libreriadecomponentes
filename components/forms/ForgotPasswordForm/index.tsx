// src/components/forms/ForgotPasswordForm/index.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { ForgotPasswordData } from '@/features/authentication/types/auth.types';
import { authService } from '@/features/authentication/services/authService';

interface ForgotPasswordModalProps {
  translations: any; // Simplificado por ahora
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  translations,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: ''
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      await authService.forgotPassword(formData);
      onSuccess?.();
      setIsOpen(false); // Cerrar modal al completar
      setFormData({ email: '' }); // Limpiar formulario
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar enlace';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ email: '' }); // Limpiar al cerrar
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm">
          {translations?.forgotPassword || '¿Olvidaste tu contraseña?'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {translations?.resetPassword || 'Restablecer Contraseña'}
          </DialogTitle>
          <DialogDescription>
            {translations?.resetDescription || 'Te enviaremos un enlace para restablecer tu contraseña'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgotEmail">
              {translations?.enterEmail || 'Ingresa tu correo electrónico'}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="forgotEmail"
                type="email"
                placeholder={translations?.email || 'Email'}
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            {translations?.cancel || 'Cancelar'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !formData.email.trim()}
          >
            {isLoading 
              ? (translations?.loading || 'Enviando...') 
              : (translations?.sendResetLink || 'Enviar Enlace')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// También exportamos un componente simple sin modal para otros usos
export const ForgotPasswordForm: React.FC<{
  onSubmit?: (data: ForgotPasswordData) => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  translations: any;
}> = ({ onSubmit, onSuccess, onError, translations }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: ''
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        await authService.forgotPassword(formData);
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar enlace';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgotEmail">
          {translations?.enterEmail || 'Ingresa tu correo electrónico'}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="forgotEmail"
            type="email"
            placeholder={translations?.email || 'Email'}
            className="pl-10"
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isLoading || !formData.email.trim()}
      >
        {isLoading 
          ? (translations?.loading || 'Enviando...') 
          : (translations?.sendResetLink || 'Enviar Enlace')
        }
      </Button>
    </div>
  );
};