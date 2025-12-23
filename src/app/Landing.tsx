import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSlotShuffleAnimationStable } from './useSlotShuffleAnimationStable'
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

// Icônes flottantes pour l'effet parallax - Desktop (grandes, plus nombreuses)
const floatingIconsDesktop = [
  // Côté gauche
  { Icon: TrinilIcons.Heart, x: '5%', y: '12%', size: 40, depth: 0.3, rotate: -12 },
  { Icon: TrinilIcons.Coffee, x: '3%', y: '35%', size: 32, depth: 0.6, rotate: -15 },
  { Icon: TrinilIcons.Sparkle, x: '8%', y: '58%', size: 28, depth: 0.4, rotate: -8 },
  { Icon: TrinilIcons.Alarm, x: '2%', y: '78%', size: 26, depth: 0.65, rotate: -10 },
  { Icon: TrinilIcons.Camera, x: '12%', y: '88%', size: 30, depth: 0.55, rotate: -5 },
  { Icon: TrinilIcons.ColorPalette, x: '15%', y: '25%', size: 26, depth: 0.5, rotate: 8 },
  { Icon: TrinilIcons.Headphones, x: '10%', y: '45%', size: 24, depth: 0.7, rotate: -18 },
  { Icon: TrinilIcons.Gift, x: '6%', y: '68%', size: 28, depth: 0.45, rotate: 12 },
  
  // Côté droit
  { Icon: TrinilIcons.Star, x: '88%', y: '10%', size: 36, depth: 0.5, rotate: 15 },
  { Icon: TrinilIcons.Briefcase, x: '92%', y: '32%', size: 32, depth: 0.45, rotate: 10 },
  { Icon: TrinilIcons.Moon, x: '95%', y: '52%', size: 34, depth: 0.35, rotate: 20 },
  { Icon: TrinilIcons.AirplaneMode, x: '90%', y: '72%', size: 28, depth: 0.55, rotate: 25 },
  { Icon: TrinilIcons.Music, x: '85%', y: '85%', size: 30, depth: 0.4, rotate: 18 },
  { Icon: TrinilIcons.Globe, x: '93%', y: '18%', size: 24, depth: 0.6, rotate: -8 },
  { Icon: TrinilIcons.Bookmark, x: '87%', y: '42%', size: 26, depth: 0.5, rotate: -12 },
  { Icon: TrinilIcons.Bell, x: '96%', y: '62%', size: 24, depth: 0.7, rotate: 5 },
  
  // Haut centre (éloignés du titre)
  { Icon: TrinilIcons.Sun, x: '25%', y: '8%', size: 26, depth: 0.7, rotate: -20 },
  { Icon: TrinilIcons.Compass, x: '75%', y: '6%', size: 28, depth: 0.5, rotate: 12 },
  { Icon: TrinilIcons.Pencil, x: '35%', y: '5%', size: 22, depth: 0.8, rotate: 15 },
  { Icon: TrinilIcons.Diamond, x: '65%', y: '8%', size: 24, depth: 0.6, rotate: -10 },
  
  // Bas centre
  { Icon: TrinilIcons.Car, x: '30%', y: '92%', size: 28, depth: 0.55, rotate: -25 },
  { Icon: TrinilIcons.Trophy, x: '70%', y: '90%', size: 26, depth: 0.5, rotate: 20 },
  { Icon: TrinilIcons.Flag, x: '45%', y: '95%', size: 24, depth: 0.65, rotate: -5 },
  { Icon: TrinilIcons.Crown, x: '55%', y: '93%', size: 26, depth: 0.45, rotate: 10 },
]

