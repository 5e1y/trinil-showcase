import { Check } from 'trinil-react';
import './Tag.css';

interface TagProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Tag({ label, selected, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`ds-tag ${selected ? 'selected' : ''}`}
    >
      {label}
      {selected && <Check size={12} style={{ marginLeft: '2px' }} />}
    </button>
  );
}
