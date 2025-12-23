import React, { useMemo, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast, Toaster } from 'sonner'
import * as TrinilIcons from 'trinil-react'
import appPkg from '../../package.json'
import { iconTags, THEMES } from './data/iconTags'
import { Input as SearchInput } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppBreakpoint } from './useAppBreakpoint'
import Landing from './Landing'
import Header from './components/Header'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

function isIconComponent(value: unknown): value is IconComponent {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null)
  )
}

export default function App() {
  // All hooks must be called before any conditional returns
  const [page, setPage] = useState<'landing' | 'home'>('landing')
  const isMobile = useAppBreakpoint()
  const iconEntries = useMemo(() => {
    return Object.entries(TrinilIcons).filter(([, component]) => isIconComponent(component))
  }, [])
  
  const [query, setQuery] = useState('')
  const [iconSize, setIconSize] = useState([24])
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('grouped')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [framework, setFramework] = useState<'react' | 'vue'>('react')
  const [activeTheme, setActiveTheme] = useState<typeof THEMES[number]>(THEMES[0])
  const [copiedNpm, setCopiedNpm] = useState(false)
  const [copiedUsage, setCopiedUsage] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const themeRefs = useRef<Record<string, HTMLElement | null>>({})
  const filterRef = useRef<HTMLDivElement | null>(null)
  const filterButtonRef = useRef<HTMLButtonElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const themeButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({})
  const themeMenuRef = useRef<HTMLDivElement | null>(null)
  
  const rawVersion = (appPkg as { dependencies?: Record<string, string> }).dependencies?.['trinil-react'] ?? 'unknown'
  const version = rawVersion.replace(/^[^0-9]*/, '')

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return iconEntries
    return iconEntries.filter(([name]) => name.toLowerCase().includes(q))
  }, [iconEntries, query])

  const iconsByTheme = useMemo(() => {
    const grouped: Record<string, Array<[string, IconComponent]>> = {}
    
    filteredEntries.forEach(([name, component]) => {
      const tags = iconTags[name] || []
      tags.forEach((theme) => {
        if (!grouped[theme]) grouped[theme] = []
        grouped[theme].push([name, component])
      })
    })
    
    return grouped
  }, [filteredEntries])

  const handleThemeClick = (theme: string) => {
    if (theme === 'all') {
      setViewMode('all')
    } else {
      setViewMode('grouped')
      setTimeout(() => {
        const element = themeRefs.current[theme]
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
        if (!element || !viewport) return
        // Scroll précis dans le ScrollArea (mobile & desktop)
        const elementTop = element.offsetTop
        viewport.scrollTo({ top: elementTop, behavior: 'smooth' })
      }, 200)
    }
  }

  // Scroll spy - détecte quelle section est visible (desktop et mobile)
  useEffect(() => {
    if (page !== 'home' || viewMode !== 'grouped') return;

    // Fonction pour trouver dynamiquement l'élément qui scrolle (viewport Radix)
    function getScrollViewport(): HTMLElement | null {
      const ref = scrollAreaRef.current;
      if (!ref) return null;
      // Cherche le viewport Radix
      const viewport = ref.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
      // Le viewport Radix est toujours l'élément scrollable quand il existe
      return viewport || ref;
    }

    let currentViewport = getScrollViewport();
    if (!currentViewport) return;

    const handleScroll = () => {
      const viewport = currentViewport;
      if (!viewport) return;
      
      const headings = Object.values(themeRefs.current).filter(Boolean) as HTMLElement[];
      if (headings.length === 0) return;
      
      let closestEl: HTMLElement | null = null;
      let minDist = Infinity;
      
      const viewportRect = viewport.getBoundingClientRect();
      
      // Cherche la section la plus proche du haut du viewport
      headings.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top - viewportRect.top;
        if (top >= -240 && top < minDist) {
          minDist = top;
          closestEl = el;
        }
      });
      
      // Si aucune n'est visible, prendre la dernière section passée
      if (!closestEl) {
        minDist = Infinity;
        headings.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const top = rect.top - viewportRect.top;
          if (top < 0 && Math.abs(top) < minDist) {
            minDist = Math.abs(top);
            closestEl = el;
          }
        });
      }
      
      if (closestEl) {
        const theme = (closestEl as HTMLElement).getAttribute('data-theme');
        if (theme && THEMES.includes(theme as typeof THEMES[number])) {
          setActiveTheme(theme as typeof THEMES[number]);
        }
      }
    };

    // Attache le listener au viewport actuel
    currentViewport.addEventListener('scroll', handleScroll, { passive: true });
    
    // Appel initial
    requestAnimationFrame(handleScroll);

    // Gestion du resize pour détecter changement de viewport
    const handleResize = () => {
      const newViewport = getScrollViewport();
      if (newViewport && newViewport !== currentViewport) {
        currentViewport?.removeEventListener('scroll', handleScroll);
        currentViewport = newViewport;
        currentViewport.addEventListener('scroll', handleScroll, { passive: true });
      }
    };
    window.addEventListener('resize', handleResize);

    // Observer pour détecter les changements DOM (ex: mobile/desktop switch)
    const observer = new MutationObserver(() => {
      const newViewport = getScrollViewport();
      if (newViewport && newViewport !== currentViewport) {
        currentViewport?.removeEventListener('scroll', handleScroll);
        currentViewport = newViewport;
        currentViewport.addEventListener('scroll', handleScroll, { passive: true });
      }
    });
    
    if (scrollAreaRef.current) {
      observer.observe(scrollAreaRef.current, { childList: true, subtree: true });
    }

    return () => {
      currentViewport?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [page, viewMode, isMobile]);

  // Centrage automatique de l'ancre active dans le menu horizontal mobile
  useEffect(() => {
    if (!isMobile || !themeMenuRef.current || !themeButtonsRef.current) return;
    const activeButton = themeButtonsRef.current[activeTheme];
    if (activeButton && themeMenuRef.current) {
      const container = themeMenuRef.current;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.clientWidth;
      const targetScroll = buttonLeft - (containerWidth - buttonWidth) / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [activeTheme, isMobile]);

  // ...existing code...

  // ...existing code...

  const handleCopyNpm = () => {
    const pkg = framework === 'react' ? 'trinil-react' : 'trinil-vue'
    const command = `npm install ${pkg}`
    
    try {
      // Créer un textarea temporaire
      const textArea = document.createElement('textarea')
      textArea.value = command
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      // Copier
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (success) {
        setCopiedNpm(true)
        toast.success('Copied to clipboard!', {
          icon: <TrinilIcons.CircleCheck size={18} />
        })
        setTimeout(() => setCopiedNpm(false), 2000)
      } else {
        toast.error('Failed to copy', {
          icon: <TrinilIcons.CircleCross size={18} />
        })
      }
    } catch (error) {
      console.error('Copy error:', error)
      toast.error('Failed to copy', {
        icon: <TrinilIcons.CircleCross size={18} />
      })
    }
  }

  const handleCopyUsage = () => {
    if (!selectedIcon) return
    const usageCode = framework === 'react' 
      ? `import { ${selectedIcon} } from 'trinil-react'\n\nfunction App() {\n  return (\n    <${selectedIcon}\n      size={24}\n      className="text-blue-500"\n      aria-label="${selectedIcon}"\n    />\n  )\n}`
      : `import { ${selectedIcon} } from 'trinil-vue'\n\n<template>\n  <${selectedIcon}\n    :size="24"\n    class="text-blue-500"\n    aria-label="${selectedIcon}"\n  />\n</template>`

    const textArea = document.createElement('textarea')
    textArea.value = usageCode
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (success) {
      setCopiedUsage(true)
      toast.success('Copied to clipboard!', {
        icon: <TrinilIcons.CircleCheck size={18} />
      })
      setTimeout(() => setCopiedUsage(false), 2000)
    } else {
      toast.error('Failed to copy', {
        icon: <TrinilIcons.CircleCross size={18} />
      })
    }
  }

  const handleDownload = () => {
    if (!selectedIcon) return
    const IconComponent = TrinilIcons[selectedIcon as keyof typeof TrinilIcons] as any
    if (!IconComponent) return
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '24')
    svg.setAttribute('height', '24')
    svg.setAttribute('viewBox', '0 0 24 24')
    
    const tempDiv = document.createElement('div')
    const root = (window as any).ReactDOM?.createRoot?.(tempDiv)
    if (root) {
      root.render(<IconComponent />)
      setTimeout(() => {
        const svgContent = tempDiv.querySelector('svg')?.innerHTML || ''
        svg.innerHTML = svgContent
        const svgData = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedIcon}.svg`
        a.click()
        URL.revokeObjectURL(url)
      }, 100)
    }
  }

  const npmCommand = framework === 'react' ? 'npm install trinil-react' : 'npm install trinil-vue'

  // Conditional render for Landing page
  if (page === 'landing') {
    return (
      <Landing 
        onNavigateToIcons={() => setPage('home')} 
        onNavigateToDesignSystem={() => setPage('landing')}
      />
    )
  }

  // ...existing code...

  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header commun desktop et mobile */}
      <Header 
        onNavigateHome={() => setPage('landing')}
        onNavigateToIcons={() => setPage('home')}
        onNavigateToDesignSystem={() => setPage('landing')}
        currentPage="home"
      />
      
      {/* Menu d'ancre horizontal pour mobile */}
      {isMobile && (
        <div className="sticky top-0 z-20 border-b bg-card px-4 py-3 space-y-3">
          <div className="flex gap-2 items-center">
            <SearchInput
              id="search-mobile"
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
          <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={themeMenuRef}>
            {query && (
              <Button
                variant={viewMode === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleThemeClick('all')}
                className="justify-start text-xs whitespace-nowrap"
              >
                All Results
              </Button>
            )}
            {THEMES.map((theme) => {
              const isActive = activeTheme === theme
              return (
                <Button
                  key={theme}
                  ref={(el) => {
                    if (themeButtonsRef.current) {
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
          </nav>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Panneau gauche - 280px fixe, masqué sur mobile */}
        {!isMobile && (
          <motion.div 
            className="w-70 shrink-0 border-r bg-card/50 overflow-hidden flex flex-col"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                <div className="space-y-2">
                  <SearchInput
                    id="search"
                    placeholder="Search icons…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Icon size: {iconSize[0]}px</label>
                  <Slider
                    value={iconSize}
                    onValueChange={setIconSize}
                    min={12}
                    max={64}
                    step={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Themes</label>
                  <nav className="relative flex flex-col gap-1 pl-4">
                    {/* Ligne verticale grise en arrière-plan */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                    {/* Ligne indicatrice qui suit le thème actif */}
                    <div 
                      className="absolute left-0 w-0.5 bg-foreground transition-all duration-300 ease-out"
                      style={{
                        top: `calc(${THEMES.indexOf(activeTheme)} * (2.25rem + 0.25rem) + ${query ? 'calc(2.25rem + 0.25rem)' : '0px'})`,
                        height: '2.25rem',
                        opacity: activeTheme ? 1 : 0
                      }}
                    />
                    {query && (
                      <Button
                        variant={viewMode === 'all' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => handleThemeClick('all')}
                        className="justify-start text-xs relative"
                      >
                        All Results
                      </Button>
                    )}
                    {THEMES.map((theme) => {
                      const isActive = activeTheme === theme
                      return (
                        <Button
                          key={theme}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleThemeClick(theme)}
                          className={`justify-start text-xs relative transition-colors ${
                            isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {theme}
                        </Button>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      
      {/* Panneau central - remplissage */}
      <motion.div 
        className={`flex-1 overflow-hidden transition-opacity duration-200 ${
          selectedIcon && isMobile ? 'opacity-0' : 'opacity-100'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: selectedIcon && isMobile ? 0 : 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-6">
            {viewMode === 'grouped' ? (
              <div className="space-y-8">
                {THEMES.map((theme) => {
                  const icons = iconsByTheme[theme] || []
                  if (icons.length === 0) return null
                  return (
                    <div
                      key={theme}
                      ref={(el) => { themeRefs.current[theme] = el; }}
                      data-theme={theme}
                      className="space-y-4 scroll-mt-24"
                    >
                      <h3 className="text-base font-semibold text-foreground">{theme}</h3>
                      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
                        {icons.map(([name, Icon]) => (
                          <Tooltip key={name}>
                            <TooltipTrigger asChild>
                              <button
                                aria-label={name}
                                onClick={() => setSelectedIcon(name)}
                                className={`aspect-square rounded-xl border transition-colors ${
                                  selectedIcon === name
                                    ? 'border-ring bg-accent text-accent-foreground'
                                    : 'border-border bg-card hover:bg-accent hover:border-accent-foreground/20'
                                } p-3 flex items-center justify-center`}
                              >
                                {React.createElement(Icon as any, { size: iconSize[0], "aria-hidden": true, className: "text-foreground" })}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">{name}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
                {filteredEntries.map(([name, Icon]) => (
                  <Tooltip key={name}>
                    <TooltipTrigger asChild>
                      <button
                        aria-label={name}
                        onClick={() => setSelectedIcon(name)}
                        className={`aspect-square rounded-xl border transition-colors ${
                          selectedIcon === name
                            ? 'border-ring bg-accent text-accent-foreground'
                            : 'border-border bg-card hover:bg-accent hover:border-accent-foreground/20'
                        } p-3 flex items-center justify-center`}
                      >
                        <Icon size={iconSize[0]} aria-hidden="true" className="text-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Panneau droite - 280px fixe desktop avec animation de largeur */}
      {!isMobile && (
        <motion.div 
          className={`shrink-0 border-l bg-card/50 overflow-hidden flex flex-col transition-[width,border] duration-300 ease-out ${
            selectedIcon ? 'w-70' : 'w-0 border-l-0'
          }`}
          initial={{ x: 280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {selectedIcon && (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-8 w-70">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Details</h3>
                  <button
                    onClick={() => setSelectedIcon(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <TrinilIcons.Cross size={18} />
                  </button>
                </div>
                
                <div className="flex flex-col items-center gap-3 mt-8">
                  <div className="flex items-center justify-center rounded-md border border-border bg-muted/50 overflow-hidden" style={{ width: '120px', height: '120px' }}>
                    <div className="relative" style={{ width: '120px', height: '120px' }}>
                      <div className="absolute inset-0 grid-pattern-12" style={{ backgroundPosition: '0 0' }} />
                      {(() => {
                        const Icon = TrinilIcons[selectedIcon as keyof typeof TrinilIcons] as IconComponent
                        return Icon ? React.createElement(Icon as any, { size: 120, className: "text-foreground relative z-10" }) : null
                      })()}
                    </div>
                  </div>
                  <p className="text-lg font-medium text-foreground text-center">{selectedIcon}</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    className="w-full px-3 py-2 h-10 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <TrinilIcons.Download size={18} />
                    Download SVG
                  </button>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Framework</label>
                    <Select value={framework} onValueChange={(val) => setFramework(val as 'react' | 'vue')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Installation</label>
                    <div className="relative">
                      <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto max-w-full">
                        <code className="whitespace-pre-wrap break-words">{npmCommand}</code>
                      </pre>
                      <button
                        onClick={handleCopyNpm}
                        className="absolute right-2 top-2 h-6 w-6 p-1 rounded bg-muted hover:bg-border transition-colors flex items-center justify-center"
                      >
                        {copiedNpm ? (
                          <TrinilIcons.Check size={16} />
                        ) : (
                          <TrinilIcons.Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Usage example</label>
                    <div className="relative">
                      <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto max-w-full">
                        <code className="whitespace-pre-wrap break-words">
                          {(framework === 'react' 
                            ? 'import { ' + selectedIcon + ' } from \'trinil-react\'\n\nfunction App() {\n  return (\n    <' + selectedIcon + '\n      size={24}\n      className="text-blue-500"\n      aria-label="' + selectedIcon + '"\n    />\n  )\n}'
                            : 'import { ' + selectedIcon + ' } from \'trinil-vue\'\n\n<template>\n  <' + selectedIcon + '\n    :size="24"\n    class="text-blue-500"\n    aria-label="' + selectedIcon + '"\n  />\n</template>'
                          )}
                        </code>
                      </pre>
                      <button
                        onClick={handleCopyUsage}
                        className="absolute right-2 top-2 h-6 w-6 p-1 rounded bg-muted hover:bg-border transition-colors flex items-center justify-center"
                      >
                        {copiedUsage ? (
                          <TrinilIcons.Check size={16} />
                        ) : (
                          <TrinilIcons.Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </motion.div>
      )}
      </div>

      {/* Panneau mobile fullscreen fixe */}
      {selectedIcon && isMobile && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-base font-semibold text-foreground">Details</h3>
            <button
              onClick={() => setSelectedIcon(null)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <TrinilIcons.Cross size={20} />
            </button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center rounded-md border border-border bg-muted/50 overflow-hidden" style={{ width: '160px', height: '160px' }}>
                  <div className="relative" style={{ width: '160px', height: '160px' }}>
                    <div className="absolute inset-0 grid-pattern-12" style={{ backgroundPosition: '0 0' }} />
                    {(() => {
                      const Icon = TrinilIcons[selectedIcon as keyof typeof TrinilIcons] as IconComponent
                      return Icon ? React.createElement(Icon as any, { size: 160, className: "text-foreground relative z-10" }) : null
                    })()}
                  </div>
                </div>
                <p className="text-xl font-medium text-foreground text-center">{selectedIcon}</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  className="w-full px-3 py-3 h-12 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <TrinilIcons.Download size={18} />
                  Download SVG
                </button>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Framework</label>
                  <Select value={framework} onValueChange={(val) => setFramework(val as 'react' | 'vue')}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Installation</label>
                  <div className="relative">
                    <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto max-w-full">
                      <code className="whitespace-pre-wrap break-words">{npmCommand}</code>
                    </pre>
                    <button
                      onClick={handleCopyNpm}
                      className="absolute right-2 top-2 h-6 w-6 p-1 rounded bg-muted hover:bg-border transition-colors flex items-center justify-center"
                    >
                      {copiedNpm ? (
                        <TrinilIcons.Check size={16} />
                      ) : (
                        <TrinilIcons.Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Usage example</label>
                  <div className="relative">
                    <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto max-w-full">
                      <code className="whitespace-pre-wrap break-words">
                        {(framework === 'react' 
                          ? 'import { ' + selectedIcon + ' } from \'trinil-react\'\n\nfunction App() {\n  return (\n    <' + selectedIcon + '\n      size={24}\n      className="text-blue-500"\n      aria-label="' + selectedIcon + '"\n    />\n  )\n}'
                          : 'import { ' + selectedIcon + ' } from \'trinil-vue\'\n\n<template>\n  <' + selectedIcon + '\n    :size="24"\n    class="text-blue-500"\n    aria-label="' + selectedIcon + '"\n  />\n</template>'
                        )}
                      </code>
                    </pre>
                    <button
                      onClick={handleCopyUsage}
                      className="absolute right-2 top-2 h-6 w-6 p-1 rounded bg-muted hover:bg-border transition-colors flex items-center justify-center"
                    >
                      {copiedUsage ? (
                        <TrinilIcons.Check size={16} />
                      ) : (
                        <TrinilIcons.Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
      </div>
    </TooltipProvider>
  )
}