// Icônes flottantes pour mobile (moins nombreuses, taille moyenne, positionnées sur les bords)
const floatingIconsMobile = [
  { Icon: TrinilIcons.Heart, x: '5%', y: '15%', size: 28, depth: 0.2, rotate: -10 },
  { Icon: TrinilIcons.Star, x: '90%', y: '12%', size: 26, depth: 0.25, rotate: 12 },
  { Icon: TrinilIcons.Sparkle, x: '8%', y: '75%', size: 24, depth: 0.3, rotate: -8 },
  { Icon: TrinilIcons.Moon, x: '88%', y: '70%', size: 26, depth: 0.2, rotate: 15 },
  { Icon: TrinilIcons.Coffee, x: '3%', y: '45%', size: 24, depth: 0.35, rotate: -12 },
  { Icon: TrinilIcons.Music, x: '92%', y: '42%', size: 24, depth: 0.3, rotate: 18 },
]

interface FloatingIconProps {
  Icon: React.ComponentType<{ size?: number; className?: string }>
  x: string
  y: string
  size: number
  depth: number
  rotate: number
  index: number
}

function FloatingIcon({ Icon, x, y, size, rotate, index }: FloatingIconProps) {
  return (
    <motion.div
      className="absolute text-muted-foreground/20 pointer-events-none"
      style={{
        left: x,
        top: y,
        rotate,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -8, 0], // Floating animation
      }}
      transition={{ 
        opacity: { duration: 0.6, delay: index * 0.05 },
        scale: { duration: 0.6, delay: index * 0.05, type: "spring", stiffness: 200 },
        y: { 
          duration: 3 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: index * 0.2 
        }
      }}
    >
      <Icon size={size} />
    </motion.div>
  )
}

interface LandingProps {
  onNavigateToIcons: () => void
  onNavigateToDesignSystem: () => void
}

