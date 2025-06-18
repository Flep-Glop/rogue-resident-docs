import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { directory } = await request.json();
    
    if (!directory) {
      return NextResponse.json(
        { success: false, error: 'Directory path is required' },
        { status: 400 }
      );
    }

    // Resolve the directory path (relative to the docs project root)
    const docsPath = path.resolve(process.cwd(), '..');
    const targetPath = path.resolve(docsPath, directory);
    
    // Safety check: ensure we're only cleaning workflow directories
    if (!targetPath.includes('docs/workflow') && !targetPath.includes('docs\\workflow')) {
      return NextResponse.json(
        { success: false, error: 'Safety check failed: Can only clean workflow directories' },
        { status: 400 }
      );
    }

    let filesRemoved = 0;
    
    try {
      // Check if directory exists
      if (!fs.existsSync(targetPath)) {
        return NextResponse.json({
          success: true,
          message: 'Directory does not exist (already clean)',
          filesRemoved: 0
        });
      }

      // Read directory contents
      const files = fs.readdirSync(targetPath);
      
      // Filter to only remove markdown files (safety measure)
      const markdownFiles = files.filter(file => 
        file.endsWith('.md') && 
        (file.includes('-conversational') || 
         file.includes('-development-plan') || 
         file.includes('-implementation-context') ||
         file === 'README.md')
      );
      
      // Remove each markdown file
      for (const file of markdownFiles) {
        const filePath = path.join(targetPath, file);
        try {
          fs.unlinkSync(filePath);
          filesRemoved++;
        } catch (fileError) {
          console.warn(`Failed to remove file ${file}:`, fileError);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully cleaned up workflow directory`,
        filesRemoved,
        directory: targetPath
      });

    } catch (fsError) {
      console.error('File system error during cleanup:', fsError);
      return NextResponse.json(
        { success: false, error: `File system error: ${fsError}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during cleanup' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return information about cleanup functionality
  return NextResponse.json({
    success: true,
    description: 'Workflow directory cleanup API',
    safetyMeasures: [
      'Only cleans directories containing "docs/workflow"',
      'Only removes markdown files with specific naming patterns',
      'Preserves other files and directories'
    ],
    supportedFilePatterns: [
      '*-conversational.md',
      '*-development-plan.md', 
      '*-implementation-context.md',
      'README.md'
    ]
  });
} 