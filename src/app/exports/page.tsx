'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ExportResult {
  content: string;
  format: string;
  generatedAt: string;
  systems: string[];
}

export default function ExportsPage() {
  const [format, setFormat] = useState<string>('claude-context');
  const [includeSystems, setIncludeSystems] = useState<string[]>(['cards', 'stars']);
  const [includeRelated, setIncludeRelated] = useState(true);
  const [maxTokens, setMaxTokens] = useState<number | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);

  const formatOptions = [
    {
      value: 'claude-context',
      label: 'Claude Context',
      description: 'Optimized for Claude AI conversations with complete context'
    },
    {
      value: 'cursor-dev',
      label: 'Cursor Development',
      description: 'Implementation specifications for Cursor IDE development'
    },
    {
      value: 'team-review',
      label: 'Team Review',
      description: 'Summary format for team collaboration and review'
    },
    {
      value: 'system-overview',
      label: 'System Overview',
      description: 'Comprehensive system architecture documentation'
    }
  ];

  const systemOptions = [
    { value: 'cards', label: 'Application Cards' },
    { value: 'stars', label: 'Star System' },
    { value: 'mentors', label: 'Mentors' },
    { value: 'bosses', label: 'Boss Encounters' },
  ];

  const handleSystemToggle = (system: string) => {
    setIncludeSystems(prev => 
      prev.includes(system) 
        ? prev.filter(s => s !== system)
        : [...prev, system]
    );
  };

  const handleGenerate = async () => {
    if (includeSystems.length === 0) {
      toast.error('Please select at least one system to include');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          includeSystems,
          includeRelated,
          maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate export');
      }

      const result = await response.json();
      setLastExport(result);
      toast.success('Export generated successfully!');
    } catch (error) {
      console.error('Export generation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Export generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!lastExport) return;

    const blob = new Blob([lastExport.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rogue-resident-${lastExport.format}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Export downloaded!');
  };

  const handleCopyToClipboard = async () => {
    if (!lastExport) return;

    try {
      await navigator.clipboard.writeText(lastExport.content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Export</h1>
        <p className="text-gray-600 mt-2">
          Create targeted documentation exports for different use cases and audiences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Export Configuration</h2>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="space-y-2">
                {formatOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={option.value}
                      checked={format === option.value}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* System Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Systems
              </label>
              <div className="space-y-2">
                {systemOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSystems.includes(option.value)}
                      onChange={() => handleSystemToggle(option.value)}
                    />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRelated}
                  onChange={(e) => setIncludeRelated(e.target.checked)}
                />
                <span className="text-sm text-gray-900">Include related systems</span>
              </label>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens (optional)
              </label>
              <input
                type="number"
                value={maxTokens || ''}
                onChange={(e) => setMaxTokens(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Leave blank for no limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || includeSystems.length === 0}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Generate Export</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Export Preview</h2>
              {lastExport && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded flex items-center space-x-1"
                  >
                    <span>📋</span>
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded flex items-center space-x-1"
                  >
                    <span>💾</span>
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              {lastExport ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500">
                    Generated: {new Date(lastExport.generatedAt).toLocaleString()} | 
                    Format: {lastExport.format} | 
                    Systems: {lastExport.systems.join(', ')}
                  </div>
                  <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {lastExport.content}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📄</div>
                  <div>No export generated yet</div>
                  <div className="text-sm">Configure your export settings and click "Generate Export"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 