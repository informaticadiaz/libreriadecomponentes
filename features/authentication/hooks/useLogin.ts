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