"use client";
import { 
  Search, 
  MapPin, 
  Bookmark,
  Users,
} from 'lucide-react';

export const BottomNav = ({ activeTab, onTabChange }: { 
  activeTab: string; 
  onTabChange: (tab: string) => void; 
}) => {
  const tabs = [
    { id: 'explore', icon: Search, label: 'Explorar' },
    { id: 'saved', icon: Bookmark, label: 'Guardados' },
    { id: 'trips', icon: MapPin, label: 'Viajes' },
    { id: 'profile', icon: Users, label: 'Perfil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="flex justify-around">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors active:scale-95 ${
              activeTab === tab.id 
                ? 'text-green-600' 
                : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
