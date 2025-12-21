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
    <div className="ds-tag-filter">
      <div className="ds-tag-filter-header">
        <h3 className="ds-tag-filter-title">Themes</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="ds-tag-filter-clear"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="ds-tag-filter-list">
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
