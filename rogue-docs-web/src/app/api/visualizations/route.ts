import { NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vizType = searchParams.get('type');
    
    // Path to the exports directory (go up to parent directory)
    const exportsPath = join(process.cwd(), '..', 'exports');
    
    if (vizType) {
      // Get specific visualization
      const vizFile = `${vizType}.mmd`;
      const vizPath = join(exportsPath, vizFile);
      
      try {
        const mermaidContent = readFileSync(vizPath, 'utf8');
        return NextResponse.json({
          success: true,
          type: vizType,
          content: mermaidContent
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return NextResponse.json({
          success: false,
          error: `Visualization ${vizType} not found. Try running export first.`
        }, { status: 404 });
      }
    } else {
      // Get all available visualizations
      try {
        const files = readdirSync(exportsPath);
        const mermaidFiles = files.filter(file => file.endsWith('.mmd'));
        
        const visualizations = mermaidFiles.map(file => {
          const type = file.replace('.mmd', '');
          const content = readFileSync(join(exportsPath, file), 'utf8');
          
          return {
            type,
            name: formatVisualizationName(type),
            description: getVisualizationDescription(type),
            content,
            lastModified: new Date().toISOString()
          };
        });
        
        return NextResponse.json({
          success: true,
          visualizations
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return NextResponse.json({
          success: true,
          visualizations: [],
          message: 'No visualizations found. Run export to generate them.'
        });
      }
    }
  } catch (error) {
    console.error('Visualization API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load visualizations' },
      { status: 500 }
    );
  }
}

function formatVisualizationName(type: string): string {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getVisualizationDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'constellation-map': '🌟 Complete system relationship constellation - shows all interconnections',
    'hierarchy-map': '🚀 Priority-based system hierarchy - organized by implementation priority',
    'focused-pico-character-map': '🎯 Deep dive into Pico character system and connections',
    'focused-constellation-phenomenon-map': '🎯 Knowledge Constellation phenomenon deep dive',
    'focused-amara-narrative-map': '🎯 Amara Sato narrative system focus',
    'focused-journal-system-map': '🎯 Four-Journal progression system focus'
  };
  
  return descriptions[type] || `📊 ${formatVisualizationName(type)} system visualization`;
} 