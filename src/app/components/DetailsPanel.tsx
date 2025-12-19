import { useRef, useState } from 'react';
import { Cross, Download, Copy, Check } from 'trinil-react';
import * as TrinilIcons from 'trinil-react';
import * as Tabs from '@radix-ui/react-tabs';

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      // Fallback method for restricted contexts (like iframes)
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopiedItem(label);
          setTimeout(() => setCopiedItem(null), 2000);
        }
      } catch (err) {
        console.error('Fallback: Failed to copy:', err);
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadSVG = () => {
    if (!iconPreviewRef.current) return;

    // Find the SVG element
    const svgElement = iconPreviewRef.current.querySelector('svg');
    if (!svgElement) return;

    // Clone the SVG to modify it
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    // Ensure xmlns attribute exists
    if (!svgClone.hasAttribute('xmlns')) {
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Replace currentColor with black
    const elements = svgClone.querySelectorAll('[stroke="currentColor"]');
    elements.forEach((el) => {
      el.setAttribute('stroke', '#000000');
    });

    // Serialize the SVG
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    // Create blob and download
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

  const reactInstallCmd = reactVersion
    ? `npm i ${reactPkg}@${reactVersion}`
    : `npm i ${reactPkg}`;
  
  const vueInstallCmd = vueVersion
    ? `npm i ${vuePkg}@${vueVersion}`
    : `npm i ${vuePkg}`;

  const reactUsage = `<${iconName} size={24} />`;

  const vueUsage = `<${iconName} :size="24" />`;

  return (
    <div className="fixed inset-0 z-30 bg-white overflow-y-auto lg:relative lg:w-80 lg:border-l lg:border-neutral-200 lg:flex lg:flex-col lg:shrink-0">
      {/* Header */}
      <div className="sticky top-0 z-10 h-16 border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 bg-white lg:static">
        <h2 className="font-semibold text-neutral-900">Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Close details panel"
        >
          <Cross size={24} className="text-neutral-700" />
        </button>
      </div>

      {/* Content Container - Centered and Max Width on Mobile, Normal on Desktop */}
      <div className="max-w-2xl mx-auto px-6 py-8 lg:max-w-none lg:mx-0 lg:px-0 lg:py-0">
        {/* Preview */}
        <div className="space-y-3 mb-6 lg:p-[24px] lg:mb-0">
          <div className="flex items-center justify-center p-12 lg:p-8 bg-neutral-50 rounded-lg" ref={iconPreviewRef}>
            <IconComponent size={96} color="#000000" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-neutral-900 text-center">{iconName}</h3>
            <div className="flex justify-center gap-2 text-xs text-neutral-500">
              <span>Size: {iconSize}px</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-8 lg:px-6 lg:mt-[0px] lg:mr-[0px] lg:mb-[12px] lg:ml-[0px]">
          <button
            onClick={downloadSVG}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-neutral-900 text-white rounded-[12px] hover:bg-neutral-800 transition-colors text-[15px] font-bold font-normal"
          >
            <Download size={20} />
            Download SVG
          </button>
          <button
            onClick={() => copyToClipboard(iconName, 'iconName')}
            className="flex items-center justify-center gap-2 h-10 px-[8px] border border-neutral-300 rounded-[12px] hover:bg-neutral-50 transition-colors py-[0px]"
            aria-label="Copy icon name"
          >
            {copiedItem === 'iconName' ? (
              <Check size={20} className="text-green-600" />
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>

        {/* Install Tabs */}
        <Tabs.Root defaultValue="react" className="space-y-4 lg:px-6">
          <Tabs.List className="flex gap-2 border-b border-neutral-200">
            <Tabs.Trigger
              value="react"
              className="px-4 py-2 text-sm text-neutral-600 border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 transition-colors"
            >
              React
            </Tabs.Trigger>
            <Tabs.Trigger
              value="vue"
              className="px-4 py-2 text-sm text-neutral-600 border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:text-neutral-900 transition-colors"
            >
              Vue
            </Tabs.Trigger>
          </Tabs.List>

          {/* React Tab */}
          <Tabs.Content value="react" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Install</span>
                <button
                  onClick={() => copyToClipboard(reactInstallCmd, 'reactInstall')}
                  className="flex items-center justify-center gap-2 h-10 px-[8px] border border-neutral-300 rounded-[12px] hover:bg-neutral-50 transition-colors py-[0px]"
                  aria-label="Copy install command"
                >
                  {copiedItem === 'reactInstall' ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
              <pre className="p-3 bg-neutral-100 text-neutral-900 rounded-lg text-sm overflow-x-auto">
                <code>{reactInstallCmd}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Usage</span>
                <button
                  onClick={() => copyToClipboard(reactUsage, 'reactUsage')}
                  className="flex items-center justify-center gap-2 h-10 px-[8px] border border-neutral-300 rounded-[12px] hover:bg-neutral-50 transition-colors py-[0px]"
                  aria-label="Copy usage code"
                >
                  {copiedItem === 'reactUsage' ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
              <pre className="p-3 bg-neutral-100 text-neutral-900 rounded-lg text-sm overflow-x-auto">
                <code>{reactUsage}</code>
              </pre>
            </div>
          </Tabs.Content>

          {/* Vue Tab */}
          <Tabs.Content value="vue" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Install</span>
                <button
                  onClick={() => copyToClipboard(vueInstallCmd, 'vueInstall')}
                  className="flex items-center justify-center gap-2 h-10 px-[8px] border border-neutral-300 rounded-[12px] hover:bg-neutral-50 transition-colors py-[0px]"
                  aria-label="Copy install command"
                >
                  {copiedItem === 'vueInstall' ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
              <pre className="p-3 bg-neutral-100 text-neutral-900 rounded-lg text-sm overflow-x-auto">
                <code>{vueInstallCmd}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Usage</span>
                <button
                  onClick={() => copyToClipboard(vueUsage, 'vueUsage')}
                  className="flex items-center justify-center gap-2 h-10 px-[8px] border border-neutral-300 rounded-[12px] hover:bg-neutral-50 transition-colors py-[0px]"
                  aria-label="Copy usage code"
                >
                  {copiedItem === 'vueUsage' ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
              <pre className="p-3 bg-neutral-100 text-neutral-900 rounded-lg text-sm overflow-x-auto">
                <code>{vueUsage}</code>
              </pre>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}