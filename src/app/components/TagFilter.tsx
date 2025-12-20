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
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Themes</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1.5">
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
