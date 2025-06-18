import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { format, focusSystem } = await request.json();
    
    // Python execution is not available in deployed environment
    let command = `python3 scripts/export.py --format ${format || 'all'}`;
    if (focusSystem) command += ` --focus ${focusSystem}`;

    return NextResponse.json({
      success: false,
      error: 'Python export not available in deployed environment',
      solution: {
        title: 'Use Local Development Environment',
        steps: [
          `Run locally: ${command}`,
          'Execute from the project root directory',
          'Generated files will appear in the exports/ directory',
          'Data is pre-exported to JSON files for web app consumption'
        ],
        explanation: 'The deployed web app uses pre-exported JSON data for performance. Python exports require the full development environment.'
      },
      format: format || 'all',
      focusSystem,
      alternatives: {
        dataAccess: 'Browse all system data through the Library section',
        jsonData: 'All data is available as pre-exported JSON files',
        offlineExecution: 'Full Python export pipeline works in local development'
      }
    }, { status: 501 }) // 501 Not Implemented
  } catch (_error) {
    console.error('Python export error:', _error);
    return NextResponse.json(
      { success: false, error: 'Failed to run Python export' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Get available export formats and system status
  try {
    const statusData = {
      availableFormats: ['all', 'nextjs', 'claude', 'visual'],
      lastExport: new Date().toISOString(),
      systemStatus: 'ready'
    };
    
    return NextResponse.json(statusData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to get export status' },
      { status: 500 }
    );
  }
} 