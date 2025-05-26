"use client";
import React, { useState } from 'react';
import { Play, Star, CheckCircle, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VideoLandingPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Registro:', formData);
    // Aquí iría la lógica de registro
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Hero Section con Video */}
      <section className="relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27%23ffffff%27 opacity=%270.02%27%3e%3cpath d=%27m0 .5 32 32M32 .5 0 32%27/%3e%3c/svg%3e')] bg-[length:60px_60px]" />
        <div 
          className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--blur-purple)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--blur-blue)' }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido principal */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-accent/50 border border-border rounded-full px-4 py-2 text-sm text-accent-foreground backdrop-blur-sm">
                  <Star className="w-4 h-4 text-[var(--chart-4)] fill-current" />
                  <span>Más de 10,000 usuarios activos</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Transforma tu
                  <span 
                    className="bg-gradient-to-r bg-clip-text text-transparent ml-3"
                    style={{ 
                      backgroundImage: 'linear-gradient(to right, var(--gradient-from), var(--gradient-to))' 
                    }}
                  >
                    experiencia digital
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Descubre cómo nuestra plataforma revoluciona la forma en que trabajas. 
                  Mira el video y únete a miles de usuarios satisfechos.
                </p>
              </div>

              {/* Características destacadas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Interfaz intuitiva',
                  'Resultados en tiempo real',
                  'Seguridad garantizada',
                  'Soporte 24/7'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA secundario */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-semibold">
                  Comenzar gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="font-medium">
                  Ver demo
                </Button>
              </div>
            </div>

            {/* Video principal */}
            <div className="relative">
              <div className="relative bg-card/50 backdrop-blur rounded-2xl overflow-hidden border border-border">
                {!isPlaying ? (
                  <div 
                    className="aspect-video flex items-center justify-center bg-gradient-to-br from-card to-muted relative group cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ backgroundColor: 'var(--overlay)' }}
                    />
                    <Button 
                      size="lg" 
                      className="relative z-10 backdrop-blur border text-foreground transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: 'var(--glass)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <Play className="w-6 h-6 mr-2 fill-current" />
                      Reproducir video
                    </Button>
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-card flex items-center justify-center">
                    <p className="text-foreground">Aquí iría tu video embebido</p>
                  </div>
                )}
              </div>
              
              {/* Elementos decorativos alrededor del video */}
              <div 
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-xl opacity-60"
                style={{ 
                  background: 'linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))' 
                }}
              />
              <div 
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-xl opacity-40"
                style={{ 
                  background: 'linear-gradient(to bottom right, var(--chart-2), var(--chart-1))' 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sistema de Registro */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="bg-card/50 backdrop-blur border border-border">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Únete a la revolución
                </CardTitle>
                <p className="text-muted-foreground">
                  Crea tu cuenta gratuita y comienza hoy mismo
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        name="password"
                        placeholder="Contraseña segura"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmit}
                    className="w-full font-semibold text-primary-foreground"
                    size="lg"
                    style={{
                      background: 'linear-gradient(to right, var(--gradient-from), var(--gradient-to))'
                    }}
                  >
                    Crear cuenta gratuita
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <a 
                      href="#" 
                      className="font-medium hover:underline"
                      style={{ color: 'var(--gradient-from)' }}
                    >
                      Inicia sesión
                    </a>
                  </p>
                </div>
                
                {/* Garantías */}
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 text-[var(--success)] mx-auto mb-1" />
                      <span>100% Gratuito</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 text-[var(--success)] mx-auto mb-1" />
                      <span>Sin spam</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer decorativo */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Tu Empresa. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VideoLandingPage;