import React, { useState } from 'react';
import { ChevronDown } from 'trinil-react';
import './Select.css';

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
    <div className={`ds-select ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ds-select-button"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={16}
          className="ds-select-chevron"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="ds-select-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="ds-select-dropdown">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                className={`ds-select-option ${value === option.value ? 'selected' : ''}`}
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
