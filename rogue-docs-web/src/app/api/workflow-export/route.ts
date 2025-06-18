import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { system, includeArchives = false, copyTo = null } = await request.json();
    
    if (!system) {
      return NextResponse.json(
        { success: false, error: 'System name is required' },
        { status: 400 }
      );
    }

    // Document generation is not available in deployed environment
    // Users should use the offline workflow instead
    let command = `python3 docs.py workflow ${system} --export-references`;
    if (includeArchives) command += ' --include-archives';
    if (copyTo) command += ` --copy-to "${copyTo}"`;

    return NextResponse.json({
      success: false,
      error: 'Three-audience workflow generation not available in deployed environment',
      solution: {
        title: 'Use Offline Workflow Instead',
        steps: [
          `Run locally: ${command}`,
          'Generated files will be in exports/ directory:',
          `  • ${system}-conversational.md (Design discussions)`,
          `  • ${system}-development-plan.md (Implementation planning)`, 
          `  • ${system}-implementation-context.md (LLM collaboration)`,
          'References will be in exports/references/ directory',
          copyTo ? `Files will also be copied to: ${copyTo}` : 'Optional: Use --copy-to to copy files elsewhere'
        ],
        explanation: 'The three-audience workflow system requires Python templates and full source access. The deployed app provides data browsing only.'
      },
      system,
      includeArchives,
      copyTo,
      alternatives: {
        dataAccess: `Browse ${system} data through the Library section`,
        offlineGeneration: 'Full three-audience workflow works perfectly in local development environment',
        preBuiltDocs: 'Check if pre-generated docs exist in your exports/ directory'
      }
         }, { status: 501 }) // 501 Not Implemented

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