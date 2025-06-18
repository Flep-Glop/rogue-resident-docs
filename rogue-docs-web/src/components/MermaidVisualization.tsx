'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidVisualizationProps {
  content: string;
  title: string;
  description?: string;
  className?: string;
}

export default function MermaidVisualization({ 
  content, 
  title, 
  description, 
  className = '' 
}: MermaidVisualizationProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mermaid, setMermaid] = useState<typeof import('mermaid').default | null>(null);

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaidModule = await import('mermaid');
        const mermaidInstance = mermaidModule.default;
        
        mermaidInstance.initialize({ 
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            primaryColor: '#4F46E5',
            primaryTextColor: '#FFFFFF',
            primaryBorderColor: '#4338CA',
            lineColor: '#6B7280',
            sectionBkgColor: '#F3F4F6',
            altSectionBkgColor: '#E5E7EB',
            gridColor: '#D1D5DB',
            secondaryColor: '#10B981',
            tertiaryColor: '#F59E0B'
          },
          flowchart: {
            nodeSpacing: 50,
            rankSpacing: 50,
            curve: 'basis'
          }
        });
        
        setMermaid(mermaidInstance);
      } catch (err) {
        console.error('Failed to load Mermaid:', err);
        setError('Failed to load visualization library');
        setIsLoading(false);
      }
    };

    loadMermaid();
  }, []);

  useEffect(() => {
    if (!mermaid || !mermaidRef.current) return;

    const renderDiagram = async () => {
      if (!content) {
        setIsLoading(false);
        setError(null);
        mermaidRef.current!.innerHTML = '<div class="text-center text-gray-500 py-12">No content for this visualization.</div>';
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Clear previous content
        mermaidRef.current!.innerHTML = '';
        
        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, content);
        
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          
          // Add click handlers to nodes for interactivity
          const nodes = mermaidRef.current.querySelectorAll('.node');
          nodes.forEach(node => {
            const htmlNode = node as HTMLElement;
            htmlNode.style.cursor = 'pointer';
            htmlNode.addEventListener('click', () => {
              const nodeText = htmlNode.textContent || '';
              console.log('Clicked node:', nodeText);
              // Could emit events or show details panel here
            });
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Failed to render diagram. Check diagram syntax.');
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [mermaid, content]);

  const downloadSVG = () => {
    if (!mermaidRef.current) return;
    
    const svg = mermaidRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${title.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const copyMermaidCode = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Mermaid code copied to clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={copyMermaidCode}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            title="Copy Mermaid Code"
          >
            📋 Copy Code
          </button>
          <button
            onClick={downloadSVG}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            title="Download SVG"
          >
            💾 Download SVG
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Rendering visualization...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="font-medium">Visualization Error</span>
            </div>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}
        
        <div 
          ref={mermaidRef} 
          className="mermaid-container overflow-auto"
          style={{ 
            minHeight: '400px',
            display: (isLoading || error) ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        />
      </div>
      
      {/* Interactive legend */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span>🌟 Core Systems</span>
          <span>⚡ Boss Encounters</span>
          <span>🎓 Mentors</span>
          <span>📖 Narrative</span>
          <span>⚙️ Support Systems</span>
          <span className="ml-auto">💡 Click nodes for details</span>
        </div>
      </div>
    </div>
  );
} 