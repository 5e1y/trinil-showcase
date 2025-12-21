/**
 * TRINIL ICON BROWSER
 * 
 * Easy-to-change constants:
 * - Change these at the top to update repo/package references throughout the app
 */
const GITHUB_REPO_URL = "https://github.com/5e1y/trinil";
const REACT_PKG = "trinil-react";
const VUE_PKG = "trinil-vue";
const NPM_REGISTRY_LATEST = (pkgName: string) => `https://registry.npmjs.org/${pkgName}/latest`;

import { useState, useMemo, useEffect } from 'react';
import * as TrinilIcons from 'trinil-react';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { TagMenu } from './components/TagMenu';
import { IconGrid } from './components/IconGrid';
import { DetailsPanel } from './components/DetailsPanel';
import { getIconsByTheme } from './data/iconTags';
import './App.css';

// Filter to get only valid icon components
function getIconNames(): string[] {
  const allKeys = Object.keys(TrinilIcons);
  
  const filtered = allKeys.filter(key => {
    const exported = TrinilIcons[key as keyof typeof TrinilIcons];
    // Check if it's a function or React component
    const isValid = typeof exported === 'function' || typeof exported === 'object';
    return isValid;
  }).sort();
  
  return filtered;
}

export default function App() {
  // State
  const [search, setSearch] = useState('');
  const [iconSize, setIconSize] = useState(24);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [npmVersions, setNpmVersions] = useState({ react: '', vue: '' });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);

  // Get all valid icon names
  const allIconNames = useMemo(() => getIconNames(), []);

  // Filter icons based on search and tags
  const filteredIcons = useMemo(() => {
    let icons = allIconNames;
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      const iconsWithSelectedTags = new Set<string>();
      selectedTags.forEach(tag => {
        getIconsByTheme(tag).forEach(icon => iconsWithSelectedTags.add(icon));
      });
      icons = icons.filter(icon => iconsWithSelectedTags.has(icon));
    }
    
    // Apply search filter
    if (!search.trim()) return icons;
    const searchLower = search.toLowerCase();
    return icons.filter(name => name.toLowerCase().includes(searchLower));
  }, [allIconNames, search, selectedTags]);

  // Fetch NPM versions
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const [reactRes, vueRes] = await Promise.all([
          fetch(NPM_REGISTRY_LATEST(REACT_PKG)).catch(() => null),
          fetch(NPM_REGISTRY_LATEST(VUE_PKG)).catch(() => null),
        ]);

        const versions: { react?: string; vue?: string } = {};
        
        if (reactRes && reactRes.ok) {
          const data = await reactRes.json();
          versions.react = data.version;
        }
        
        if (vueRes && vueRes.ok) {
          const data = await vueRes.json();
          versions.vue = data.version;
        }

        setNpmVersions(versions);
      } catch (error) {
        console.error('Failed to fetch npm versions:', error);
      }
    };

    fetchVersions();
  }, []);

  return (
    <div className="ds-app">
      {/* Mobile Header - Sticky */}
      <MobileHeader
        iconSize={iconSize}
        onSizeChange={setIconSize}
        search={search}
        onSearchChange={setSearch}
        onToggleTagMenu={() => setIsTagMenuOpen(!isTagMenuOpen)}
        selectedTagsCount={selectedTags.length}
        githubUrl={GITHUB_REPO_URL}
      />

      {/* Main Layout */}
      <div className="ds-app-main">
        {/* Sidebar */}
        <Sidebar
          iconSize={iconSize}
          onSizeChange={setIconSize}
          search={search}
          onSearchChange={setSearch}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          githubUrl={GITHUB_REPO_URL}
        />

        {/* Icon Grid + Menu Wrapper (mobile only) */}
        <div className="ds-app-content">
          <IconGrid
            icons={filteredIcons}
            iconSize={iconSize}
            selectedIcon={selectedIcon}
            onSelectIcon={setSelectedIcon}
            searchQuery={search}
          />

          {/* Tag Menu Mobile - In the flow */}
          {isTagMenuOpen && (
            <TagMenu
              isOpen={isTagMenuOpen}
              onClose={() => setIsTagMenuOpen(false)}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          )}
        </div>

        {/* Details Panel */}
        {selectedIcon && (
          <DetailsPanel
            iconName={selectedIcon}
            iconSize={iconSize}
            onClose={() => setSelectedIcon(null)}
            reactPkg={REACT_PKG}
            vuePkg={VUE_PKG}
            reactVersion={npmVersions.react}
            vueVersion={npmVersions.vue}
          />
        )}
      </div>
    </div>
  );
}