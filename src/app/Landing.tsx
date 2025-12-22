import { useState } from 'react'
import { format } from 'date-fns'
import * as TrinilIcons from 'trinil-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/components/ui/use-mobile'
import { cn } from '@/lib/utils'
import Header from './components/Header'

interface LandingProps {
  onNavigateToIcons: () => void
  onNavigateToDesignSystem: () => void
}

export default function Landing({ onNavigateToIcons, onNavigateToDesignSystem }: LandingProps) {
  const [framework, setFramework] = useState('react')
  const [iconSize, setIconSize] = useState(24)
  const isMobile = useIsMobile()
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header 
          onNavigateHome={() => {}} 
          onNavigateToIcons={onNavigateToIcons}
          onNavigateToDesignSystem={onNavigateToDesignSystem}
          currentPage="landing"
        />

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
              <TrinilIcons.Sparkle size={16} />
              <span>765+ handcrafted icons</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Simple, professional
              <span className="text-primary"> open-source icons</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Trinil is a collection of 1.5px stroke icons for modern interfaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="default" onClick={onNavigateToIcons}>
                <TrinilIcons.Plugins size={20} />
                Browse icons
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/5e1y/trinil" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.181.092-.916.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.286.098-2.676 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.39.203 2.423.1 2.676.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.194 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>



        {/* Key Values Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-8 text-center text-sm">
              <div className="flex-1 min-w-[200px]">
                <p className="text-2xl font-semibold text-primary mb-1">765+</p>
                <p className="text-muted-foreground">Handcrafted icons</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-2xl font-semibold text-primary mb-1">&lt;1KB</p>
                <p className="text-muted-foreground">Per icon gzipped</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-2xl font-semibold text-primary mb-1">Open Source</p>
                <p className="text-muted-foreground">MIT License</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-2xl font-semibold text-primary mb-1">Tree Shakable</p>
                <p className="text-muted-foreground">Reduces bundle size</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customize Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "bg-background border border-border rounded-3xl overflow-hidden",
              isMobile ? "flex flex-col" : "flex h-[28rem]"
            )}>
              
              {/* Left - Title */}
              <div className={cn(
                "flex flex-col justify-center px-10 border-border",
                isMobile ? "py-8" : "w-1/3 border-r"
              )}>
                <p className={cn(
                  "font-medium text-foreground leading-relaxed",
                  isMobile ? "text-lg" : "text-2xl"
                )}>
                  Customize the size, the color, and aria-labels at will. The style, however, is locked to ensure consistency.
                </p>
              </div>

              {/* Right - Icons Grid */}
              <div className={cn(
                "flex flex-col items-center px-10 border-border",
                isMobile ? "py-8 border-t" : "w-2/3 py-8"
              )}>
                <div className="w-full max-w-[420px] flex flex-col h-full border border-border rounded-lg overflow-hidden">
                  {/* Icon Size Slider - Sticky at top */}
                  <div className="sticky top-0 z-20 bg-background space-y-2 px-6 pt-5 pb-5 border-b border-border">
                    <label className="text-sm font-medium">Icon size: {iconSize}px</label>
                    <Slider
                      value={[iconSize]}
                      onValueChange={(value) => setIconSize(value[0])}
                      min={12}
                      max={64}
                      step={4}
                      className="w-full"
                    />
                  </div>

                  {/* Icons Grid - Scrollable area */}
                  <div className="overflow-y-auto flex-1 px-6 py-5 max-h-[420px]">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3">
                      {Object.entries(TrinilIcons).map(([name, Icon]) => (
                        <Tooltip key={name}>
                          <TooltipTrigger asChild>
                            <button
                              aria-label={name}
                              className="aspect-square rounded-lg border transition-colors border-border bg-card hover:bg-accent hover:border-accent-foreground/20 p-2 flex items-center justify-center"
                            >
                              <Icon size={iconSize} aria-hidden="true" className="text-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{name}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section - Icons in Context */}
        <section className="py-8 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "bg-background border border-border rounded-3xl overflow-hidden",
              isMobile ? "flex flex-col" : "flex h-[28rem]"
            )}>
              
              {/* Left - Title */}
              <div className={cn(
                "flex flex-col justify-center px-10 border-border",
                isMobile ? "py-8" : "w-1/3 border-r"
              )}>
                <p className={cn(
                  "font-medium text-foreground leading-relaxed",
                  isMobile ? "text-lg" : "text-2xl"
                )}>
                  Made with professional use in mind. Every icon follows strict design principles for consistency across your products.
                </p>
              </div>

              {/* Right - Image with UI */}
              <div className={cn(
                "flex flex-col items-center px-10 border-border",
                isMobile ? "py-8 border-t" : "w-2/3 py-8"
              )}>
                <div className="w-full max-w-[420px] flex items-center justify-center border border-border rounded-lg overflow-hidden h-full">
                  <BookingCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "bg-background border border-border rounded-3xl overflow-hidden",
              isMobile ? "flex flex-col" : "flex h-[28rem]"
            )}>
              
              {/* Left - Title */}
              <div className={cn(
                "flex flex-col justify-center px-10 border-border",
                isMobile ? "py-8" : "w-1/3 border-r"
              )}>
                <p className={cn(
                  "font-medium text-foreground leading-relaxed mb-6",
                  isMobile ? "text-lg" : "text-2xl"
                )}>
                  Install and use in seconds. Multiple packages available — React, Vue, (more soon) — pick what fits your stack.
                </p>
              </div>

              {/* Right - Code Snippets */}
              <div className={cn(
                "flex flex-col justify-center items-center px-10 border-border",
                isMobile ? "py-8 border-t" : "w-2/3"
              )}>
                <div className="w-full max-w-[440px] space-y-4">
                  {/* Framework Selector */}
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                    </SelectContent>
                  </Select>

                  <CodeBlock code={framework === 'react' ? 'npm install trinil-react' : 'npm install trinil-vue'} />
                  <CodeBlock 
                    code={framework === 'react' ? `import { Heart, Star, Check } from 'trinil-react'

function App() {
  return (
    <div className="flex gap-4">
      <Heart size={24} />
      <Star size={24} />
      <Check size={24} />
    </div>
  )
}` : `import { Heart, Star, Check } from 'trinil-vue'

export default {
  components: { Heart, Star, Check },
  template: \`
    <div class="flex gap-4">
      <Heart :size="24" />
      <Star :size="24" />
      <Check :size="24" />
    </div>
  \`
}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Trinil Icons</span>
              <span className="text-muted-foreground">— Open Source Icon Library</span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/5e1y/trinil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <button
                onClick={onNavigateToDesignSystem}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Design System
              </button>
              <button
                onClick={onNavigateToIcons}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Icons
              </button>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// Stat Card Component
function StatCard({ number, label, sublabel }: { 
  number: string
  label: string
  sublabel?: string 
}) {
  return (
    <div className="space-y-1">
      <p className="text-4xl font-bold text-primary">{number}</p>
      <p className="text-lg font-medium">{label}</p>
      {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
    </div>
  )
}

// Code Block Component
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="relative text-left">
      <pre className="rounded-md bg-muted p-3 text-xs text-foreground font-mono overflow-x-auto">
        <code className="whitespace-pre-wrap break-words">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 h-6 w-6 p-1 rounded bg-muted hover:bg-border transition-colors flex items-center justify-center"
      >
        {copied ? (
          <TrinilIcons.Check size={16} />
        ) : (
          <TrinilIcons.Copy size={16} />
        )}
      </button>
    </div>
  )
}

// Booking Card Component - UI demo with icons
function BookingCard() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState('2')
  
  return (
    <div className="bg-white rounded-lg p-6 w-full h-full space-y-4 flex flex-col justify-center">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">Ngawi, Indonesia</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <TrinilIcons.Location size={14} />
          East Java
        </p>
      </div>
      
      {/* Check-in & Check-out */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Check-in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-between px-3 py-2 font-normal text-sm",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <TrinilIcons.Calandar size={14} className="mr-2 shrink-0" />
                <span className="flex-1 text-left truncate">
                  {checkIn ? format(checkIn, "MMM d") : "Select"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Check-out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-between px-3 py-2 font-normal text-sm",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <TrinilIcons.Calandar size={14} className="mr-2 shrink-0" />
                <span className="flex-1 text-left truncate">
                  {checkOut ? format(checkOut, "MMM d") : "Select"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Guests</label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="h-9">
            <TrinilIcons.User size={14} className="mr-2 shrink-0" />
            <span className="flex-1 text-left truncate">
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 guest</SelectItem>
            <SelectItem value="2">2 guests</SelectItem>
            <SelectItem value="3">3 guests</SelectItem>
            <SelectItem value="4">4 guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price & CTA */}
      <div className="pt-3 border-t space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">$89</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrinilIcons.Star size={12} className="fill-current text-yellow-500" />
            4.9 (128)
          </p>
        </div>
        <Button className="w-full gap-2">
          Book now
          <TrinilIcons.ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
