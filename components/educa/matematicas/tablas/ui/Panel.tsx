// components/learning/ui/Panel.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Panel = ({ children, className, title, description }: PanelProps) => {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm p-6",
      className
    )}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
