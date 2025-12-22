import { useRef, useEffect, useState } from 'react'
import * as TrinilIcons from 'trinil-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/components/ui/use-mobile'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onNavigateHome: () => void
  onNavigateToIcons: () => void
  onNavigateToDesignSystem: () => void
  currentPage: 'landing' | 'home'
}

export default function Header({ 
  onNavigateHome, 
  onNavigateToIcons, 
  onNavigateToDesignSystem,
  currentPage
}: HeaderProps) {
  const isMobile = useIsMobile()
  const tabs = [
    { id: 'landing', label: 'Home', onClick: onNavigateHome },
    { id: 'home', label: 'Icons', onClick: onNavigateToIcons },
  ]

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorWidth, setIndicatorWidth] = useState(0)
  const [indicatorLeft, setIndicatorLeft] = useState(0)

  useEffect(() => {
    const activeButton = buttonRefs.current[currentPage]
    const container = containerRef.current
    if (activeButton && container) {
      // Position du bouton actif relative au container
      const buttonLeft = activeButton.offsetLeft
      const buttonWidth = activeButton.offsetWidth
      setIndicatorWidth(buttonWidth)
      setIndicatorLeft(buttonLeft)
    }
  }, [currentPage])

  return (
    <nav className={cn(
      "border-b",
      currentPage === "landing"
        ? "sticky top-0 z-50 bg-background"
        : isMobile
          ? "sticky top-0 z-50 bg-background"
          : "relative bg-background/80 backdrop-blur-sm"
    )}>
      <div className="px-6 flex items-center justify-between">
        <button 
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold text-lg">Trinil</span>
        </button>
        <div className="flex items-center gap-8">
          {/* Tabs wrapper avec style Button ghost */}
          <div ref={containerRef} className="flex flex-col py-0 self-end relative">
            <div className="flex items-center gap-1 mt-3 mb-3">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  ref={(el) => {
                    if (el) buttonRefs.current[tab.id] = el
                  }}
                  variant="ghost"
                  size="sm"
                  onClick={tab.onClick}
                  className="text-sm"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            {/* Indicateur actif - trait noir au bas des boutons */}
            {indicatorWidth > 0 && (
              <div 
                className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
                style={{
                  width: `${indicatorWidth}px`,
                  marginLeft: `${indicatorLeft}px`,
                }}
              />
            )}
          </div>

          <a
            href="https://github.com/5e1y/trinil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.181.092-.916.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.286.098-2.676 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.39.203 2.423.1 2.676.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.194 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
