// Example usage in a page (Server Component)
// app/address-search/page.tsx
import { AddressSearchClient } from './AddressSearchClient';

export default function AddressSearchPage() {
  // This runs on the server and passes data to client
  const deliveryZoneConfig = {
    center: { lat: -34.6037, lon: -58.3816 }, // Buenos Aires center
    radiusKm: 5, // 5km radius
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AddressSearchClient 
        deliveryZoneConfig={deliveryZoneConfig}
        title="Buscar mi Dirección de Delivery"
      />
    </div>
  );
}
