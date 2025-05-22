
export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Sistema de Componentes UI
        </h1>
        
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🏠 Para Sistemas Inmobiliarios</h2>
          <p className="text-muted-foreground mb-4">
            Una librería completa de componentes construida con Next.js 15, React 19, 
            Tailwind CSS 4, siguiendo principios de Clean Architecture.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-property-available/10 border border-property-available/20 rounded">
              <h3 className="font-medium text-property-available">Disponible</h3>
              <p className="text-sm">Propiedades listas para venta</p>
            </div>
            
            <div className="p-4 bg-property-reserved/10 border border-property-reserved/20 rounded">
              <h3 className="font-medium text-property-reserved">Reservada</h3>
              <p className="text-sm">En proceso de reserva</p>
            </div>
            
            <div className="p-4 bg-property-sold/10 border border-property-sold/20 rounded">
              <h3 className="font-medium text-property-sold">Vendida</h3>
              <p className="text-sm">Venta completada</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-success">✅ Sistema funcionando correctamente</p>
        </div>
      </div>
    </main>
  )
}