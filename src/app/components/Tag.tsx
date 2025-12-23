import React from 'react';
import { Button } from '@primer/react';
import { CheckIcon } from '@primer/octicons-react';

interface TagProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function Tag({ label, selected, onClick, className = '' }: TagProps) {
  return (
    <Button
      onClick={onClick}
      variant={selected ? 'primary' : 'default'}
      size="small"
      className={className}
      aria-pressed={selected}
    >
      {label}
      {selected && (
        <CheckIcon size={12} style={{ marginLeft: '4px' }} />
      )}
    </Button>
  );
}
