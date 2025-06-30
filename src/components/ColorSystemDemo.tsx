import React, { useState } from 'react';
import { Palette, Eye, Copy, Check } from 'lucide-react';
import { colorSystem, semanticColors, accessibilityGuidelines, colorHierarchy } from '../styles/colorSystem';

export const ColorSystemDemo: React.FC = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof colorSystem>('yinmn_blue');

  const copyToClipboard = (color: string, name: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const ColorSwatch: React.FC<{ 
    color: string; 
    name: string; 
    shade: string; 
    usage: string;
  }> = ({ color, name, shade, usage }) => (
    <div 
      className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
      onClick={() => copyToClipboard(color, `${name}-${shade}`)}
    >
      <div 
        className="h-16 w-full"
        style={{ backgroundColor: color }}
      />
      <div className="p-3 bg-white dark:bg-gray-800 border-t">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {shade}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {copiedColor === `${name}-${shade}` ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} className="text-gray-400" />
            )}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mb-1">
          {color}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 leading-tight">
          {usage}
        </div>
      </div>
    </div>
  );

  const ContrastExample: React.FC<{
    bg: string;
    text: string;
    label: string;
    ratio: string;
    safe: boolean;
  }> = ({ bg, text, label, ratio, safe }) => (
    <div 
      className="p-4 rounded-lg border-2"
      style={{ 
        backgroundColor: bg, 
        color: text,
        borderColor: safe ? '#22c55e' : '#ef4444'
      }}
    >
      <div className="font-medium mb-1">{label}</div>
      <div className="text-sm opacity-80">Contrast ratio: {ratio}</div>
      <div className="text-xs mt-2">
        {safe ? '✓ WCAG AA Compliant' : '✗ Insufficient contrast'}
      </div>
    </div>
  );

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-8">
        <Palette size={28} className="text-yinmn-blue-500" />
        <h2 className="text-3xl font-light text-primary">Color System Demo</h2>
      </div>

      {/* Palette Selector */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-primary mb-4">Select Color Palette</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(colorSystem).filter(key => !key.includes('success') && !key.includes('warning') && !key.includes('error') && !key.includes('info')).map((paletteName) => (
            <button
              key={paletteName}
              onClick={() => setSelectedPalette(paletteName as keyof typeof colorSystem)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPalette === paletteName
                  ? 'btn-primary'
                  : 'btn-tertiary'
              }`}
            >
              {paletteName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatches */}
      <div className="mb-12">
        <h3 className="text-xl font-medium text-primary mb-4">
          {selectedPalette.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Palette
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.entries(colorSystem[selectedPalette] as Record<string, string>).map(([shade, color]) => (
            <ColorSwatch
              key={shade}
              color={color}
              name={selectedPalette}
              shade={shade}
              usage={`Shade ${shade} usage`}
            />
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div className="mb-12">
        <h3 className="text-xl font-medium text-primary mb-4">Semantic Color Mappings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Light Mode */}
          <div>
            <h4 className="text-lg font-medium text-secondary mb-4">Light Mode</h4>
            <div className="space-y-4">
              {Object.entries(semanticColors.light).map(([category, colors]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h5 className="font-medium text-primary mb-3 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(colors as Record<string, string>).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-secondary capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dark Mode */}
          <div>
            <h4 className="text-lg font-medium text-secondary mb-4">Dark Mode</h4>
            <div className="space-y-4">
              {Object.entries(semanticColors.dark).map(([category, colors]) => (
                <div key={category} className="border rounded-lg p-4 bg-gray-900">
                  <h5 className="font-medium text-white mb-3 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(colors as Record<string, string>).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-gray-300 capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Examples */}
      <div className="mb-12">
        <h3 className="text-xl font-medium text-primary mb-4 flex items-center gap-2">
          <Eye size={20} />
          Accessibility & Contrast Examples
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-success mb-4">✓ Safe Combinations (WCAG AA)</h4>
            <div className="space-y-3">
              <ContrastExample
                bg="#ffffff"
                text="#0a0c0e"
                label="White background, Rich Black text"
                ratio="21:1"
                safe={true}
              />
              <ContrastExample
                bg="#0a0c0e"
                text="#ffffff"
                label="Rich Black background, White text"
                ratio="21:1"
                safe={true}
              />
              <ContrastExample
                bg="#f0f4f8"
                text="#243b53"
                label="Oxford Blue 50 background, Oxford Blue 800 text"
                ratio="12:1"
                safe={true}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-error mb-4">✗ Avoid These Combinations</h4>
            <div className="space-y-3">
              <ContrastExample
                bg="#ffffff"
                text="#94a3b8"
                label="White background, Silver Lake Blue 400 text"
                ratio="3.2:1"
                safe={false}
              />
              <ContrastExample
                bg="#fafafa"
                text="#bdbdbd"
                label="Platinum 200 background, Platinum 600 text"
                ratio="2.8:1"
                safe={false}
              />
              <ContrastExample
                bg="#e0f2fe"
                text="#7dd3fc"
                label="YInMn Blue 100 background, YInMn Blue 300 text"
                ratio="2.1:1"
                safe={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Button Hierarchy Examples */}
      <div className="mb-12">
        <h3 className="text-xl font-medium text-primary mb-4">Button Hierarchy Examples</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-secondary mb-3">Light Mode</h4>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary px-6 py-3 rounded-lg font-medium">
                Primary Action
              </button>
              <button className="btn-secondary px-6 py-3 rounded-lg font-medium">
                Secondary Action
              </button>
              <button className="btn-tertiary px-6 py-3 rounded-lg font-medium">
                Tertiary Action
              </button>
            </div>
          </div>

          <div className="p-6 bg-rich-black-900 rounded-lg">
            <h4 className="text-lg font-medium text-platinum-100 mb-3">Dark Mode</h4>
            <div className="flex flex-wrap gap-4">
              <button 
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: colorSystem.yinmn_blue[400],
                  color: colorSystem.rich_black[900]
                }}
              >
                Primary Action
              </button>
              <button 
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: colorSystem.oxford_blue[400],
                  color: colorSystem.rich_black[900]
                }}
              >
                Secondary Action
              </button>
              <button 
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 border-2"
                style={{
                  backgroundColor: 'transparent',
                  color: colorSystem.platinum[300],
                  borderColor: colorSystem.silver_lake_blue[600]
                }}
              >
                Tertiary Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div>
        <h3 className="text-xl font-medium text-primary mb-4">System State Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="status-success p-4 rounded-lg text-center">
            <div className="font-medium">Success</div>
            <div className="text-sm opacity-80">Completed actions</div>
          </div>
          <div className="status-warning p-4 rounded-lg text-center">
            <div className="font-medium">Warning</div>
            <div className="text-sm opacity-80">Caution required</div>
          </div>
          <div className="status-error p-4 rounded-lg text-center">
            <div className="font-medium">Error</div>
            <div className="text-sm opacity-80">Failed actions</div>
          </div>
          <div className="status-info p-4 rounded-lg text-center">
            <div className="font-medium">Info</div>
            <div className="text-sm opacity-80">Additional context</div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-12 p-6 bg-yinmn-blue-50 dark:bg-oxford-blue-900 rounded-lg border-2 border-yinmn-blue-200 dark:border-oxford-blue-700">
        <h4 className="text-lg font-medium text-primary mb-3">How to Use This Color System</h4>
        <ul className="text-secondary space-y-2 text-sm leading-relaxed">
          <li>• Click any color swatch to copy its hex value to clipboard</li>
          <li>• Use CSS custom properties (--rich-black-500) for consistent theming</li>
          <li>• Follow the semantic color mappings for consistent UI patterns</li>
          <li>• Always test color combinations for WCAG AA compliance (4.5:1 contrast ratio)</li>
          <li>• Use the button hierarchy to establish clear visual importance</li>
          <li>• System state colors should only be used for their intended purposes</li>
        </ul>
      </div>
    </div>
  );
};