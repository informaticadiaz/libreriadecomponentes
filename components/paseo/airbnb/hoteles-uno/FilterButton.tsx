
export const FilterButton = ({ active: active, onClick: onClick, children: children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
      active
        ? 'bg-black text-white border-black'
        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
    }`}
  >
    {children}
  </button>
);