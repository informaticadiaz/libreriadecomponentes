// components/learning/ui/Panel.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PanelVariant = 'default' | 'playful' | 'success' | 'info';

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  variant?: PanelVariant;
}

const variantStyles: Record<PanelVariant, string> = {
  default:
    'bg-white/95 border border-gray-200 rounded-2xl shadow-sm',
  playful:
    'bg-white/80 border-4 border-dashed border-sky-200 rounded-3xl shadow-lg backdrop-blur-sm',
  success:
    'bg-emerald-50/90 border border-emerald-200 rounded-3xl shadow-md',
  info:
    'bg-sky-50/90 border border-sky-200 rounded-3xl shadow-md'
};

export const Panel = ({
  children,
  className,
  title,
  description,
  variant = 'default'
}: PanelProps) => {
  return (
    <div className={cn(
      'p-6 transition-shadow duration-300',
      variantStyles[variant],
      className
    )}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-sky-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-sky-800/90 before:content-['⭐'] before:mr-2 before:text-sky-500">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
