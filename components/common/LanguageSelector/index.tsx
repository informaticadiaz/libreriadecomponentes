// src/components/common/LanguageSelector/index.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { Language } from '@/features/authentication/types/auth.types';
import { LanguageSelectorProps } from './LanguageSelector.types';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onValueChange,
  className = ""
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-24 h-8 ${className}`}>
        <Globe className="w-4 h-4 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">ES</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
};
