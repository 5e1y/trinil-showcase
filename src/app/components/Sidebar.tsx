import { ExternalLink } from 'trinil-react';
import { IconSlider } from './IconSlider';
import { useState, useEffect } from 'react';

interface SidebarProps {
  iconSize: number;
  onSizeChange: (size: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  githubUrl: string;
}

export function Sidebar({
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
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <IconSlider value={iconSize} onChange={onSizeChange} />

        <div className="pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            Style is locked. Only size can be customized.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <ExternalLink size={20} />
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>
    </aside>
  );
}