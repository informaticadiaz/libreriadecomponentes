// app/delivery-check/page.tsx (Server Component - NO "use client")
import { DeliveryZoneValidator } from '@/components/geo/DeliveryZoneValidator';

export default function DeliveryCheckPage() {
  // Define your delivery zone (example: 60x60 blocks around a center point)
  // This runs on the server and passes props to client component
  const deliveryZoneConfig = {
    center: { lat: -34.6037, lon: -58.3816 }, // Buenos Aires center
    // Option 1: Use radius in kilometers
    radiusKm: 5, // 5km radius
    
    // Option 2: Use specific polygon (uncomment to use instead of radius)
    // polygon: [
    //   { lat: -34.590, lon: -58.390 },
    //   { lat: -34.590, lon: -58.370 },
    //   { lat: -34.610, lon: -58.370 },
    //   { lat: -34.610, lon: -58.390 },
    //   { lat: -34.590, lon: -58.390 }
    // ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <DeliveryZoneValidator
        deliveryZoneConfig={deliveryZoneConfig}
        province="buenos aires"
        title="¿Hacemos delivery en tu zona?"
      />
    </div>
  );
}

