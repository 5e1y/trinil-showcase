import { ExternalLink } from 'trinil-react';
import { IconSlider } from './IconSlider';
import { Button } from './Button';

interface MobileHeaderProps {
  iconSize: number;
  onSizeChange: (size: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  githubUrl: string;
}

export function MobileHeader({
  iconSize,
  onSizeChange,
  search,
  onSearchChange,
  githubUrl,
}: MobileHeaderProps) {
  return (
    <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-neutral-200">
      <div className="flex gap-2 p-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search icons..."
            className="w-full h-10 px-4 pr-10 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
            aria-label="Search icons"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-neutral-400 hover:text-neutral-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <Button
          onClick={() => window.open(githubUrl, '_blank')}
          variant="primary"
          className="shrink-0 h-10 !w-auto px-2"
        >
          <ExternalLink size={16} />
          <span>GitHub</span>
        </Button>
      </div>

      <div className="px-4 pb-4">
        <IconSlider value={iconSize} onChange={onSizeChange} />
      </div>
    </div>
  );
}
