"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Send,
  Eye,
  MoreVertical,
  Users,
  Package,
  Target,
  PieChart,
  BarChart3,
  Receipt,
  Zap,
  Gift,
  Crown,
  Star
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
  color?: string;
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

  const getStatusColor = (status: InvoiceStatus): string => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: InvoiceStatus): string => {
    switch(status) {
      case 'paid': return 'Pagada';
      case 'sent': return 'Enviada';
      case 'viewed': return 'Vista';
      case 'overdue': return 'Vencida';
      case 'draft': return 'Borrador';
      default: return status;
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch(status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const RevenueCard = ({ icon: Icon, title, value, subtitle, change, changeType, color = "blue" }: RevenueCardProps) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full bg-${color}-100`}>
              <Icon className={`h-5 w-5 text-${color}-600`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ServiceCard = ({ service }: ServiceCardProps) => {
    const utilizationPercentage: number = (service.activeSubscriptions / revenueStats.totalClients) * 100;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(service.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.frequency === 'monthly' ? 'por mes' : 'única vez'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{service.activeSubscriptions}</p>
                  <p className="text-xs text-muted-foreground">suscripciones</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{Math.round(utilizationPercentage)}%</p>
                  <p className="text-xs text-muted-foreground">utilización</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Ingresos generados</span>
                  <span className="font-medium">{formatCurrency(service.totalRevenue)}</span>
                </div>
                <Progress value={utilizationPercentage} className="h-2" />
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {service.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {service.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{service.features.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Suscribir cliente
            </Button>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InvoiceRow = ({ invoice }: InvoiceRowProps) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={invoice.clientAvatar} />
            <AvatarFallback>{invoice.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{invoice.clientName}</p>
            <p className="text-sm text-muted-foreground">{invoice.id}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <p className="font-medium">{invoice.service}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(invoice.amount)}</p>
      </td>
      <td className="p-4">
        <Badge className={getStatusColor(invoice.status)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(invoice.status)}
            {getStatusText(invoice.status)}
          </div>
        </Badge>
      </td>
      <td className="p-4">
        <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString('es-ES')}</p>
        {invoice.status === 'overdue' && (
          <p className="text-xs text-red-600">Vencida hace {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} días</p>
        )}
      </td>
      <td className="p-4">
        <div className="flex gap-1">
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" />
          </Button>
          {invoice.status !== 'paid' && (
            <Button size="sm">
              <Send className="h-3 w-3" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );

  const UpcomingPaymentCard = ({ payment }: UpcomingPaymentCardProps) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={payment.avatar} />
              <AvatarFallback>{payment.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{payment.clientName}</p>
              <p className="text-xs text-muted-foreground">{payment.service}</p>
            </div>
          </div>
          <Badge variant={payment.daysLeft <= 3 ? "destructive" : payment.daysLeft <= 7 ? "default" : "secondary"}>
            {payment.daysLeft} días
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
          <span className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString('es-ES')}</span>
        </div>
      </CardContent>
    </Card>
  );

  const DiscountCard = ({ discount }: DiscountCardProps) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{discount.name}</h3>
            <p className="text-sm text-muted-foreground">{discount.description}</p>
          </div>
          <Badge variant={discount.isActive ? "default" : "secondary"}>
            {discount.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Código</p>
            <p className="font-mono text-sm font-medium">{discount.code}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Descuento</p>
            <p className="font-medium">
              {discount.discountType === 'percentage' ? `${discount.discountValue}%` : formatCurrency(discount.discountValue)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usos: {discount.currentUses}/{discount.maxUses}</span>
            <span>Válido hasta: {new Date(discount.validUntil).toLocaleDateString('es-ES')}</span>
          </div>
          <Progress value={(discount.currentUses / discount.maxUses) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Centro de Facturación</h1>
              <p className="text-muted-foreground">Gestiona servicios, suscripciones, facturas y pagos</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 mes</SelectItem>
                  <SelectItem value="3months">3 meses</SelectItem>
                  <SelectItem value="6months">6 meses</SelectItem>
                  <SelectItem value="1year">1 año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva factura
              </Button>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RevenueCard 
            icon={DollarSign} 
            title="Ingresos del mes" 
            value={formatCurrency(revenueStats.monthlyRevenue)}
            change={`+${revenueStats.monthlyGrowth}%`}
            changeType="positive"
            color="green"
          />
          <RevenueCard 
            icon={Users} 
            title="Clientes activos" 
            value={revenueStats.totalClients}
            subtitle={`${revenueStats.activeSubscriptions} suscripciones`}
            color="blue"
          />
          <RevenueCard 
            icon={AlertCircle} 
            title="Facturas pendientes" 
            value={revenueStats.pendingInvoices}
            subtitle={formatCurrency(revenueStats.overdueAmount)}
            color="orange"
          />
          <RevenueCard 
            icon={Target} 
            title="Valor promedio" 
            value={formatCurrency(revenueStats.averageClientValue)}
            subtitle="por cliente"
            color="purple"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="discounts">Descuentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de Ingresos</CardTitle>
                  <CardDescription>Ingresos mensuales vs meta establecida</CardDescription>
                </CardHeader>
                <CardContent>
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
                        strokeWidth={3}
                        name="Ingresos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        name="Meta"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Servicios</CardTitle>
                  <CardDescription>Porcentaje de ingresos por tipo de servicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <RechartsPieChart data={serviceDistribution} />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {serviceDistribution.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm">{service.name}: {service.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Cobros</CardTitle>
                <CardDescription>Renovaciones automáticas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingPayments.map((payment, index) => (
                    <UpcomingPaymentCard key={index} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Gestión de Servicios</h2>
                <p className="text-muted-foreground">Configura precios y características de tus servicios</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo servicio
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Gestión de Facturas</h2>
                <p className="text-muted-foreground">Administra facturas, pagos y cobros</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva factura
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-medium">Cliente</th>
                        <th className="text-left p-4 font-medium">Servicio</th>
                        <th className="text-left p-4 font-medium">Estado</th>
                        <th className="text-left p-4 font-medium">Vencimiento</th>
                        <th className="text-left p-4 font-medium">Acciones</th>
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
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Mes</CardTitle>
                  <CardDescription>Comparación de ingresos mensuales</CardDescription>
                </CardHeader>
                <CardContent>
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
              <Card>
                <CardHeader>
                  <CardTitle>Crecimiento de Clientes</CardTitle>
                  <CardDescription>Evolución del número de clientes activos</CardDescription>
                </CardHeader>
                <CardContent>
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
                        strokeWidth={3}
                        name="Clientes"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Ingresos totales</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">+{revenueStats.monthlyGrowth}%</p>
                  <p className="text-sm text-muted-foreground">Crecimiento mensual</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.averageClientValue)}</p>
                  <p className="text-sm text-muted-foreground">Valor promedio cliente</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Descuentos y Promociones</h2>
                <p className="text-muted-foreground">Gestiona códigos de descuento y ofertas especiales</p>
              </div>
              <Button>
                <Gift className="h-4 w-4 mr-2" />
                Nuevo descuento
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