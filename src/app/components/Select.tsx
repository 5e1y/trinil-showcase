import React from 'react';
import { Select as PrimerSelect } from '@primer/react';

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
  return (
    <PrimerSelect
      value={value}
      onChange={(e) => onValueChange(e.currentTarget.value)}
      className={className}
    >
      {options.map((option) => (
        <PrimerSelect.Option key={option.value} value={option.value}>
          {option.label}
        </PrimerSelect.Option>
      ))}
    </PrimerSelect>
  );
}
