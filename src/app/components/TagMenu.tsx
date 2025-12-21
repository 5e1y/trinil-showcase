import { Cross } from 'trinil-react';
import { getAllThemes } from '../data/iconTags';
import { Tag } from './Tag';
import { Button } from './Button';

interface TagMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagMenu({ isOpen, onClose, selectedTags, onTagsChange }: TagMenuProps) {
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
    <div className={`w-full border-t border-[var(--ds-color-border)] bg-[var(--ds-color-surface)] p-4 overflow-y-auto lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--ds-color-border)]">
        <h2 className="text-base font-semibold text-[var(--ds-color-text)]">Themes</h2>
        <Button
          onClick={onClose}
          icon
          variant="secondary"
          aria-label="Close menu"
        >
          <Cross size={16} />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="text-sm text-[var(--ds-color-text-subtle)] hover:text-[var(--ds-color-text)] transition-colors text-left font-medium"
          >
            Clear all tags
          </button>
        )}

        <div className="flex flex-wrap gap-2">
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
    </div>
  );
}
