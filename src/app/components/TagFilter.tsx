import React from 'react';
import { Button } from '@primer/react';
import { getAllThemes } from '../data/iconTags';
import { Tag } from './Tag';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const allThemes = getAllThemes();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearTags = () => {
    onTagsChange([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 'var(--spacing-3)',
          borderBottom: '1px solid var(--borderColor-default)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 'var(--fontSize-body)', fontWeight: 'var(--fontWeight-semibold)' }}>
          Themes
        </h3>
        {selectedTags.length > 0 && (
          <Button onClick={clearTags} variant="invisible" size="small">
            Clear all
          </Button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-2)',
        }}
      >
        {allThemes.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </div>
    </div>
  );
}
