import { useRef, useState } from 'react';
import { Download, Copy, Check } from 'trinil-react';
import * as TrinilIcons from 'trinil-react';
import { Button } from './Button';
import { Select } from './Select';

interface DetailsPanelProps {
  iconName: string;
  iconSize: number;
  onClose: () => void;
  reactPkg: string;
  vuePkg: string;
  reactVersion?: string;
  vueVersion?: string;
}

export function DetailsPanel({
  iconName,
  iconSize,
  onClose,
  reactPkg,
  vuePkg,
  reactVersion,
  vueVersion,
}: DetailsPanelProps) {
  const iconPreviewRef = useRef<HTMLDivElement>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('react');

  const IconComponent = TrinilIcons[iconName as keyof typeof TrinilIcons] as React.ComponentType<{
    size?: number;
    color?: string;
  }>;

  const copyToClipboard = (text: string, label: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedItem(label);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const downloadSVG = () => {
    if (!iconPreviewRef.current) return;
    const svgElement = iconPreviewRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    if (!svgClone.hasAttribute('xmlns')) {
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    svgClone.querySelectorAll('[stroke="currentColor"]').forEach((el) => {
      el.setAttribute('stroke', '#000000');
    });

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${iconName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reactInstallCmd = reactVersion ? `npm i ${reactPkg}@${reactVersion}` : `npm i ${reactPkg}`;
  const vueInstallCmd = vueVersion ? `npm i ${vuePkg}@${vueVersion}` : `npm i ${vuePkg}`;
  const reactUsage = `<${iconName} size={24} />`;
  const vueUsage = `<${iconName} :size="24" />`;

  return (
    <div className="fixed inset-0 z-30 lg:relative lg:w-80 lg:border-l lg:border-[var(--ds-color-border)] flex flex-col bg-[var(--ds-color-surface)] shadow-[var(--ds-shadow-soft)]">
      {/* Header */}
      <div className="h-16 border-b border-[var(--ds-color-border)] px-6 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-[var(--ds-color-text)]">Details</h2>
        <Button
          onClick={onClose}
          icon
          variant="secondary"
          aria-label="Close details panel"
        >
          ✕
        </Button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col p-6 gap-6">
          {/* Icon Preview */}
          <div className="flex flex-col gap-3">
            {/* Icon at 160px with 12x12 grid background */}
            <div 
              ref={iconPreviewRef}
              className="mx-auto relative flex items-center justify-center"
            >
              {/* 12x12 Grid behind icon */}
              <svg 
                width="160" 
                height="160" 
                viewBox="0 0 12 12" 
                className="absolute rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)]"
                style={{ backgroundColor: 'var(--ds-color-surface)' }}
              >
                {/* Vertical lines */}
                {Array.from({ length: 13 }).map((_, i) => (
                  <line 
                    key={`v${i}`}
                    x1={i} 
                    y1="0" 
                    x2={i} 
                    y2="12" 
                    stroke="var(--ds-color-border)" 
                    strokeWidth="0.05"
                  />
                ))}
                {/* Horizontal lines */}
                {Array.from({ length: 13 }).map((_, i) => (
                  <line 
                    key={`h${i}`}
                    x1="0" 
                    y1={i} 
                    x2="12" 
                    y2={i} 
                    stroke="var(--ds-color-border)" 
                    strokeWidth="0.05"
                  />
                ))}
              </svg>
              
              {/* Icon on top */}
              <div className="relative z-10">
                <IconComponent size={160} color="var(--ds-color-text)" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-[var(--ds-color-text)] text-center">{iconName}</h3>
              <div className="text-center text-xs text-[var(--ds-color-text-muted)]">Size: {iconSize}px</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={downloadSVG}
              variant="primary"
              className="flex-1"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Download SVG</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <Button
              onClick={() => copyToClipboard(iconName, 'iconName')}
              icon
              variant="secondary"
              aria-label="Copy icon name"
            >
              {copiedItem === 'iconName' ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} />
              )}
            </Button>
          </div>

          {/* Code Snippets Section */}
            <div className="flex flex-col gap-4">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
              ]}
            />

            <div className="space-y-4">
              {selectedLanguage === 'react' && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-[var(--ds-color-text-subtle)] font-medium">Install</span>
                      <Button
                        onClick={() => copyToClipboard(reactInstallCmd, 'reactInstall')}
                        icon
                        variant="secondary"
                        aria-label="Copy install command"
                      >
                        {copiedItem === 'reactInstall' ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 bg-[var(--ds-color-input)] rounded-[var(--ds-radius-md)] text-xs overflow-x-auto border border-[var(--ds-color-border)]">
                      <code className="text-[var(--ds-color-text)]">{reactInstallCmd}</code>
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[var(--ds-color-text-subtle)] font-medium">Usage</span>
                      <Button
                        onClick={() => copyToClipboard(reactUsage, 'reactUsage')}
                        icon
                        variant="secondary"
                        aria-label="Copy usage code"
                      >
                        {copiedItem === 'reactUsage' ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 bg-[var(--ds-color-input)] rounded-[var(--ds-radius-md)] text-xs overflow-x-auto border border-[var(--ds-color-border)]">
                      <code className="text-[var(--ds-color-text)]">{reactUsage}</code>
                    </pre>
                  </div>
                </>
              )}

              {selectedLanguage === 'vue' && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[var(--ds-color-text-subtle)] font-medium">Install</span>
                      <Button
                        onClick={() => copyToClipboard(vueInstallCmd, 'vueInstall')}
                        icon
                        variant="secondary"
                        aria-label="Copy install command"
                      >
                        {copiedItem === 'vueInstall' ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 bg-[var(--ds-color-input)] rounded-[var(--ds-radius-md)] text-xs overflow-x-auto border border-[var(--ds-color-border)]">
                      <code className="text-[var(--ds-color-text)]">{vueInstallCmd}</code>
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[var(--ds-color-text-subtle)] font-medium">Usage</span>
                      <Button
                        onClick={() => copyToClipboard(vueUsage, 'vueUsage')}
                        icon
                        variant="secondary"
                        aria-label="Copy usage code"
                      >
                        {copiedItem === 'vueUsage' ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 bg-[var(--ds-color-input)] rounded-[var(--ds-radius-md)] text-xs overflow-x-auto border border-[var(--ds-color-border)]">
                      <code className="text-[var(--ds-color-text)]">{vueUsage}</code>
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
