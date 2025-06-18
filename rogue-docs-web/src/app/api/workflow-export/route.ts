import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { system, includeArchives = false, copyTo = null } = await request.json();
    
    if (!system) {
      return NextResponse.json(
        { success: false, error: 'System name is required' },
        { status: 400 }
      );
    }

    // Path to the docs project root (adjust based on your setup)
    const docsPath = path.resolve(process.cwd(), '..');
    const exportsPath = path.join(docsPath, 'exports');

    // Build command with enhanced options
    const command = ['docs.py', 'workflow', system];
    
    // Always export references to get latest content documentation
    command.push('--export-references');
    
    if (includeArchives) {
      command.push('--include-archives');
    }
    if (copyTo) {
      command.push('--copy-to', copyTo);
    }

    // Run the enhanced workflow export command
    const result = await new Promise<{ 
      success: boolean; 
      error?: string; 
      documents?: { 
        conversational?: string; 
        planning?: string; 
        implementation?: string; 
      }; 
      references?: { 
        path: string; 
        files: string[]; 
        count: number; 
      } | null; 
      output?: string; 
      enhanced?: boolean; 
      copiedTo?: string; 
    }>((resolve) => {
      const process = spawn('python3', command, {
        cwd: docsPath,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          // Success - try to read the generated files
          try {
            const documents = {
              conversational: fs.readFileSync(
                path.join(exportsPath, `${system}-conversational.md`), 
                'utf-8'
              ),
              planning: fs.readFileSync(
                path.join(exportsPath, `${system}-development-plan.md`), 
                'utf-8'
              ),
              implementation: fs.readFileSync(
                path.join(exportsPath, `${system}-implementation-context.md`), 
                'utf-8'
              )
            };

            // Check if references directory was created
            const referencesPath = path.join(exportsPath, 'references');
            let referencesInfo = null;
            if (fs.existsSync(referencesPath)) {
              const referenceFiles = fs.readdirSync(referencesPath, { withFileTypes: true })
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name);
              referencesInfo = {
                path: 'references/',
                files: referenceFiles,
                count: referenceFiles.length
              };
            }

            resolve({ 
              success: true, 
              documents,
              references: referencesInfo,
              output: stdout,
              enhanced: includeArchives,
              copiedTo: copyTo || undefined
            });
          } catch (readError) {
            resolve({ 
              success: false, 
              error: `Generated files successfully but couldn't read them: ${readError}` 
            });
          }
        } else {
          resolve({ 
            success: false, 
            error: `Export process failed with code ${code}: ${stderr || stdout}` 
          });
        }
      });

      process.on('error', (error) => {
        resolve({ 
          success: false, 
          error: `Failed to start export process: ${error.message}` 
        });
      });
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Workflow export error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available workflow systems
  return NextResponse.json({
    success: true,
    systems: [
      {
        id: 'activity-interface',
        name: 'Activity Interface System',
        description: 'Hospital exploration and dialogue system components',
        status: 'active',
        priority: 'high',
        components: 4
      },
      {
        id: 'card-system',
        name: 'Card System', 
        description: '26 application cards across 4 domains',
        status: 'planning',
        priority: 'high',
        components: 26
      },
      {
        id: 'mentor-system',
        name: 'Mentor System',
        description: 'Four mentor characters with unique teaching styles',
        status: 'complete',
        priority: 'medium',
        components: 4
      }
    ]
  });
} 