// app/dashboard/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Mi App',
  description: 'Panel de control principal',
}

interface DashboardStats {
  usuarios: number
  ventas: number
  productos: number
}

// Simulamos datos que podrían venir de una API
async function getDashboardData(): Promise<DashboardStats> {
  // En un caso real, aquí harías fetch a tu API
  return {
    usuarios: 1234,
    ventas: 5678,
    productos: 89
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-600">Usuarios</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.usuarios.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-600">Ventas</h3>
          <p className="text-3xl font-bold text-green-600">${stats.ventas.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-600">Productos</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.productos}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Nuevo usuario registrado</span>
            <span className="text-sm text-gray-500">Hace 2 horas</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Venta completada - $299</span>
            <span className="text-sm text-gray-500">Hace 4 horas</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Producto actualizado</span>
            <span className="text-sm text-gray-500">Hace 1 día</span>
          </div>
        </div>
      </div>
    </div>
  )
}