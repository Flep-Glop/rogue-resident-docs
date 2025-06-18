import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { focusArea = 'all', includeArchives = false, exportReferences = false } = await request.json()
    
    // Document generation is not available in deployed environment
    // Users should use the offline workflow instead
    return NextResponse.json({
      success: false,
      error: 'Document generation not available in deployed environment',
      solution: {
        title: 'Use Offline Workflow Instead',
        steps: [
          'Run locally: python3 docs.py narrative ' + focusArea + (includeArchives ? ' --include-archives' : '') + (exportReferences ? ' --export-references' : ''),
          'Generated files will be in exports/ directory',
          'Copy files to your development environment as needed'
        ],
        explanation: 'The deployed web app uses pre-exported JSON data for performance and reliability. Document generation requires the full Python environment and source files.'
      },
      alternatives: {
        dataAccess: 'The web app can still browse and display all source data through the Library section',
        offlineGeneration: 'All document generation features work perfectly in local development environment'
      }
         }, { status: 501 }) // 501 Not Implemented
    
  } catch (error) {
    console.error('Error generating narrative workflow:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return available focus areas and options
  return NextResponse.json({
    focusAreas: [
      { 
        id: 'character', 
        name: 'Character Focus', 
        description: 'Character arcs, personalities, dialogue systems',
        systems: ['pico-character', 'amara-narrative', 'mentors']
      },
      { 
        id: 'world', 
        name: 'World Building', 
        description: 'Medical physics setting, constellation lore, environment',
        systems: ['constellation-phenomenon', 'visual-design', 'game-constants']
      },
      { 
        id: 'plot', 
        name: 'Plot & Progression', 
        description: 'Story progression, tutorial narrative, journal system',
        systems: ['journal-system', 'activity-framework', 'tutorial-design']
      },
      { 
        id: 'all', 
        name: 'Comprehensive', 
        description: 'Complete narrative documentation across all systems',
        systems: []
      }
    ],
    options: {
      includeArchives: {
        name: 'Include Archives',
        description: 'Include all design docs, character content, and game constants'
      },
      exportReferences: {
        name: 'Export References',
        description: 'Export referenced files to references/ directory instead of embedding inline'
      }
    }
  })
} 