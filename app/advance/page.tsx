"use client"
import { AdvancedHeader, MetricsDashboard } from "@/components/Advance"

export default function Page() {
  // Datos de ejemplo para el usuario
  const currentUser = {
    name: "John Doe",
    email: "john@example.com", 
    avatar: "/avatar.jpg", // opcional
    role: "Admin"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AdvancedHeader user={currentUser} />
      
      {/* Main Content */}
      <main className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here whats happening with your projects today.
          </p>
        </div>
        
        {/* Dashboard Content */}
        <MetricsDashboard />
      </main>
    </div>
  )
}