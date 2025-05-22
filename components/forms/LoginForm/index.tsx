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