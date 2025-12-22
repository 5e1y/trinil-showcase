import React from 'react';
import { TextInput } from '@primer/react';
import { LinkExternalIcon, GearIcon } from '@primer/octicons-react';
import { IconSlider } from './IconSlider';
import { Button } from './Button';

interface MobileHeaderProps {
  iconSize: number;
  onSizeChange: (size: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onToggleTagMenu: () => void;
  selectedTagsCount: number;
  githubUrl: string;
}

export function MobileHeader({
  iconSize,
  onSizeChange,
  search,
  onSearchChange,
  onToggleTagMenu,
  selectedTagsCount,
  githubUrl,
}: MobileHeaderProps) {
  return (
    <div className="ds-mobile-header">
      <div className="ds-mobile-header-search">
        <div className="ds-mobile-header-search-input" style={{ position: 'relative' }}>
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
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
              aria-label="Clear search"
            >
              ✕
            </Button>
          )}
        </div>
        <Button
          onClick={() => window.open(githubUrl, '_blank')}
          variant="primary"
          style={{ flex: '0 0 auto', height: '44px', paddingLeft: '12px', paddingRight: '12px' }}
        >
          <LinkExternalIcon size={16} />
          <span style={{ marginLeft: '4px' }}>GitHub</span>
        </Button>
      </div>

      <div className="ds-mobile-header-controls">
        <div style={{ flex: 1 }}>
          <IconSlider value={iconSize} onChange={onSizeChange} />
        </div>
        <div style={{ position: 'relative' }}>
          <Button
            onClick={onToggleTagMenu}
            variant="outline"
            icon
            aria-label="Toggle themes menu"
          >
            <GearIcon size={16} />
          </Button>
          {selectedTagsCount > 0 && (
            <span className="ds-mobile-header-badge">
              {selectedTagsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
