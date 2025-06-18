import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const docPath = searchParams.get('path')
    
    const exportsDir = path.join(process.cwd(), 'public', 'exports')
    
    // If specific document requested, serve it
    if (docPath) {
      try {
        const filePath = path.join(exportsDir, docPath)
        
        // Security: ensure we're not accessing files outside exports directory
        if (!filePath.startsWith(exportsDir)) {
          return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
        }
        
        const content = await fs.readFile(filePath, 'utf-8')
        const stats = await fs.stat(filePath)
        
        return NextResponse.json({
          content,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          path: docPath
        })
      } catch (error) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
    }
    
    // Otherwise, list available documents
    try {
      const files = await fs.readdir(exportsDir, { recursive: true })
      const documents = []
      
      for (const file of files) {
        if (typeof file === 'string' && file.endsWith('.md')) {
          try {
            const filePath = path.join(exportsDir, file)
            const stats = await fs.stat(filePath)
            
            // Categorize documents
            let category = 'other'
            let type = 'document'
            let focusArea = 'general'
            
            // Technical Workflow Documents
            if (file.includes('conversational')) {
              category = 'workflow'
              type = 'conversational'
            } else if (file.includes('development-plan')) {
              category = 'workflow'
              type = 'planning'
            } else if (file.includes('implementation-context')) {
              category = 'workflow'
              type = 'implementation'
            }
            
            // Narrative Workflow Documents
            else if (file.includes('narrative') && file.includes('context')) {
              category = 'narrative'
              type = 'context'
              // Determine focus area
              if (file.includes('character')) focusArea = 'character'
              else if (file.includes('plot')) focusArea = 'plot'
              else if (file.includes('world')) focusArea = 'world'
              else focusArea = 'all'
            } else if (file.includes('lore') && file.includes('implementation')) {
              category = 'narrative'
              type = 'implementation'
              // Determine focus area
              if (file.includes('character')) focusArea = 'character'
              else if (file.includes('plot')) focusArea = 'plot'
              else if (file.includes('world')) focusArea = 'world'
              else focusArea = 'all'
            } else if (file.includes('story') && file.includes('continuity')) {
              category = 'narrative'
              type = 'continuity'
              // Determine focus area
              if (file.includes('character')) focusArea = 'character'
              else if (file.includes('plot')) focusArea = 'plot'
              else if (file.includes('world')) focusArea = 'world'
              else focusArea = 'all'
            } 
            
            // Other Documents
            else if (file.includes('claude-context')) {
              category = 'export'
              type = 'claude'
            } else if (file.endsWith('.mmd')) {
              category = 'visualization'
              type = 'mermaid'
            } else if (file.includes('boss-narrative')) {
              category = 'narrative'
              type = 'worldbuilding'
            }
            
            documents.push({
              name: file,
              path: file,
              category,
              type,
              focusArea,
              size: stats.size,
              lastModified: stats.mtime.toISOString(),
              displayName: file.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            })
          } catch (error) {
            console.warn(`Could not stat file ${file}:`, error)
          }
        }
      }
      
      // Sort by category and name
      documents.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category)
        }
        return a.name.localeCompare(b.name)
      })
      
      return NextResponse.json({
        documents,
        categories: {
          workflow: documents.filter(d => d.category === 'workflow'),
          narrative: documents.filter(d => d.category === 'narrative'),
          export: documents.filter(d => d.category === 'export'),
          visualization: documents.filter(d => d.category === 'visualization'),
          other: documents.filter(d => d.category === 'other')
        },
        narrativeFocusAreas: {
          all: documents.filter(d => d.category === 'narrative' && d.focusArea === 'all'),
          character: documents.filter(d => d.category === 'narrative' && d.focusArea === 'character'),
          plot: documents.filter(d => d.category === 'narrative' && d.focusArea === 'plot'),
          world: documents.filter(d => d.category === 'narrative' && d.focusArea === 'world'),
          general: documents.filter(d => d.category === 'narrative' && d.focusArea === 'general')
        },
        total: documents.length,
        lastGenerated: documents.length > 0 ? documents[0].lastModified : null
      })
      
    } catch (error) {
      return NextResponse.json({
        documents: [],
        categories: { workflow: [], narrative: [], export: [], other: [] },
        total: 0,
        lastGenerated: null,
        note: 'No generated documents found. Documents are generated during build process.'
      })
    }
    
  } catch (error) {
    console.error('Error in generated-docs API:', error)
    return NextResponse.json(
      { error: 'Failed to load generated documents' },
      { status: 500 }
    )
  }
} 