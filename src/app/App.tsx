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

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

function isIconComponent(value: unknown): value is IconComponent {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null)
  )
}

export default function App() {
  const isMobile = useIsMobile()
  const iconEntries = useMemo(() => {
    return Object.entries(TrinilIcons).filter(([, component]) => isIconComponent(component))
  }, [])
  
  const [query, setQuery] = useState('')
  const [iconSize, setIconSize] = useState([24])
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('grouped')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [framework, setFramework] = useState<'react' | 'vue'>('react')
  const [activeTheme, setActiveTheme] = useState<string>('')
  const [copiedNpm, setCopiedNpm] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const themeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const filterRef = useRef<HTMLDivElement | null>(null)
  const filterButtonRef = useRef<HTMLButtonElement | null>(null)
  
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
        if (element) {
          const headerOffset = isMobile ? 80 : 72
          window.scrollTo({ top: element.offsetTop - headerOffset, behavior: 'smooth' })
        }
      }, 50)
    }
  }

  // Scroll spy - détecte quelle section est visible
  useEffect(() => {
    if (viewMode !== 'grouped') return

    // Sur mobile, utiliser une marge plus adaptée
    const rootMargin = isMobile ? '0px 0px -50% 0px' : '0px 0px -80% 0px'
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute('data-theme')
            if (theme) setActiveTheme(theme)
          }
        })
      },
      { threshold: 0.1, rootMargin }
    )

    Object.values(themeRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [viewMode, iconsByTheme, isMobile])

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
        toast.success('Copié dans le presse-papiers!')
        setTimeout(() => setCopiedNpm(false), 2000)
      } else {
        toast.error('Impossible de copier')
      }
    } catch (error) {
      console.error('Copy error:', error)
      toast.error('Impossible de copier')
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

  if (isMobile) {
    return (
      <TooltipProvider>
        <Toaster position="bottom-right" />
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          {/* Mobile Header */}
          <div className="sticky top-0 z-40 border-b bg-card p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <SearchInput
                id="search"
                placeholder="Search icons…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <a
                href="https://github.com/5e1y/trinil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-ring hover:bg-muted/50 whitespace-nowrap"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.181.092-.916.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.286.098-2.676 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.39.203 2.423.1 2.676.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.194 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
            
            {!mobileFilterOpen && (
              <div className="flex gap-2 items-center">
                <button
                  ref={filterButtonRef}
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="flex-1 flex items-center justify-between px-3 py-3 rounded-md text-base transition-colors text-foreground hover:bg-muted/50 font-medium"
                >
                  {activeTheme || 'Select theme'}
                  <TrinilIcons.ChevronDown size={22} />
                </button>
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
            )}

            {/* Mobile Filter Menu */}
            {mobileFilterOpen && (
              <div ref={filterRef} className="space-y-1">
                {THEMES.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      handleThemeClick(theme)
                      setMobileFilterOpen(false)
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeTheme === theme
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Grid */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
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
                          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
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
                  <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
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

          {/* Mobile Detail Panel Fullscreen */}
          {isMobile && selectedIcon && (
            <div className="fixed inset-0 z-50 bg-background flex flex-col">
              <div className="flex-1 overflow-y-auto">
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
                          const Icon = TrinilIcons[selectedIcon as keyof typeof TrinilIcons] as any
                          return Icon ? <Icon size={120} className="text-foreground relative z-10" /> : <span>Icon not found</span>
                        })()}
                      </div>
                    </div>
                    <p className="text-lg font-medium text-foreground text-center">{selectedIcon}</p>
                  </div>

                  <div className="space-y-4">
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
                      <div className="relative">
                        <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto">
                          <code>{npmCommand}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyNpm}
                          className="absolute right-2 top-2 h-6 px-2"
                        >
                          {copiedNpm ? (
                            <TrinilIcons.Check size={18} />
                          ) : (
                            <TrinilIcons.Copy size={18} />
                          )}
                        </Button>
                      </div>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <TrinilIcons.Download size={18} />
                      Download SVG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <div className="flex min-h-screen bg-background text-foreground">
      {/* Panneau gauche - 280px fixe */}
      <div className="w-70 shrink-0 border-r bg-card/50 sticky top-0 h-screen">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Trinil <span className="ml-2 align-top text-xs font-medium text-muted-foreground">{version}</span>
              </h2>
            </div>
            
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
                  className="absolute left-0 w-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
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
            
            <div className="pt-8">
              <a
                href="https://github.com/5e1y/trinil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.181.092-.916.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.286.098-2.676 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.39.203 2.423.1 2.676.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.194 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Panneau central - remplissage */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
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

      {/* Panneau droite - 280px fixe, caché si pas d'icône */}
      {selectedIcon && (
        <div className="w-70 shrink-0 border-l bg-card/50 sticky top-0 h-screen">
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
                  <div className="relative">
                    <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto">
                      <code>{npmCommand}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyNpm}
                      className="absolute right-2 top-2 h-6 px-2"
                    >
                      {copiedNpm ? (
                        <TrinilIcons.Check size={18} />
                      ) : (
                        <TrinilIcons.Copy size={18} />
                      )}
                    </Button>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <TrinilIcons.Download size={18} />
                  Download SVG
                </button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
      </div>
    </TooltipProvider>
  )
}