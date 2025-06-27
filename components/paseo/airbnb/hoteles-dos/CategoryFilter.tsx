import { CategoryFilterProps, Category } from "@/types/hoteles";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onCategoryChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {categories.map((category: Category) => (
      <button
        key={category.id}
        onClick={() => onCategoryChange(category.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
          activeCategory === category.id
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }`}
      >
        <span>{category.icon}</span>
        {category.label}
      </button>
    ))}
  </div>
);
