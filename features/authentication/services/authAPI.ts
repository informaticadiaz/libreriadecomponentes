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