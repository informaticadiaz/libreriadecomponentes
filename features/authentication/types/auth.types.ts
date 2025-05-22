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