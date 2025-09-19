// components/learning/ui/StatCard.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatCardColor =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'amber'
  | 'pink'
  | 'teal';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: StatCardColor;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  color = 'blue',
  className
}: StatCardProps) => {
  const colorClasses: Record<StatCardColor, string> = {
    blue: 'bg-sky-100 text-sky-900 border-sky-200',
    green: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    yellow: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    red: 'bg-rose-100 text-rose-900 border-rose-200',
    purple: 'bg-purple-100 text-purple-900 border-purple-200',
    amber: 'bg-amber-100 text-amber-900 border-amber-200',
    pink: 'bg-pink-100 text-pink-900 border-pink-200',
    teal: 'bg-teal-100 text-teal-900 border-teal-200'
  };

  return (
    <div className={cn(
      'border rounded-3xl p-6 text-center shadow-md shadow-sky-200/70 transition-transform duration-200 hover:-translate-y-0.5',
      colorClasses[color],
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center justify-center bg-white rounded-full p-2 shadow-sm">
            {icon}
          </div>
        </div>
      )}
      <div className="text-3xl font-black mb-1 text-current">{value}</div>
      <div className="text-sm font-semibold tracking-wide uppercase text-current opacity-80">
        {label}
      </div>
    </div>
  );
};
