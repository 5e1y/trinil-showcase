import React, { useState, useEffect } from 'react';
import { TextInput } from '@primer/react';
import { LinkExternalIcon } from '@primer/octicons-react';
import { IconSlider } from './IconSlider';
import { Button } from './Button';
import { TagFilter } from './TagFilter';

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
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--fontSize-large)', fontWeight: 'var(--fontWeight-bold)' }}>
            Trinil
            {version && (
              <span style={{ fontSize: 'var(--fontSize-small)', color: 'var(--fgColor-muted)', marginLeft: '4px' }}>
                v{version}
              </span>
            )}
          </h1>
        </div>

        <div style={{ position: 'relative' }}>
          <TextInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search icons..."
            aria-label="Search icons"
            block
          />
          {search && (
            <Button
              onClick={() => onSearchChange('')}
              icon
              variant="ghost"
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              aria-label="Clear search"
            >
              ✕
            </Button>
          )}
        </div>

        <IconSlider value={iconSize} onChange={onSizeChange} />
        <TagFilter selectedTags={selectedTags} onTagsChange={onTagsChange} />

        <div
          style={{
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--bgColor-secondary)',
            borderRadius: 'var(--borderRadius-medium)',
          }}
        >
          <p style={{ margin: 0, fontSize: 'var(--fontSize-small)', color: 'var(--fgColor-muted)' }}>
            Style is locked. Only size can be customized.
          </p>
        </div>
      </div>

      <div className="ds-sidebar-footer">
        <Button
          onClick={() => window.open(githubUrl, '_blank')}
          variant="primary"
        >
          <LinkExternalIcon size={16} />
          <span style={{ marginLeft: '4px' }}>GitHub</span>
        </Button>
      </div>
    </aside>
  );
}