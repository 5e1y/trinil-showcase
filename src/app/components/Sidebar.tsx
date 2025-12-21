import { ExternalLink } from 'trinil-react';
import { IconSlider } from './IconSlider';
import { Button } from './Button';
import { TagFilter } from './TagFilter';
import { useState, useEffect } from 'react';
import './Sidebar.css';

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
    <aside className="ds-sidebar">
      <div className="ds-sidebar-content">
        <h1 className="ds-sidebar-title">
          Trinil
          {version && <span className="ds-sidebar-version">v{version}</span>}
        </h1>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search icons..."
            className="ds-input"
            aria-label="Search icons"
          />
          {search && (
            <Button
              onClick={() => onSearchChange('')}
              icon
              variant="secondary"
              style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', marginTop: 0 }}
              aria-label="Clear search"
            >
              ✕
            </Button>
          )}
        </div>

        <IconSlider value={iconSize} onChange={onSizeChange} />

        <TagFilter selectedTags={selectedTags} onTagsChange={onTagsChange} />

        <div className="ds-sidebar-info">
          <p>Style is locked. Only size can be customized.</p>
        </div>
      </div>

      <div className="ds-sidebar-footer">
        <Button
          onClick={() => window.open(githubUrl, '_blank')}
          variant="primary"
        >
          <ExternalLink size={20} />
          <span>GitHub</span>
        </Button>
      </div>
    </aside>
  );
}