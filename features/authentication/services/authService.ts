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