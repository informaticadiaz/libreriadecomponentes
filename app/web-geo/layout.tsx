// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Contenido principal */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}