export default function Landing({ onNavigateToIcons, onNavigateToDesignSystem }: LandingProps) {
  const [framework, setFramework] = useState('react')
  const [iconSize] = useState(24)
  
  // Bundles d'icônes pour raconter une mini-histoire
  const iconBundles = [
    [
      { name: 'Car', Icon: TrinilIcons.Car },
      { name: 'PhoneUp', Icon: TrinilIcons.PhoneUp },
      { name: 'Skull', Icon: TrinilIcons.Skull },
    ],
    [
      { name: 'Eye', Icon: TrinilIcons.EyeOpen },
      { name: 'Sparkle', Icon: TrinilIcons.Sparkle },
      { name: 'Heart', Icon: TrinilIcons.Heart },
    ],
    [
      { name: 'Tooth', Icon: TrinilIcons.Tooth },
      { name: 'Moon', Icon: TrinilIcons.Moon },
      { name: 'Cash', Icon: TrinilIcons.Cash },
    ],
    [
      { name: 'Alarm', Icon: TrinilIcons.Alarm },
      { name: 'Coffee', Icon: TrinilIcons.Coffee },
      { name: 'Briefcase', Icon: TrinilIcons.Briefcase },
    ],
  ]
  const [bundleIndex, setBundleIndex] = useState(0)
  const [displayedIndex, setDisplayedIndex] = useState(0)
  // Pour l'effet machine à sous : un état d'animation par slot (icône)
  const [slotStates, setSlotStates] = useState([0,0,0])
  const handleShuffle = () => setBundleIndex((i) => (i + 1) % iconBundles.length)

  // Auto-shuffle toutes les 3.33 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setBundleIndex((i) => (i + 1) % iconBundles.length)
    }, 3330)
    return () => clearInterval(interval)
  }, [iconBundles.length])

  // Effet shuffle animé
  useSlotShuffleAnimationStable({
    trigger: bundleIndex,
    onShuffleEnd: setDisplayedIndex,
    iconBundles,
    shuffleDuration: 700,
    shuffleInterval: 60,
    setSlotStates,
  })
  const isMobile = useIsMobile()
  
  // Sélection des icônes selon le device
  const floatingIcons = isMobile ? floatingIconsMobile : floatingIconsDesktop
  
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
        <section className="relative pt-24 pb-16 md:pt-48 md:pb-40 px-6 overflow-hidden">
          {/* Floating icons */}
          {floatingIcons.map((icon, index) => (
            <FloatingIcon
              key={index}
              {...icon}
              index={index}
            />
          ))}
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <motion.h1 
              className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Simple, professional Open-source icons
            </motion.h1>
            
            {/* KPI Badges */}
            <motion.div 
              className="flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                <TrinilIcons.Sparkle size={16} />
                <span>765+ handcrafted icons</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                <TrinilIcons.Feather size={16} />
                <span>&lt;1KB per icon</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                <TrinilIcons.Heart size={16} />
                <span>Open Source</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                <TrinilIcons.GitBranch size={16} />
                <span>Tree Shakable</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-row flex-wrap gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
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
            </motion.div>
          </div>
        </section>

        {/* Customize Section */}
        <section className="border-t border-border px-6">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "bg-background border-l border-r border-border overflow-hidden",
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
                  Ensure clear and consistent storytelling across your product with a reliable set of simple, readable icons.
                </p>
              </div>

              {/* Right - Icons Grid */}
              <div className={cn(
                "flex flex-col items-center px-10 border-border",
                isMobile ? "py-8 border-t" : "w-2/3 py-8"
              )}>
                {/* 3 centered icons et bouton shuffle sans le carré border */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <div className="flex gap-4 items-center justify-center w-full mb-4">
                    {iconBundles[displayedIndex].map(({name, Icon}, idx) => (
                      <motion.div
                        key={name + '-' + displayedIndex}
                        className="aspect-square w-24 h-24 rounded-xl border border-border bg-card flex items-center justify-center transition-colors overflow-hidden"
                        initial={{ scale: 0.85 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={iconSize} className="text-foreground" aria-label={name} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section - Icons in Context */}
        <section className="border-t border-border px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "bg-background border-l border-r border-border overflow-hidden",
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
                  Made with professionals in mind: Trinil contains every icon needed for commercial use across numerous industries.
                </p>
              </div>

              {/* Right - Image with UI */}
              <div className={cn(
                "flex flex-1 items-center justify-center px-10 border-border h-full",
                isMobile ? "py-8 border-t" : "w-2/3 py-8"
              )}>
                <BookingCard />
              </div>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="border-t border-border px-6">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "bg-background border-l border-r border-border overflow-hidden",
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
        <footer className="border-t border-border">
          {/* Mini Profile */}
          <div className="px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center border-l border-r border-border px-6 py-12">
              <img 
                src="https://github.com/5e1y.png" 
                alt="Rémi Courtillon"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col items-center sm:items-start gap-1">
                <span className="font-medium text-foreground">Rémi Courtillon</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/5e1y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.181.092-.916.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.286.098-2.676 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.39.203 2.423.1 2.676.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.194 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    @5e1y
                  </a>
                  <a
                    href="https://www.linkedin.com/in/remi-courtillon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Full-width separator */}
          <div className="border-t border-border" />
          
          {/* Bottom bar */}
          <div className="px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-l border-r border-border px-6 py-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Trinil Icons</span>
                <span className="text-muted-foreground">— Open Source Icon Library</span>
              </div>
              <a
                href="https://github.com/5e1y/trinil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub Repository
              </a>
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
    <div className="bg-white rounded-lg p-6 w-full max-w-[440px] border border-border space-y-4 flex flex-col justify-center" style={{ maxHeight: 'min(420px, 100vw)' }}>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">Ngawi, Indonesia</h3>
        <p className="text-sm text-muted-foreground flex items-center">
          <TrinilIcons.Location size={18} className="mr-2 shrink-0" />
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
                  "h-9 w-full px-3 py-2 font-normal text-sm flex items-center gap-2",
                  !checkIn && "text-muted-foreground"
                )}
              >
                  <TrinilIcons.Calandar size={18} className="shrink-0" />
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
                  "h-9 w-full px-3 py-2 font-normal text-sm flex items-center gap-2",
                  !checkOut && "text-muted-foreground"
                )}
              >
                  <TrinilIcons.Calandar size={18} className="shrink-0" />
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
              <TrinilIcons.User size={18} className="mr-2 shrink-0" />
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
      <div className="space-y-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">$89</span>
          <span className="text-sm text-muted-foreground">/night</span>
        </div>
        <Button className="w-full gap-2">
          Book now
          <TrinilIcons.ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
