"use client";
import { 
  Search, 
  ArrowLeft,
  MoreVertical
} from 'lucide-react';

// Components
export const Header = ({ title, showBack = false, onBack }: { 
  title: string; 
  showBack?: boolean; 
  onBack?: () => void; 
}) => (
  <div className="bg-green-600 text-white px-4 py-4 shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-1 hover:bg-green-700 rounded"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-green-700 rounded">
          <Search className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-green-700 rounded">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
);
