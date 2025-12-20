import { ExternalLink } from 'trinil-react';
import { IconSlider } from './IconSlider';
import { Button } from './Button';
import { TagFilter } from './TagFilter';
import { useState, useEffect } from 'react';

interface SidebarProps {
  iconSize: number;
  onSizeChange: (size: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  githubUrl: string;
}

export function Sidebar({
  iconSize,
  onSizeChange,
  search,
  onSearchChange,
  selectedTags,
  onTagsChange,
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
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden lg:flex w-64 border-r border-neutral-200 bg-white p-6 overflow-y-auto shrink-0 flex-col">
      <div className="space-y-6 flex-1">
        <h1 className="font-semibold text-neutral-900 text-2xl">
          Trinil
          {version && <span className="text-sm text-neutral-400 ml-2">v{version}</span>}
        </h1>

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
            <Button
              onClick={() => onSearchChange('')}
              icon
              variant="secondary"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              ✕
            </Button>
          )}
        </div>

        <IconSlider value={iconSize} onChange={onSizeChange} />

        <TagFilter selectedTags={selectedTags} onTagsChange={onTagsChange} />

        <div className="pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            Style is locked. Only size can be customized.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <Button
          onClick={() => window.open(githubUrl, '_blank')}
          variant="primary"
          className="w-auto"
        >
          <ExternalLink size={20} />
          <span>GitHub</span>
        </Button>
      </div>
    </aside>
  );
}