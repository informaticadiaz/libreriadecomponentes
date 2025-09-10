"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  Send,
  Eye,
  MoreVertical,
  Users,
  Gift,
  Crown,
  Star,
  Trophy,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

// Tipos básicos
type InvoiceStatus = 'paid' | 'sent' | 'viewed' | 'overdue' | 'draft';
type ServiceFrequency = 'monthly' | 'one_time';
type ServiceCategory = 'package' | 'training' | 'nutrition' | 'consultation';
type DiscountType = 'percentage' | 'fixed';
type ChangeType = 'positive' | 'negative';

// Interfaces para los datos
interface RevenueStats {
  monthlyRevenue: number;
  monthlyGrowth: number;
  totalClients: number;
  activeSubscriptions: number;
  pendingInvoices: number;
  overdueAmount: number;
  averageClientValue: number;
  totalRevenue: number;
}

interface MonthlyRevenueData {
  month: string;
  revenue: number;
  target: number;
  clients: number;
}

interface ServiceDistribution {
  name: string;
  value: number;
  color: string;
  revenue: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  frequency: ServiceFrequency;
  activeSubscriptions: number;
  totalRevenue: number;
  category: ServiceCategory;
  features: string[];
}

interface Invoice {
  id: string;
  clientName: string;
  clientAvatar: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  service: string;
}

interface UpcomingPayment {
  clientName: string;
  avatar: string;
  amount: number;
  date: string;
  service: string;
  daysLeft: number;
}

interface Discount {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  validUntil: string;
}

// Props para componentes
interface RevenueCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: ChangeType;
  color?: 'profit' | 'growth' | 'warning' | 'power';
}

interface ServiceCardProps {
  service: Service;
}

interface InvoiceRowProps {
  invoice: Invoice;
}

interface UpcomingPaymentCardProps {
  payment: UpcomingPayment;
}

interface DiscountCardProps {
  discount: Discount;
}

// Datos hardcodeados
const revenueStats: RevenueStats = {
  monthlyRevenue: 156750,
  monthlyGrowth: 12.5,
  totalClients: 28,
  activeSubscriptions: 25,
  pendingInvoices: 3,
  overdueAmount: 15600,
  averageClientValue: 5598,
  totalRevenue: 623450
};

const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: 'Ene', revenue: 89500, target: 100000, clients: 18 },
  { month: 'Feb', revenue: 92300, target: 105000, clients: 20 },
  { month: 'Mar', revenue: 108700, target: 110000, clients: 22 },
  { month: 'Abr', revenue: 125400, target: 115000, clients: 24 },
  { month: 'May', revenue: 139200, target: 120000, clients: 26 },
  { month: 'Jun', revenue: 156750, target: 125000, clients: 28 }
];

const serviceDistribution: ServiceDistribution[] = [
  { name: 'Plan Integral', value: 45, color: '#3b82f6', revenue: 67500 },
  { name: 'Solo Entrenamiento', value: 30, color: '#10b981', revenue: 45000 },
  { name: 'Solo Nutrición', value: 15, color: '#f59e0b', revenue: 22500 },
  { name: 'Consultas', value: 10, color: '#ef4444', revenue: 15000 }
];

const services: Service[] = [
  {
    id: 1,
    name: "Plan Integral Mensual",
    description: "Entrenamiento + Nutrición + Seguimiento completo",
    price: 45000,
    currency: "ARS",
    frequency: "monthly",
    activeSubscriptions: 12,
    totalRevenue: 540000,
    category: "package",
    features: ["Rutinas personalizadas", "Plan nutricional", "Seguimiento semanal", "Chat directo", "App personalizada"]
  },
  {
    id: 2,
    name: "Solo Entrenamiento",
    description: "Rutinas personalizadas sin plan nutricional",
    price: 25000,
    currency: "ARS", 
    frequency: "monthly",
    activeSubscriptions: 8,
    totalRevenue: 200000,
    category: "training",
    features: ["Rutinas personalizadas", "Seguimiento de progreso", "Chat directo"]
  },
  {
    id: 3,
    name: "Plan Nutricional",
    description: "Plan nutricional personalizado con seguimiento",
    price: 20000,
    currency: "ARS",
    frequency: "monthly", 
    activeSubscriptions: 4,
    totalRevenue: 80000,
    category: "nutrition",
    features: ["Plan nutricional personalizado", "Recetas saludables", "Seguimiento semanal"]
  },
  {
    id: 4,
    name: "Consulta Individual",
    description: "Consulta única para evaluación y plan inicial",
    price: 8000,
    currency: "ARS",
    frequency: "one_time",
    activeSubscriptions: 1,
    totalRevenue: 24000,
    category: "consultation",
    features: ["Evaluación completa", "Plan inicial", "Recomendaciones"]
  }
];

