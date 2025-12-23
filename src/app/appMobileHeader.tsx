import React, { useEffect, RefObject } from 'react'
import Header from './components/Header'
import { Button } from '@/components/ui/button'
import { Input as SearchInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type AppMobileHeaderProps = {
  query: string;
  setQuery: (q: string) => void;
  iconSize: number[];
  setIconSize: (size: number[]) => void;
  viewMode: 'all' | 'grouped';
  handleThemeClick: (theme: string) => void;
  THEMES: string[];
  activeTheme: string;
  themeMenuRef: RefObject<HTMLDivElement>;
  themeButtonsRef: RefObject<Record<string, HTMLButtonElement | null>>;
  iconsByTheme: Record<string, Array<[string, React.ComponentType<React.SVGProps<SVGSVGElement>>]>>;
  selectedIcon: string | null;
  setSelectedIcon: (name: string | null) => void;
  themeRefs: RefObject<Record<string, HTMLDivElement | null>>;
  filteredEntries: Array<[string, React.ComponentType<React.SVGProps<SVGSVGElement>>]>;
  scrollAreaRef: RefObject<HTMLDivElement>;
  setPage: (page: string) => void;
};

export default function AppMobileHeader({
  query,
  setQuery,
  iconSize,
  setIconSize,
  viewMode,
  handleThemeClick,
  THEMES,
  activeTheme,
  themeMenuRef,
  themeButtonsRef,
  iconsByTheme,
  selectedIcon,
  setSelectedIcon,
  themeRefs,
  filteredEntries,
  scrollAreaRef,
  setPage,
}: AppMobileHeaderProps) {
  // Centrage automatique de l’ancre active dans la scrollarea du menu mobile
  useEffect(() => {
    if (!themeMenuRef?.current || !themeButtonsRef?.current) return
    const activeButton = themeButtonsRef.current[activeTheme]
    if (activeButton && themeMenuRef.current) {
      const container = themeMenuRef.current
      const button = activeButton
      const containerRect = container.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      // Calcul du scroll pour centrer le bouton
      const scrollLeft = container.scrollLeft
      const buttonLeft = button.offsetLeft
      const buttonWidth = button.offsetWidth
      const containerWidth = container.clientWidth
      const targetScroll = buttonLeft - (containerWidth - buttonWidth) / 2
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [activeTheme, themeMenuRef, themeButtonsRef])

  return (
    <div className="w-full">
      <Header 
        onNavigateHome={() => setPage('landing')}
        onNavigateToIcons={() => setPage('home')}
        onNavigateToDesignSystem={() => setPage('landing')}
        currentPage="home"
      />
      {/* Mobile Controls with theme menu */}
      <div className="sticky top-0 z-20 border-b bg-card p-4 space-y-4 -mt-px">
        <div className="flex gap-2 items-center">
          <SearchInput
            id="search"
            placeholder="Search icons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <button
            onClick={() => {
              const newSize = iconSize[0] === 60 ? 24 : iconSize[0] + 12
              setIconSize([newSize])
            }}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-border hover:bg-accent transition-colors font-medium text-sm"
          >
            {iconSize[0]}
          </button>
        </div>
        {/* Desktop-style theme menu for mobile */}
        <nav className="flex flex-col gap-1">
          {query && (
            <Button
              variant={viewMode === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleThemeClick('all')}
              className="justify-start text-xs"
            >
              All Results
            </Button>
          )}
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={themeMenuRef}>
            {THEMES.map((theme: string) => {
              const isActive = activeTheme === theme
              return (
                <Button
                  key={theme}
                  ref={(el) => {
                    if (themeButtonsRef && themeButtonsRef.current) {
                      themeButtonsRef.current[theme] = el
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleThemeClick(theme)}
                  className={`justify-start text-xs whitespace-nowrap transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {theme}
                </Button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
