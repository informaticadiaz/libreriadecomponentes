import { ChevronRight } from "lucide-react";

interface Category {
  name: string;
  icon: string;
  count: string;
}

export const CategoryGrid = ({ categories }: { categories: Category[] }) => (
  <div className="bg-white p-4 border-b border-gray-100">
    <h2 className="font-bold text-gray-900 mb-4 text-lg">Explorar por categoría</h2>
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 active:bg-gray-100 cursor-pointer">
          <span className="text-3xl">{category.icon}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-base">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.count} lugares</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      ))}
    </div>
  </div>
);