const invoices: Invoice[] = [
  {
    id: "INV-2024-001",
    clientName: "María González",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b2e57004?w=40&h=40&fit=crop&crop=face",
    amount: 45000,
    currency: "ARS",
    status: "paid",
    issuedDate: "2024-06-01",
    dueDate: "2024-06-15",
    paidDate: "2024-06-10",
    service: "Plan Integral Mensual"
  },
  {
    id: "INV-2024-002", 
    clientName: "Carlos Ruiz",
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    amount: 25000,
    currency: "ARS",
    status: "sent",
    issuedDate: "2024-06-05",
    dueDate: "2024-06-20",
    service: "Solo Entrenamiento"
  },
  {
    id: "INV-2024-003",
    clientName: "Ana López",
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", 
    amount: 20000,
    currency: "ARS",
    status: "viewed",
    issuedDate: "2024-06-08",
    dueDate: "2024-06-23",
    service: "Plan Nutricional"
  },
  {
    id: "INV-2024-004",
    clientName: "Diego Fernández",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    amount: 45000,
    currency: "ARS", 
    status: "overdue",
    issuedDate: "2024-05-20",
    dueDate: "2024-06-05",
    service: "Plan Integral Mensual"
  },
  {
    id: "INV-2024-005",
    clientName: "Laura Martín",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b2e57004?w=40&h=40&fit=crop&crop=face",
    amount: 8000,
    currency: "ARS",
    status: "draft",
    issuedDate: "2024-06-15",
    dueDate: "2024-06-30",
    service: "Consulta Individual"
  }
];

const upcomingPayments: UpcomingPayment[] = [
  {
    clientName: "María González",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e57004?w=40&h=40&fit=crop&crop=face",
    amount: 45000,
    date: "2024-07-01",
    service: "Plan Integral",
    daysLeft: 3
  },
  {
    clientName: "Carlos Ruiz", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    amount: 25000,
    date: "2024-07-05",
    service: "Solo Entrenamiento",
    daysLeft: 7
  },
  {
    clientName: "Ana López",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    amount: 20000,
    date: "2024-07-08",
    service: "Plan Nutricional", 
    daysLeft: 10
  }
];

const discounts: Discount[] = [
  {
    id: 1,
    code: "PRIMERA_SEMANA",
    name: "Descuento Primera Semana",
    description: "20% de descuento para nuevos clientes",
    discountType: "percentage",
    discountValue: 20,
    maxUses: 50,
    currentUses: 12,
    isActive: true,
    validUntil: "2024-12-31"
  },
  {
    id: 2,
    code: "VERANO2024",
    name: "Promoción Verano",
    description: "Descuento fijo de $5000 en planes integrales",
    discountType: "fixed",
    discountValue: 5000,
    maxUses: 20,
    currentUses: 8,
    isActive: true,
    validUntil: "2024-08-31"
  }
];

