import { Check } from 'trinil-react';

interface TagProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Tag({ label, selected, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        transition-all duration-150 whitespace-nowrap
        ${
          selected
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }
      `}
    >
      {label}
      {selected && <Check size={12} className="ml-0.5" />}
    </button>
  );
}
