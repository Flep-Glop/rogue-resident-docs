import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { focusArea = 'all', includeArchives = false, exportReferences = false } = await request.json()
    
    console.log(`🎭 Generating narrative workflow for: ${focusArea}`)
    
    // Build the command - adjust path to go up to the project root
    const args = [
      'scripts/export.py',
      '--format', 'narrative',
      '--focus-area', focusArea
    ]
    
    if (includeArchives) {
      args.push('--include-archives')
    }
    
    if (exportReferences) {
      args.push('--export-references')
    }
    
    // Execute the Python script from the project root
    const projectRoot = path.join(process.cwd(), '..')
    const result = await new Promise<{stdout: string, stderr: string}>((resolve, reject) => {
      const process = spawn('python3', args, {
        cwd: projectRoot,
        stdio: 'pipe'
      })
      
      let stdout = ''
      let stderr = ''
      
      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })
      
      process.stderr.on('data', (data) => {
        stderr += data.toString()
      })
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          reject(new Error(`Process exited with code ${code}: ${stderr}`))
        }
      })
      
      process.on('error', (error) => {
        reject(error)
      })
    })
    
    // Read the generated files from the project root
    const exportDir = path.join(projectRoot, 'exports')
    const focusSuffix = focusArea !== 'all' ? `-${focusArea}` : ''
    
    const files = {
      narrative_context: `narrative${focusSuffix}-context.md`,
      lore_implementation: `lore${focusSuffix}-implementation.md`,
      story_continuity: `story${focusSuffix}-continuity.md`
    }
    
    // Read file contents
    const fileContents: Record<string, string> = {}
    const fileInfo: Array<{name: string, size: number, lastModified: string}> = []
    
    for (const [key, filename] of Object.entries(files)) {
      try {
        const filePath = path.join(exportDir, filename)
        const content = await fs.readFile(filePath, 'utf-8')
        const stats = await fs.stat(filePath)
        
        fileContents[key] = content
        fileInfo.push({
          name: filename,
          size: stats.size,
          lastModified: stats.mtime.toISOString()
        })
      } catch (error) {
        console.warn(`Could not read file ${filename}:`, error)
        fileContents[key] = `Error reading file: ${filename}`
        fileInfo.push({
          name: filename,
          size: 0,
          lastModified: new Date().toISOString()
        })
      }
    }
    
    // Check for references directory
    const referencesInfo: Array<{name: string, size: number}> = []
    if (exportReferences) {
      try {
        const referencesDir = path.join(exportDir, 'references')
        const referenceFiles = await fs.readdir(referencesDir, { recursive: true })
        
        for (const file of referenceFiles) {
          if (typeof file === 'string') {
            try {
              const filePath = path.join(referencesDir, file)
              const stats = await fs.stat(filePath)
              if (stats.isFile()) {
                referencesInfo.push({
                  name: file,
                  size: stats.size
                })
              }
            } catch (error) {
              console.warn(`Could not stat reference file ${file}:`, error)
            }
          }
        }
      } catch (error) {
        console.warn('Could not read references directory:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      focusArea,
      includeArchives,
      exportReferences,
      files: fileContents,
      fileInfo,
      referencesInfo,
      generationLog: result.stdout,
      timestamp: new Date().toISOString()
    })
    
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