export default function BillingModuleDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getStatusConfig = (status: InvoiceStatus) => {
    const configs = {
      paid: { 
        color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white', 
        text: 'PAGADA',
        icon: CheckCircle 
      },
      sent: { 
        color: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white', 
        text: 'ENVIADA',
        icon: Send 
      },
      viewed: { 
        color: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white', 
        text: 'VISTA',
        icon: Eye 
      },
      overdue: { 
        color: 'bg-gradient-to-r from-red-500 to-red-700 text-white', 
        text: 'VENCIDA',
        icon: AlertCircle 
      },
      draft: { 
        color: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white', 
        text: 'BORRADOR',
        icon: FileText 
      }
    };
    return configs[status];
  };

  const RevenueCard = ({ icon: Icon, title, value, subtitle, change, changeType, color = "profit" }: RevenueCardProps) => {
    const getColorClasses = (color: string) => {
      const colors = {
        profit: 'from-green-600 to-emerald-600 shadow-green-500/25',
        growth: 'from-blue-600 to-cyan-600 shadow-blue-500/25',
        warning: 'from-orange-600 to-red-600 shadow-orange-500/25',
        power: 'from-purple-600 to-pink-600 shadow-purple-500/25'
      };
      return colors[color as keyof typeof colors] || colors.profit;
    };

    return (
      <Card className="relative overflow-hidden bg-gradient-to-br border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(color)} opacity-90`} />
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="relative p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <Icon className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight drop-shadow-lg">{value}</p>
                <p className="text-sm font-bold text-white/90 uppercase tracking-wide">{title}</p>
                {subtitle && <p className="text-xs text-white/80 font-medium">{subtitle}</p>}
              </div>
            </div>
            {change && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm ${changeType === 'positive' ? 'text-white' : 'text-white'}`}>
                {changeType === 'positive' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-black text-sm">{change}</span>
              </div>
            )}
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <Icon className="h-24 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const ServiceCard = ({ service }: ServiceCardProps) => {
    const utilizationPercentage: number = (service.activeSubscriptions / revenueStats.totalClients) * 100;
    
    return (
      <Card className="relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 hover:scale-102 group border-2 border-transparent hover:border-red-500">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="relative p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <h3 className="font-black text-xl text-gray-900 group-hover:text-red-600 transition-colors duration-200 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 font-medium mb-4">{service.description}</p>
              
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 group-hover:from-green-500/20 group-hover:to-emerald-600/20 transition-all duration-300">
                  <p className="text-2xl font-black text-green-600">{formatCurrency(service.price)}</p>
                  <p className="text-xs text-green-700 uppercase font-bold tracking-wide">
                    {service.frequency === 'monthly' ? 'MENSUAL' : 'ÚNICA VEZ'}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300">
                  <p className="text-2xl font-black text-blue-600">{service.activeSubscriptions}</p>
                  <p className="text-xs text-blue-700 uppercase font-bold tracking-wide">ACTIVOS</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all duration-300">
                  <p className="text-2xl font-black text-purple-600">{Math.round(utilizationPercentage)}%</p>
                  <p className="text-xs text-purple-700 uppercase font-bold tracking-wide">ADOPCIÓN</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">INGRESOS GENERADOS</span>
                  <span className="font-black text-green-600">{formatCurrency(service.totalRevenue)}</span>
                </div>
                <Progress value={utilizationPercentage} className="h-3 bg-gray-200" />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {service.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-xs font-bold border-0">
                    {feature}
                  </Badge>
                ))}
                {service.features.length > 3 && (
                  <Badge variant="outline" className="text-xs border-2 border-red-500 text-red-600 font-bold">
                    +{service.features.length - 3} MÁS
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black border-0 transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              NUEVO CLIENTE
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InvoiceRow = ({ invoice }: InvoiceRowProps) => {
    const statusConfig = getStatusConfig(invoice.status);
    const StatusIcon = statusConfig.icon;

    return (
      <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-200">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900">
              <AvatarImage src={invoice.clientAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold">
                {invoice.clientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-black text-white">{invoice.clientName}</p>
              <p className="text-sm text-gray-400 font-bold">{invoice.id}</p>
            </div>
          </div>
        </td>
        <td className="p-4">
          <p className="font-black text-white">{invoice.service}</p>
          <p className="text-sm text-green-400 font-bold">{formatCurrency(invoice.amount)}</p>
        </td>
        <td className="p-4">
          <Badge className={`${statusConfig.color} font-bold text-xs px-3 py-1 flex items-center gap-1 border-0 shadow-lg w-fit`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.text}
          </Badge>
        </td>
        <td className="p-4">
          <p className="text-sm font-bold text-white">{new Date(invoice.dueDate).toLocaleDateString('es-ES')}</p>
          {invoice.status === 'overdue' && (
            <p className="text-xs text-red-400 font-bold">VENCIDA HACE {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} DÍAS</p>
          )}
        </td>
        <td className="p-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500 transition-all duration-300">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500 transition-all duration-300">
              <Download className="h-3 w-3" />
            </Button>
            {invoice.status !== 'paid' && (
              <Button size="sm" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0">
                <Send className="h-3 w-3" />
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const UpcomingPaymentCard = ({ payment }: UpcomingPaymentCardProps) => (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 group border-2 border-transparent hover:border-green-500 bg-gradient-to-br from-gray-800 to-gray-900">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900">
              <AvatarImage src={payment.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
                {payment.clientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-black text-white group-hover:text-green-400 transition-colors duration-200">{payment.clientName}</p>
              <p className="text-xs text-gray-400 font-bold">{payment.service}</p>
            </div>
          </div>
          <Badge className={`font-bold text-xs px-3 py-1 ${payment.daysLeft <= 3 ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : payment.daysLeft <= 7 ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"} border-0`}>
            {payment.daysLeft} DÍAS
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-black text-2xl text-green-400">{formatCurrency(payment.amount)}</span>
          <span className="text-sm text-gray-400 font-bold">{new Date(payment.date).toLocaleDateString('es-ES')}</span>
        </div>
      </CardContent>
    </Card>
  );

  const DiscountCard = ({ discount }: DiscountCardProps) => (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:scale-105 group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-black text-white group-hover:text-yellow-400 transition-colors duration-200">{discount.name}</h3>
            <p className="text-sm text-gray-400 font-medium">{discount.description}</p>
          </div>
          <Badge className={`font-bold text-xs px-3 py-1 ${discount.isActive ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gradient-to-r from-gray-500 to-gray-700 text-white"} border-0`}>
            {discount.isActive ? "ACTIVO" : "INACTIVO"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">CÓDIGO</p>
            <p className="font-mono text-sm font-black text-yellow-400">{discount.code}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">DESCUENTO</p>
            <p className="font-black text-green-400">
              {discount.discountType === 'percentage' ? `${discount.discountValue}%` : formatCurrency(discount.discountValue)}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300 font-bold">USOS: {discount.currentUses}/{discount.maxUses}</span>
            <span className="text-gray-300 font-bold">VÁLIDO: {new Date(discount.validUntil).toLocaleDateString('es-ES')}</span>
          </div>
          <Progress value={(discount.currentUses / discount.maxUses) * 100} className="h-3 bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-700 to-green-800 rounded-2xl border-0 shadow-2xl">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -right-10 -top-10 opacity-10">
            <DollarSign className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">CENTRO FINANCIERO</h1>
                <p className="text-green-100 font-bold text-lg mt-2">Dominio Total • Crecimiento Imparable • Éxito Garantizado</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40 bg-white/20 border-white text-white font-bold backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 MES</SelectItem>
                    <SelectItem value="3months">3 MESES</SelectItem>
                    <SelectItem value="6months">6 MESES</SelectItem>
                    <SelectItem value="1year">1 AÑO</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold transition-all duration-300 hover:scale-105 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  EXPORTAR
                </Button>
                <Button className="bg-white text-green-600 hover:bg-green-50 font-black transition-all duration-300 hover:scale-105 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  NUEVA FACTURA
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <RevenueCard 
            icon={DollarSign} 
            title="Ingresos del mes" 
            value={formatCurrency(revenueStats.monthlyRevenue)}
            change={`+${revenueStats.monthlyGrowth}%`}
            changeType="positive"
            color="profit"
          />
          <RevenueCard 
            icon={Users} 
            title="Clientes activos" 
            value={revenueStats.totalClients}
            subtitle={`${revenueStats.activeSubscriptions} suscripciones`}
            color="growth"
          />
          <RevenueCard 
            icon={AlertCircle} 
            title="Facturas pendientes" 
            value={revenueStats.pendingInvoices}
            subtitle={formatCurrency(revenueStats.overdueAmount)}
            color="warning"
          />
          <RevenueCard 
            icon={Trophy} 
            title="Valor promedio" 
            value={formatCurrency(revenueStats.averageClientValue)}
            subtitle="por cliente"
            color="power"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-0 p-2 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              RESUMEN
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              SERVICIOS
            </TabsTrigger>
            <TabsTrigger 
              value="invoices"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              FACTURAS
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              ANALYTICS
            </TabsTrigger>
            <TabsTrigger 
              value="discounts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-black text-gray-300 transition-all duration-300"
            >
              DESCUENTOS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Revenue Chart */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="font-black text-xl">EVOLUCIÓN DE CONQUISTA</CardTitle>
                  <CardDescription className="text-green-100 font-bold">Ingresos mensuales vs meta de dominación</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={4}
                        name="Ingresos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        strokeWidth={3}
                        name="Meta"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="font-black text-xl">ARSENAL DE SERVICIOS</CardTitle>
                  <CardDescription className="text-purple-100 font-bold">Distribución de poder por servicio</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <RechartsPieChart data={serviceDistribution} />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {serviceDistribution.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm font-bold">{service.name}: {service.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Payments */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-t-lg">
                <CardTitle className="font-black text-xl">PRÓXIMAS VICTORIAS</CardTitle>
                <CardDescription className="text-gray-200 font-bold">Cobros automáticos programados para el éxito</CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upcomingPayments.map((payment, index) => (
                    <UpcomingPaymentCard key={index} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-xl border-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900">ARSENAL DE SERVICIOS</h2>
                <p className="text-gray-600 font-bold">Configura precios y características de tus armas financieras</p>
              </div>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                NUEVO SERVICIO
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-xl border-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900">COMANDO DE FACTURAS</h2>
                <p className="text-gray-600 font-bold">Administra facturas, pagos y conquistas financieras</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-2 border-gray-300 hover:border-green-500 hover:text-green-600 font-bold transition-all duration-300 hover:scale-105">
                  <Download className="h-4 w-4 mr-2" />
                  EXPORTAR
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  NUEVA FACTURA
                </Button>
              </div>
            </div>

            <Card className="bg-gray-900 shadow-xl border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700 bg-gray-800">
                        <th className="text-left p-4 font-black text-white uppercase tracking-wide">CLIENTE</th>
                        <th className="text-left p-4 font-black text-white uppercase tracking-wide">SERVICIO</th>
                        <th className="text-left p-4 font-black text-white uppercase tracking-wide">ESTADO</th>
                        <th className="text-left p-4 font-black text-white uppercase tracking-wide">VENCIMIENTO</th>
                        <th className="text-left p-4 font-black text-white uppercase tracking-wide">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(invoice => (
                        <InvoiceRow key={invoice.id} invoice={invoice} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Monthly Revenue Bar Chart */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="font-black text-xl">DOMINIO MENSUAL</CardTitle>
                  <CardDescription className="text-blue-100 font-bold">Comparación de conquistas financieras</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Client Growth */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="font-black text-xl">EXPANSIÓN DE IMPERIO</CardTitle>
                  <CardDescription className="text-purple-100 font-bold">Crecimiento imparable de guerreros</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="clients" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        name="Clientes"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white shadow-xl border-0 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <Crown className="h-12 w-12 mx-auto mb-4 drop-shadow-lg" />
                  <p className="text-4xl font-black drop-shadow-lg">{formatCurrency(revenueStats.totalRevenue)}</p>
                  <p className="text-sm font-bold uppercase tracking-wide text-yellow-100">IMPERIO TOTAL</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl border-0 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 drop-shadow-lg" />
                  <p className="text-4xl font-black drop-shadow-lg">+{revenueStats.monthlyGrowth}%</p>
                  <p className="text-sm font-bold uppercase tracking-wide text-green-100">CRECIMIENTO IMPARABLE</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl border-0 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 drop-shadow-lg" />
                  <p className="text-4xl font-black drop-shadow-lg">{formatCurrency(revenueStats.averageClientValue)}</p>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-100">VALOR GUERRERO</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-xl border-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900">ARSENAL DE DESCUENTOS</h2>
                <p className="text-gray-600 font-bold">Estrategias de conquista y ofertas especiales</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-black transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <Gift className="h-4 w-4 mr-2" />
                NUEVA PROMOCIÓN
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discounts.map(discount => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}