import { BurgerMenu, Cross, ExternalLink } from 'trinil-react';
import { Slider } from '@radix-ui/react-slider';
import { Label } from '@radix-ui/react-label';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  iconSize: number;
  onSizeChange: (size: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  githubUrl: string;
}

export function Sidebar({
  isOpen,
  onToggle,
  iconSize,
  onSizeChange,
  search,
  onSearchChange,
  githubUrl,
}: SidebarProps) {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    fetch('https://registry.npmjs.org/trinil-react')
      .then((res) => res.json())
      .then((data) => {
        if (data['dist-tags']?.latest) {
          setVersion(data['dist-tags'].latest);
        }
      })
      .catch(() => {
        // Silently fail if version fetch doesn't work
      });
  }, []);

  return (
    <>
      {/* Sidebar - Desktop Only */}
      <aside
        className={`
          hidden lg:flex
          w-64 border-r border-neutral-200 bg-white p-6 overflow-y-auto shrink-0 flex-col
        `}
      >
        <div className="space-y-6 flex-1">
          {/* Title */}
          <div>
            <h1 className="font-semibold text-neutral-900 text-2xl">
              Trinil
              {version && <span className="text-sm text-neutral-400 ml-2">v{version}</span>}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
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

          {/* Size Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="size-slider" className="text-sm text-neutral-700">
                Size
              </Label>
              <span className="text-sm text-neutral-500">{iconSize}px</span>
            </div>
            <Slider
              id="size-slider"
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

          {/* Note */}
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Style is locked (stroke width / joins / caps). Only size can be customized.
            </p>
          </div>
        </div>

        {/* GitHub Button at the bottom */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink size={20} />
            <span className="text-sm font-medium">View on GitHub</span>
          </a>
        </div>
      </aside>
    </>
  );
}