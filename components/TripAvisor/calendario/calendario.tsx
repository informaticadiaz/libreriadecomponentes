"use client";
import React, { useState, useMemo, ReactNode, MouseEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  Calendar,
  Users,
  Home,
  Clock,
  DollarSign,
  Wrench,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Car,
  Filter,
  Download,
  Settings,
  LucideIcon,
  X
} from 'lucide-react';

// Definición de tipos e interfaces
interface Departamento {
  id: number;
  numero: number;
  capacidad: number;
  tipo: 'Standard' | 'Premium' | 'Premium Plus' | 'Económico';
  complejo: string;
}

interface Reserva {
  id: string;
  huesped: string;
  telefono: string;
  email: string;
  personas: number;
  checkIn?: string;
  checkOut: string;
  precio: number;
  notas?: string;
  vehiculo?: string | null;
}

type EstadoOcupacion = 'libre' | 'ocupado' | 'checkout' | 'limpieza' | 'mantenimiento' | 'bloqueado';

interface OcupacionDia {
  estado: EstadoOcupacion;
  reserva?: Reserva | null;
}

interface EstadoInfo {
  color: string;
  label: string;
}

interface Estadisticas {
  totalDepartamentos: number;
  ocupados: number;
  libres: number;
  limpieza: number;
  checkouts: number;
  ingresosDia: number;
}

type VistaSeleccionada = 'semana' | 'mes';

// Props para componentes UI simulados
interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

interface ProgressProps {
  value?: number;
  className?: string;
}

interface TabsProps {
  children: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

// Interfaces extendidas para los componentes Tabs
interface TabsChildProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

// Componentes UI simulados con tipos
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  onClick, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants: Record<ButtonVariant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-blue-600 underline-offset-4 hover:underline"
  };
  
  const sizes: Record<ButtonSize, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div 
      className="h-full w-full flex-1 bg-blue-600 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);

const Tabs: React.FC<TabsProps> = ({ children, value, onValueChange, className = "" }) => (
  <div className={className}>
    {React.Children.map(children, child => 
      React.isValidElement<TabsChildProps>(child) ? React.cloneElement(child, { 
        activeTab: value, 
        onTabChange: onValueChange 
      }) : child
    )}
  </div>
);

const TabsList: React.FC<TabsListProps> = ({ children, activeTab, onTabChange }) => (
  <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
    {React.Children.map(children, child =>
      React.isValidElement<TabsChildProps>(child) ? React.cloneElement(child, { 
        activeTab, 
        onTabChange 
      }) : child
    )}
  </div>
);

