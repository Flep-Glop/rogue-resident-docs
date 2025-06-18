import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { format, focusSystem } = await request.json();
    
    // Path to the Python export script (go up to parent directory)
    const scriptPath = join(process.cwd(), '..', 'scripts', 'export.py');
    const pythonArgs = ['python3', scriptPath, '--format', format || 'all'];
    
    if (focusSystem) {
      pythonArgs.push('--focus', focusSystem);
    }

    return new Promise<NextResponse>((resolve) => {
      const python = spawn(pythonArgs[0], pythonArgs.slice(1), {
        cwd: join(process.cwd(), '..'), // Run from parent directory
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ 
            success: true, 
            output: stdout,
            format: format
          }));
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: stderr || 'Export failed',
            code: code
          }, { status: 500 }));
        }
      });
    });
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