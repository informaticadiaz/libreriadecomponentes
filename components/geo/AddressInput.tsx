// components/AddressInput.tsx
"use client";

import React, { useState } from 'react';

interface AddressInputProps {
  onAddressSubmit: (address: string) => void;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  onAddressSubmit,
  loading = false,
  placeholder = "Ingresa tu dirección (ej: Av Santa Fe 1234)",
  disabled = false
}) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() && !loading) {
      onAddressSubmit(address.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
          />
          <button
            type="submit"
            disabled={!address.trim() || loading || disabled}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Validando...' : 'Validar'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Incluye la altura si la conoces para mayor precisión
        </p>
      </div>
    </form>
  );
};
