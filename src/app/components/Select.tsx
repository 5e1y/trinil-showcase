import React, { useState } from 'react';
import { ChevronDown } from 'trinil-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function Select({ value, onValueChange, options, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find(opt => opt.value === value)?.label || value;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-4 py-2 flex items-center justify-between rounded-lg border border-neutral-300 bg-white text-neutral-900 text-sm hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 w-full z-50 bg-white border border-neutral-300 rounded-lg shadow-lg overflow-hidden">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === option.value
                    ? 'bg-neutral-100 text-neutral-900 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50'
                } ${index === 0 ? 'rounded-t-[7px]' : ''} ${
                  index === options.length - 1 ? 'rounded-b-[7px]' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
