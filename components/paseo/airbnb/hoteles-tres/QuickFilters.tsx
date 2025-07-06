
interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}
interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ filters, activeFilters, onFilterChange }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {filters.map((filter) => (
      <button
        key={filter.id}
        onClick={() => onFilterChange(filter.id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
          activeFilters.includes(filter.id)
            ? 'bg-black text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        <span className="text-lg">{filter.icon}</span>
        {filter.label}
      </button>
    ))}
  </div>
);