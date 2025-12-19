import { useRef, useState } from 'react';
import { Download, Copy, Check } from 'trinil-react';
import * as TrinilIcons from 'trinil-react';
import { Tabs, TabList, TabTrigger, TabContent } from './Tabs';

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
    <div className="fixed inset-0 z-30 lg:relative lg:w-80 lg:border-l lg:border-neutral-200 flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-neutral-200 px-6 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-neutral-900">Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col p-6 gap-6">
          {/* Icon Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-full aspect-square bg-neutral-50 rounded-lg" ref={iconPreviewRef}>
              <IconComponent size={96} color="#000000" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-neutral-900 text-center">{iconName}</h3>
              <div className="text-center text-xs text-neutral-500">Size: {iconSize}px</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={downloadSVG}
              className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Download SVG</span>
              <span className="sm:hidden">Download</span>
            </button>
            <button
              onClick={() => copyToClipboard(iconName, 'iconName')}
              className="flex items-center justify-center h-10 px-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              aria-label="Copy icon name"
            >
              {copiedItem === 'iconName' ? (
                <Check size={20} className="text-green-600" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="react" className="flex flex-col gap-4">
            <TabList className="gap-0">
              <TabTrigger value="react">React</TabTrigger>
              <TabTrigger value="vue">Vue</TabTrigger>
            </TabList>

            <TabContent value="react" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-neutral-700 font-medium">Install</span>
                  <button
                    onClick={() => copyToClipboard(reactInstallCmd, 'reactInstall')}
                    className="flex items-center justify-center h-8 px-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors shrink-0"
                    aria-label="Copy install command"
                  >
                    {copiedItem === 'reactInstall' ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-100 rounded-lg text-xs overflow-x-auto border border-neutral-200">
                  <code className="text-neutral-900">{reactInstallCmd}</code>
                </pre>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-neutral-700 font-medium">Usage</span>
                  <button
                    onClick={() => copyToClipboard(reactUsage, 'reactUsage')}
                    className="flex items-center justify-center h-8 px-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors shrink-0"
                    aria-label="Copy usage code"
                  >
                    {copiedItem === 'reactUsage' ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-100 rounded-lg text-xs overflow-x-auto border border-neutral-200">
                  <code className="text-neutral-900">{reactUsage}</code>
                </pre>
              </div>
            </TabContent>

            <TabContent value="vue" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-neutral-700 font-medium">Install</span>
                  <button
                    onClick={() => copyToClipboard(vueInstallCmd, 'vueInstall')}
                    className="flex items-center justify-center h-8 px-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors shrink-0"
                    aria-label="Copy install command"
                  >
                    {copiedItem === 'vueInstall' ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-100 rounded-lg text-xs overflow-x-auto border border-neutral-200">
                  <code className="text-neutral-900">{vueInstallCmd}</code>
                </pre>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-neutral-700 font-medium">Usage</span>
                  <button
                    onClick={() => copyToClipboard(vueUsage, 'vueUsage')}
                    className="flex items-center justify-center h-8 px-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors shrink-0"
                    aria-label="Copy usage code"
                  >
                    {copiedItem === 'vueUsage' ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-100 rounded-lg text-xs overflow-x-auto border border-neutral-200">
                  <code className="text-neutral-900">{vueUsage}</code>
                </pre>
              </div>
            </TabContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
