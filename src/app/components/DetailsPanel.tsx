import { useRef, useState } from 'react';
import { Download, Copy, Check } from 'trinil-react';
import * as TrinilIcons from 'trinil-react';
import { Button } from './Button';
import { Select } from './Select';
import './DetailsPanel.css';

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
    <div className="ds-details-panel">
      {/* Header */}
      <div className="ds-details-panel-header">
        <h2>Details</h2>
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
      <div className="ds-details-panel-content">
        <div className="ds-details-panel-body">
          {/* Icon Preview */}
          <div className="ds-icon-preview">
            {/* Icon at 160px with 12x12 grid background */}
            <div 
              ref={iconPreviewRef}
              className="ds-icon-preview-grid"
            >
              {/* 12x12 Grid behind icon */}
              <svg 
                width="160" 
                height="160" 
                viewBox="0 0 12 12" 
                className="ds-icon-preview-grid-svg"
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
              <div className="ds-icon-preview-icon">
                <IconComponent size={160} color="var(--ds-color-text)" />
              </div>
            </div>

            <div className="ds-icon-preview-info">
              <h3>{iconName}</h3>
              <div className="ds-icon-preview-size">Size: {iconSize}px</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ds-details-actions">
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
          <div className="ds-code-snippets">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
              ]}
            />

            <div className="ds-code-snippets-content">
              {selectedLanguage === 'react' && (
                <>
                  <div className="ds-code-block">
                    <div className="ds-code-block-header">
                      <span>Install</span>
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
                    <pre className="ds-code-pre">
                      <code>{reactInstallCmd}</code>
                    </pre>
                  </div>

                  <div className="ds-code-block">
                    <div className="ds-code-block-header">
                      <span>Usage</span>
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
                    <pre className="ds-code-pre">
                      <code>{reactUsage}</code>
                    </pre>
                  </div>
                </>
              )}

              {selectedLanguage === 'vue' && (
                <>
                  <div className="ds-code-block">
                    <div className="ds-code-block-header">
                      <span>Install</span>
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
                    <pre className="ds-code-pre">
                      <code>{vueInstallCmd}</code>
                    </pre>
                  </div>

                  <div className="ds-code-block">
                    <div className="ds-code-block-header">
                      <span>Usage</span>
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
                    <pre className="ds-code-pre">
                      <code>{vueUsage}</code>
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
