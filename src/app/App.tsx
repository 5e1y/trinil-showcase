import { useMemo, useState, useRef, useEffect } from 'react'
import type React from 'react'
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
import { useIsMobile } from '@/components/ui/use-mobile'
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
  const isMobile = useIsMobile()
  const iconEntries = useMemo(() => {
    return Object.entries(TrinilIcons).filter(([, component]) => isIconComponent(component))
  }, [])
  
  const [query, setQuery] = useState('')
  const [iconSize, setIconSize] = useState([24])
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('grouped')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [framework, setFramework] = useState<'react' | 'vue'>('react')
  const [activeTheme, setActiveTheme] = useState<string>(THEMES[0] || '')
  const [copiedNpm, setCopiedNpm] = useState(false)
  const [copiedUsage, setCopiedUsage] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const themeRefs = useRef<Record<string, HTMLDivElement | null>>({})
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
        
        if (isMobile) {
          // Mobile: scroll with offset
          const elementTop = element.offsetTop
          const offset = Math.max(0, elementTop - 64)
          viewport.scrollTo({ top: offset, behavior: 'smooth' })
        } else {
          // Desktop: normal scrollIntoView
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 200)
    }
  }

  // Scroll spy - détecte quelle section est visible
  useEffect(() => {
    if (viewMode !== 'grouped') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute('data-theme')
            if (theme) setActiveTheme(theme)
          }
        })
      },
      { 
        threshold: 0.01,
        rootMargin: '0px 0px -80% 0px'
      }
    )

    // Observe all theme sections
    Object.values(themeRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [viewMode, Object.keys(themeRefs.current).length])

  // Scroll theme menu on mobile to show active theme
  useEffect(() => {
    if (!isMobile || !themeMenuRef.current) return
    
    const activeButton = themeButtonsRef.current[activeTheme]
    if (activeButton && themeMenuRef.current) {
      const container = themeMenuRef.current
      const button = activeButton
      const containerRect = container.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      
      // Calculate scroll position to center the button
      const scrollLeft = container.scrollLeft
      const buttonLeft = button.offsetLeft
      const buttonWidth = button.offsetWidth
      const containerWidth = container.clientWidth
      
      const targetScroll = buttonLeft - (containerWidth - buttonWidth) / 2
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [activeTheme, isMobile])

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    if (!isMobile || !mobileFilterOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterRef.current && 
        !filterRef.current.contains(e.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(e.target as Node)
      ) {
        setMobileFilterOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile, mobileFilterOpen])

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

  // Mobile layout
  if (isMobile) {
    return (
      <TooltipProvider>
        <Toaster position="bottom-right" />
        <div className="flex flex-col h-screen bg-background text-foreground">
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
                {THEMES.map((theme) => {
                  const isActive = activeTheme === theme
                  return (
                    <Button
                      key={theme}
                      ref={(el) => {
                        if (el) themeButtonsRef.current[theme] = el
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

          {/* Mobile Grid */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4">
                {viewMode === 'grouped' ? (
                  <div className="space-y-8">
                    {THEMES.map((theme) => {
                      const icons = iconsByTheme[theme] || []
                      if (icons.length === 0) return null
                      return (
                        <div
                          key={theme}
                          ref={(el) => (themeRefs.current[theme] = el)}
                          data-theme={theme}
                          className="space-y-3"
                        >
                          <h3 className="text-sm font-semibold text-foreground">{theme}</h3>
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
                                    } p-2 flex items-center justify-center`}
                                  >
                                    <Icon size={iconSize[0]} aria-hidden="true" className="text-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">{name}</TooltipContent>
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
                            } p-2 flex items-center justify-center`}
                          >
                            <Icon size={iconSize[0]} aria-hidden="true" className="text-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">{name}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Details Panel - Fullscreen on mobile */}
          {selectedIcon && (
            <div className="fixed inset-0 z-50 bg-background flex flex-col">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-8">
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
                        {selectedIcon && (() => {
                          const Icon = TrinilIcons[selectedIcon as keyof typeof TrinilIcons] as IconComponent
                          return Icon ? <Icon size={120} className="text-foreground relative z-10" /> : null
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
                      <label className="text-xs font-medium text-muted-foreground">Usage</label>
                      <div className="relative">
                        <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto max-w-full">
                          <code className="whitespace-pre-wrap break-words">{usageCode}</code>
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

  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <div className="flex flex-col h-screen bg-background text-foreground">
      <Header 
        onNavigateHome={() => setPage('landing')}
        onNavigateToIcons={() => setPage('home')}
        onNavigateToDesignSystem={() => setPage('landing')}
        currentPage="home"
      />
      <div className="flex flex-1 overflow-hidden">
      {/* Panneau gauche - 280px fixe */}
      <div className="w-70 shrink-0 border-r bg-card/50 overflow-hidden flex flex-col">
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
      </div>
      
      {/* Panneau central - remplissage */}
      <div className="flex-1 overflow-hidden">
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
                      ref={(el) => (themeRefs.current[theme] = el)}
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
                                <Icon size={iconSize[0]} aria-hidden="true" className="text-foreground" />
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
      </div>

      {/* Panneau droite - 280px fixe desktop, fullscreen mobile */}
      {selectedIcon && (
        <div className={isMobile ? "fixed inset-0 z-50 bg-background flex flex-col" : "w-70 shrink-0 border-l bg-card/50 overflow-hidden flex flex-col"}>
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
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
                    {selectedIcon && (() => {
                      const Icon = TrinilIcons[selectedIcon as keyof typeof TrinilIcons] as IconComponent
                      return Icon ? <Icon size={120} className="text-foreground relative z-10" /> : null
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
        </div>
      )}
      </div>
      </div>
    </TooltipProvider>
  )
}