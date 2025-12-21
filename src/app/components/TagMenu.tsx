import { Cross } from 'trinil-react';
import { getAllThemes } from '../data/iconTags';
import { Tag } from './Tag';
import { Button } from './Button';
import './TagMenu.css';

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
    <div className={`ds-tag-menu ${isOpen ? 'open' : ''}`}>
      <div className="ds-tag-menu-header">
        <h2>Themes</h2>
        <Button
          onClick={onClose}
          icon
          variant="secondary"
          aria-label="Close menu"
        >
          <Cross size={16} />
        </Button>
      </div>

      <div className="ds-tag-menu-content">
        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="ds-tag-menu-clear"
          >
            Clear all tags
          </button>
        )}

        <div className="ds-tag-menu-list">
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
