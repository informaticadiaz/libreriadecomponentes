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