const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, activeTab, onTabChange }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value 
        ? 'bg-white text-gray-900 shadow-sm' 
        : 'hover:bg-white/50'
    }`}
    onClick={() => onTabChange && onTabChange(value)}
  >
    {children}
  </button>
);

// Datos tipados
const departamentos: Departamento[] = [
  { id: 1, numero: 101, capacidad: 4, tipo: 'Standard', complejo: 'Complejo A' },
  { id: 2, numero: 102, capacidad: 6, tipo: 'Premium', complejo: 'Complejo A' },
  { id: 3, numero: 103, capacidad: 2, tipo: 'Standard', complejo: 'Complejo A' },
  { id: 4, numero: 201, capacidad: 4, tipo: 'Standard', complejo: 'Complejo B' },
  { id: 5, numero: 202, capacidad: 8, tipo: 'Premium Plus', complejo: 'Complejo B' },
  { id: 6, numero: 203, capacidad: 4, tipo: 'Standard', complejo: 'Complejo B' },
  { id: 7, numero: 301, capacidad: 6, tipo: 'Premium', complejo: 'Complejo C' },
  { id: 8, numero: 302, capacidad: 2, tipo: 'Económico', complejo: 'Complejo C' },
];

const estados: Record<EstadoOcupacion, EstadoInfo> = {
  libre: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Libre' },
  ocupado: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Ocupado' },
  checkout: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Check-out' },
  limpieza: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Limpieza' },
  mantenimiento: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Mantenimiento' },
  bloqueado: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Bloqueado' }
};

const SistemaGestionOcupacion: React.FC = () => {
  const [fechaSeleccionada] = useState<Date>(new Date());
  const [vistaSeleccionada, setVistaSeleccionada] = useState<VistaSeleccionada>('semana');
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);

  // Generar fechas para la vista
  const fechasVista: Date[] = useMemo(() => {
    const fechas: Date[] = [];
    const inicio = new Date(fechaSeleccionada);
    const dias = vistaSeleccionada === 'semana' ? 7 : 14;
    
    for (let i = 0; i < dias; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);
      fechas.push(fecha);
    }
    return fechas;
  }, [fechaSeleccionada, vistaSeleccionada]);

  // Datos simulados de ocupación
  const ocupacion: Record<number, Record<string, OcupacionDia>> = useMemo(() => {
    const data: Record<number, Record<string, OcupacionDia>> = {};
    departamentos.forEach(depto => {
      data[depto.id] = {};
      fechasVista.forEach((fecha, index) => {
        const random = Math.random();
        let estado: EstadoOcupacion;
        let reserva: Reserva | null = null;
        
        if (random < 0.6) {
          estado = 'ocupado';
          reserva = {
            id: `res_${depto.id}_${index}`,
            huesped: `Familia ${['Pérez', 'González', 'Martín', 'López'][Math.floor(Math.random() * 4)]}`,
            telefono: '+54 9 11 1234-5678',
            email: 'familia@email.com',
            personas: Math.min(depto.capacidad, Math.floor(Math.random() * 4) + 1),
            checkIn: '15:00',
            checkOut: '11:00',
            precio: depto.capacidad * 15000 + Math.floor(Math.random() * 5000),
            notas: 'Llegada tarde confirmada',
            vehiculo: ['ABC123', 'XYZ456', null][Math.floor(Math.random() * 3)]
          };
        } else if (random < 0.7) {
          estado = 'libre';
        } else if (random < 0.8) {
          estado = 'limpieza';
        } else if (random < 0.9) {
          estado = 'checkout';
          reserva = {
            id: `res_${depto.id}_${index}`,
            huesped: 'Familia Rodríguez',
            telefono: '+54 9 11 9876-5432',
            email: 'rodriguez@email.com',
            personas: 3,
            checkOut: '11:00',
            precio: 45000
          };
        } else {
          estado = Math.random() < 0.5 ? 'mantenimiento' : 'bloqueado';
        }
        
        data[depto.id][fecha.toDateString()] = { estado, reserva };
      });
    });
    return data;
  }, [fechasVista]);

  // Estadísticas del día
  const estadisticasHoy: Estadisticas = useMemo(() => {
    const hoy = new Date().toDateString();
    const stats: Estadisticas = {
      totalDepartamentos: departamentos.length,
      ocupados: 0,
      libres: 0,
      limpieza: 0,
      checkouts: 0,
      ingresosDia: 0
    };

    departamentos.forEach(depto => {
      const estadoHoy = ocupacion[depto.id]?.[hoy];
      if (estadoHoy) {
        if (estadoHoy.estado === 'ocupado') stats.ocupados++;
        else if (estadoHoy.estado === 'libre') stats.libres++;
        else if (estadoHoy.estado === 'limpieza') stats.limpieza++;
        else if (estadoHoy.estado === 'checkout') stats.checkouts++;
        
        if (estadoHoy.reserva?.precio) {
          stats.ingresosDia += estadoHoy.reserva.precio;
        }
      }
    });

    return stats;
  }, [ocupacion]);

  const abrirDetalleReserva = (reserva: Reserva): void => {
    setReservaSeleccionada(reserva);
    setModalAbierto(true);
  };

  const formatearFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-AR', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const obtenerIconoEstado = (estado: EstadoOcupacion): React.ReactElement => {
    const IconComponent: LucideIcon = (() => {
      switch (estado) {
        case 'libre': return CheckCircle;
        case 'ocupado': return Users;
        case 'checkout': return Clock;
        case 'limpieza': return Sparkles;
        case 'mantenimiento': return Wrench;
        case 'bloqueado': return AlertTriangle;
        default: return Home;
      }
    })();

    return <IconComponent className="w-4 h-4" />;
  };

  const handleVistaChange = (value: string): void => {
    setVistaSeleccionada(value as VistaSeleccionada);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Mar de Cobo PMS</h1>
            <p className="text-slate-600 mt-1">Sistema de Gestión de Ocupación Hotelera</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs value={vistaSeleccionada} onValueChange={handleVistaChange}>
              <TabsList>
                <TabsTrigger value="semana">Vista Semanal</TabsTrigger>
                <TabsTrigger value="mes">Vista Extendida</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Ocupados</p>
                  <p className="text-3xl font-bold text-blue-600">{estadisticasHoy.ocupados}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={(estadisticasHoy.ocupados / estadisticasHoy.totalDepartamentos) * 100} className="mt-3" />
              <p className="text-xs text-slate-500 mt-2">
                {Math.round((estadisticasHoy.ocupados / estadisticasHoy.totalDepartamentos) * 100)}% ocupación
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600">{estadisticasHoy.libres}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={(estadisticasHoy.libres / estadisticasHoy.totalDepartamentos) * 100} className="mt-3" />
              <p className="text-xs text-slate-500 mt-2">Listos para reservar</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Check-outs</p>
                  <p className="text-3xl font-bold text-amber-600">{estadisticasHoy.checkouts}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-xs text-slate-500 mt-4">Salidas programadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Limpieza</p>
                  <p className="text-3xl font-bold text-purple-600">{estadisticasHoy.limpieza}</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-slate-500 mt-4">En proceso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Ingresos Hoy</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${estadisticasHoy.ingresosDia.toLocaleString('es-AR')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-500 mt-4">Revenue diario</p>
            </CardContent>
          </Card>
        </div>

        {/* Grilla de ocupación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Grilla de Ocupación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header de fechas */}
                <div className="grid gap-2 mb-4" 
                     style={{ 
                       gridTemplateColumns: `180px repeat(${fechasVista.length}, minmax(80px, 1fr))` 
                     }}>
                  <div className="font-semibold text-center p-3 bg-slate-100 rounded-lg">
                    Departamento
                  </div>
                  {fechasVista.map((fecha, index) => (
                    <div key={index} 
                         className="font-semibold text-center p-3 bg-slate-100 rounded-lg text-sm">
                      {formatearFecha(fecha)}
                    </div>
                  ))}
                </div>

                {/* Filas de departamentos */}
                {departamentos.map((depto) => (
                  <div key={depto.id} 
                       className="grid gap-2 mb-2"
                       style={{ 
                         gridTemplateColumns: `180px repeat(${fechasVista.length}, minmax(80px, 1fr))` 
                       }}>
                    {/* Info del departamento */}
                    <div className="p-4 bg-white border-2 border-slate-200 rounded-lg">
                      <div className="font-bold text-lg">{depto.numero}</div>
                      <div className="text-sm text-slate-600">{depto.tipo}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {depto.capacidad}p
                      </div>
                    </div>

                    {/* Celdas de ocupación */}
                    {fechasVista.map((fecha) => {
                      const fechaKey = fecha.toDateString();
                      const ocupacionDia = ocupacion[depto.id]?.[fechaKey];
                      const estadoInfo = estados[ocupacionDia?.estado] || estados.libre;

                      return (
                        <div
                          key={fechaKey}
                          className={`p-3 rounded-lg border-2 cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-md ${estadoInfo.color} ${
                            ocupacionDia?.reserva ? 'cursor-pointer' : ''
                          }`}
                          onClick={() => ocupacionDia?.reserva && abrirDetalleReserva(ocupacionDia.reserva)}
                          title={`${depto.numero} - ${estadoInfo.label}${ocupacionDia?.reserva ? ` - ${ocupacionDia.reserva.huesped}` : ''}`}
                        >
                          <div className="flex items-center justify-center h-12 relative">
                            {obtenerIconoEstado(ocupacionDia?.estado || 'libre')}
                            {ocupacionDia?.reserva && (
                              <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
                                {ocupacionDia.reserva.personas}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="font-semibold mb-4 text-slate-800">Leyenda de Estados</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {(Object.entries(estados) as [EstadoOcupacion, EstadoInfo][]).map(([key, estado]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${estado.color}`}>
                      {obtenerIconoEstado(key)}
                    </div>
                    <span className="text-sm font-medium">{estado.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividades del día */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Check-outs de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departamentos
                  .filter(depto => {
                    const hoy = new Date().toDateString();
                    return ocupacion[depto.id]?.[hoy]?.estado === 'checkout';
                  })
                  .map(depto => {
                    const hoy = new Date().toDateString();
                    const reserva = ocupacion[depto.id][hoy].reserva!;
                    return (
                      <div key={depto.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold text-lg">Depto {depto.numero}</div>
                          <div className="text-slate-600">{reserva.huesped}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3" />
                            {reserva.personas} personas
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-amber-700 text-lg">{reserva.checkOut}</div>
                          <Button size="sm" variant="outline" className="mt-2">
                            Gestionar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {departamentos.filter(depto => {
                  const hoy = new Date().toDateString();
                  return ocupacion[depto.id]?.[hoy]?.estado === 'checkout';
                }).length === 0 && (
                  <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p>No hay check-outs programados para hoy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Tareas Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departamentos
                  .filter(depto => {
                    const hoy = new Date().toDateString();
                    const estado = ocupacion[depto.id]?.[hoy]?.estado;
                    return estado === 'limpieza' || estado === 'mantenimiento';
                  })
                  .map(depto => {
                    const hoy = new Date().toDateString();
                    const estado = ocupacion[depto.id][hoy].estado;
                    const estadoInfo = estados[estado];
                    const esLimpieza = estado === 'limpieza';
                    return (
                      <div key={depto.id} className={`flex items-center justify-between p-4 border-2 rounded-lg ${estadoInfo.color}`}>
                        <div className="flex items-center gap-3">
                          {esLimpieza ? <Sparkles className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                          <div>
                            <div className="font-semibold">Depto {depto.numero}</div>
                            <div className="text-sm">
                              {esLimpieza ? 'Limpieza pendiente' : 'Requiere mantenimiento'}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Asignar
                        </Button>
                      </div>
                    );
                  })}
                {departamentos.filter(depto => {
                  const hoy = new Date().toDateString();
                  const estado = ocupacion[depto.id]?.[hoy]?.estado;
                  return estado === 'limpieza' || estado === 'mantenimiento';
                }).length === 0 && (
                  <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p>No hay tareas pendientes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de detalle de reserva con Radix UI */}
      <Dialog.Root open={modalAbierto} onOpenChange={setModalAbierto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg border max-h-[90vh] overflow-y-auto">
            
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Detalle de Reserva
              </Dialog.Title>
              {reservaSeleccionada && (
                <Dialog.Description className="text-sm text-slate-600">
                  Reserva #{reservaSeleccionada.id}
                </Dialog.Description>
              )}
            </div>
            
            {reservaSeleccionada && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 border-b pb-2">Información del Huésped</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">{reservaSeleccionada.huesped}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>{reservaSeleccionada.telefono}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>{reservaSeleccionada.email}</span>
                      </div>
                      {reservaSeleccionada.vehiculo && (
                        <div className="flex items-center gap-3">
                          <Car className="w-4 h-4 text-slate-500" />
                          <span>Vehículo: {reservaSeleccionada.vehiculo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 border-b pb-2">Detalles de la Estadía</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>{reservaSeleccionada.personas} personas</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Check-in: {reservaSeleccionada.checkIn || 'No especificado'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Check-out: {reservaSeleccionada.checkOut}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-emerald-600">
                          ${reservaSeleccionada.precio.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {reservaSeleccionada.notas && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800">Notas Especiales</h4>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border">
                      {reservaSeleccionada.notas}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setModalAbierto(false)} className="flex-1">
                    Cerrar
                  </Button>
                  <Button className="flex-1">
                    Editar Reserva
                  </Button>
                </div>
              </div>
            )}
            
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
            
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default SistemaGestionOcupacion;