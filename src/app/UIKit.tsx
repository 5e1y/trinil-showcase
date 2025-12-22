import { useState } from 'react'
import * as TrinilIcons from 'trinil-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const COLORS = [
  { name: 'background', hex: '#ffffff', css: 'bg-background' },
  { name: 'foreground', hex: '#000000', css: 'bg-foreground' },
  { name: 'card', hex: '#f5f5f5', css: 'bg-card' },
  { name: 'card-foreground', hex: '#000000', css: 'bg-card text-card-foreground' },
  { name: 'primary', hex: '#3b82f6', css: 'bg-primary' },
  { name: 'primary-foreground', hex: '#ffffff', css: 'bg-primary text-primary-foreground' },
  { name: 'secondary', hex: '#6b7280', css: 'bg-secondary' },
  { name: 'secondary-foreground', hex: '#ffffff', css: 'bg-secondary text-secondary-foreground' },
  { name: 'destructive', hex: '#ef4444', css: 'bg-destructive' },
  { name: 'destructive-foreground', hex: '#ffffff', css: 'bg-destructive text-destructive-foreground' },
  { name: 'muted', hex: '#f3f4f6', css: 'bg-muted' },
  { name: 'muted-foreground', hex: '#6b7280', css: 'bg-muted text-muted-foreground' },
  { name: 'accent', hex: '#3b82f6', css: 'bg-accent' },
  { name: 'accent-foreground', hex: '#ffffff', css: 'bg-accent text-accent-foreground' },
  { name: 'border', hex: '#e5e7eb', css: 'bg-border' },
  { name: 'input', hex: '#e5e7eb', css: 'bg-input' },
  { name: 'ring', hex: '#3b82f6', css: 'ring-ring' },
]

export default function UIKit() {
  const [sliderValue, setSliderValue] = useState([50])
  const [selectedFramework, setSelectedFramework] = useState('react')

  return (
    <TooltipProvider>
      <ScrollArea className="h-screen w-full">
        <div className="p-8 space-y-16 bg-background text-foreground">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Design System - UI Kit</h1>
            <p className="text-lg text-muted-foreground">Complete foundation design for Trinil Showcase</p>
          </div>

          {/* Colors Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Colors</h2>
              <p className="text-muted-foreground mb-6">Design system color palette</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLORS.map((color) => (
                <div
                  key={color.name}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className={`h-24 rounded-md border border-border ${color.css}`} />
                  <div>
                    <p className="font-medium text-sm">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.hex}</p>
                    <p className="text-xs text-muted-foreground font-mono">.{color.css.split('-').pop()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Buttons Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
              <p className="text-muted-foreground mb-6">Button variants and states</p>
            </div>
            <div className="space-y-8">
              {/* Default variant */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Variant</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">Default</Button>
                  <Button variant="default" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Secondary variant */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Secondary Variant</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Destructive variant */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Destructive Variant</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="destructive" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Outline variant */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Outline Variant</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="outline">Outline</Button>
                  <Button variant="outline" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Ghost variant */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ghost Variant</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="ghost" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sizes</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With icons */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">With Icons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button className="gap-2">
                    <TrinilIcons.Download size={18} />
                    Download
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <TrinilIcons.Copy size={18} />
                    Copy
                  </Button>
                  <Button variant="ghost" className="gap-2">
                    <TrinilIcons.Check size={18} />
                    Confirmed
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Inputs Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Inputs</h2>
              <p className="text-muted-foreground mb-6">Input components and states</p>
            </div>
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Input</label>
                <Input placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disabled Input</label>
                <Input placeholder="Disabled..." disabled />
              </div>
            </div>
          </section>

          {/* Sliders Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Sliders</h2>
              <p className="text-muted-foreground mb-6">Range slider component</p>
            </div>
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon Size: {sliderValue[0]}px</label>
                <Slider value={sliderValue} onValueChange={setSliderValue} min={12} max={64} step={4} />
              </div>
            </div>
          </section>

          {/* Select Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Select</h2>
              <p className="text-muted-foreground mb-6">Dropdown select component</p>
            </div>
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Framework</label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Icons Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Icons</h2>
              <p className="text-muted-foreground mb-6">Trinil Icon Library - Common Icons</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <IconPreview icon="Check" component={TrinilIcons.Check} />
              <IconPreview icon="Copy" component={TrinilIcons.Copy} />
              <IconPreview icon="Download" component={TrinilIcons.Download} />
              <IconPreview icon="CircleCheck" component={TrinilIcons.CircleCheck} />
              <IconPreview icon="CircleCross" component={TrinilIcons.CircleCross} />
              <IconPreview icon="Cross" component={TrinilIcons.Cross} />
              <IconPreview icon="ChevronDown" component={TrinilIcons.ChevronDown} />
              <IconPreview icon="ChevronUp" component={TrinilIcons.ChevronUp} />
              <IconPreview icon="ChevronLeft" component={TrinilIcons.ChevronLeft} />
              <IconPreview icon="ChevronRight" component={TrinilIcons.ChevronRight} />
            </div>
          </section>

          {/* Spacing Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Spacing</h2>
              <p className="text-muted-foreground mb-6">Spacing scale (Tailwind)</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 6, 8].map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12">{size}rem</span>
                  <div
                    className="bg-primary rounded"
                    style={{ width: `${size * 16}px`, height: '20px' }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Typography</h2>
              <p className="text-muted-foreground mb-6">Text styles and hierarchy</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-4xl font-bold">Display (4xl)</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">Heading 1 (3xl)</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">Heading 2 (2xl)</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Heading 3 (xl)</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Heading 4 (lg)</p>
              </div>
              <div>
                <p className="text-base font-medium">Body text (base)</p>
              </div>
              <div>
                <p className="text-sm">Small text (sm)</p>
              </div>
              <div>
                <p className="text-xs">Extra small text (xs)</p>
              </div>
            </div>
          </section>

          {/* Border Radius Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Border Radius</h2>
              <p className="text-muted-foreground mb-6">Rounded corner variations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded" />
                <p className="text-sm font-medium">rounded</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-md" />
                <p className="text-sm font-medium">rounded-md</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-lg" />
                <p className="text-sm font-medium">rounded-lg</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-xl" />
                <p className="text-sm font-medium">rounded-xl</p>
              </div>
            </div>
          </section>

          {/* Shadows Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Shadows</h2>
              <p className="text-muted-foreground mb-6">Shadow variations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="h-24 bg-card border border-border rounded-lg shadow-sm" />
              <div className="h-24 bg-card border border-border rounded-lg shadow" />
              <div className="h-24 bg-card border border-border rounded-lg shadow-md" />
              <div className="h-24 bg-card border border-border rounded-lg shadow-lg" />
              <div className="h-24 bg-card border border-border rounded-lg shadow-xl" />
            </div>
          </section>
        </div>
      </ScrollArea>
    </TooltipProvider>
  )
}

function IconPreview({ icon, component: Component }: { icon: string; component: React.ComponentType<any> }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="border border-border rounded-lg p-4 flex items-center justify-center h-24 hover:bg-muted cursor-pointer transition-colors">
          <Component size={32} className="text-foreground" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{icon}</TooltipContent>
    </Tooltip>
  )
}
