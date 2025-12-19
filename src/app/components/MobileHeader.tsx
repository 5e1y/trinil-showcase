import { Cross, ExternalLink } from 'trinil-react';
import { Slider } from '@radix-ui/react-slider';
import { Label } from '@radix-ui/react-label';

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
      {/* Search Bar with GitHub Button */}
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
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
              aria-label="Clear search"
            >
              <Cross size={20} className="text-neutral-500" />
            </button>
          )}
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-3 h-10 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          aria-label="View on GitHub"
        >
          <ExternalLink size={16} />
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>

      {/* Size Slider */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="mobile-size-slider" className="text-sm text-neutral-700">
              Size
            </Label>
            <span className="text-sm text-neutral-500">{iconSize}px</span>
          </div>
          <Slider
            id="mobile-size-slider"
            min={16}
            max={64}
            step={1}
            value={[iconSize]}
            onValueChange={([value]) => onSizeChange(value)}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <div className="relative flex-1 h-1 bg-neutral-200 rounded-full">
              <div
                className="absolute h-full bg-neutral-900 rounded-full"
                style={{ width: `${((iconSize - 16) / (64 - 16)) * 100}%` }}
              />
            </div>
            <div
              className="block w-5 h-5 bg-white border-2 border-neutral-900 rounded-full hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 cursor-pointer"
              style={{
                position: 'absolute',
                left: `${((iconSize - 16) / (64 - 16)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            />
          </Slider>
        </div>
      </div>
    </div>
  );
}
