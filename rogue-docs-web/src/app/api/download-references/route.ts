import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import JSZip from 'jszip';

function extractFileReferences(context: string): string[] {
  const references = new Set<string>();
  
  // Look for content references like "content/character-arcs/marcus-chen.md"
  const contentRegex = /content\/[^\s]+\.md/g;
  const contentMatches = context.match(contentRegex) || [];
  contentMatches.forEach(ref => references.add(ref));
  
  // Look for data references like "data/bosses/marcus-chen.yaml"
  const dataRegex = /data\/[^\s]+\.yaml/g;
  const dataMatches = context.match(dataRegex) || [];
  dataMatches.forEach(ref => references.add(ref));
  
  // Look for file paths mentioned in context like "See: content/..."
  const seeRegex = /See:?\s*`?([^`\s]+\.(?:md|yaml))`?/g;
  let match;
  while ((match = seeRegex.exec(context)) !== null) {
    references.add(match[1]);
  }
  
  // Look for **Reference**: patterns
  const refRegex = /\*\*Reference\*\*:\s*`?([^`\s]+\.(?:md|yaml))`?/g;
  while ((match = refRegex.exec(context)) !== null) {
    references.add(match[1]);
  }
  
  // Look for **Source**: patterns
  const sourceRegex = /\*\*Source\*\*:\s*`?([^`\s]+\.(?:md|yaml))`?/g;
  while ((match = sourceRegex.exec(context)) !== null) {
    references.add(match[1]);
  }
  
  return Array.from(references);
}

export async function POST(request: NextRequest) {
  try {
    const { context, systemId } = await request.json();
    
    if (!context) {
      return NextResponse.json({ error: 'No context provided' }, { status: 400 });
    }
    
    // Extract file references from the context
    const fileReferences = extractFileReferences(context);
    
    // Create a ZIP file
    const zip = new JSZip();
    
    // Add a README file explaining the download
    const readme = `# ${systemId} - Referenced Files
    
Generated: ${new Date().toISOString()}
System: ${systemId}

## Contents
This ZIP contains all source files referenced in the generated context documentation.

## File Structure
- content/ - Markdown narrative and design documents
- data/ - YAML structured data files

## Usage
These files provide the complete source material for the ${systemId} system.
Use them alongside the generated context for comprehensive understanding.

Referenced files in this package:
${fileReferences.map(ref => `- ${ref}`).join('\n')}
`;
    
    zip.file('README.md', readme);
    
    // Get the project root (go up from Next.js app to project root)
    const projectRoot = join(process.cwd(), '..');
    
    // Add referenced files to the ZIP
    let addedFiles = 0;
    for (const fileRef of fileReferences) {
      const filePath = join(projectRoot, fileRef);
      
      if (existsSync(filePath)) {
        try {
          const fileContent = readFileSync(filePath, 'utf8');
          zip.file(fileRef, fileContent);
          addedFiles++;
        } catch (error) {
          console.error(`Error reading file ${fileRef}:`, error);
          // Add an error note instead of the file
          zip.file(`${fileRef}.error.txt`, `Error reading file: ${error}`);
        }
      } else {
        // Add a note about missing file
        zip.file(`${fileRef}.missing.txt`, `File not found at: ${filePath}`);
      }
    }
    
    // If no files were found, add some default helpful files
    if (addedFiles === 0) {
      // Try to add some relevant files based on system ID
      const systemHints = [
        `data/bosses/${systemId.replace('-encounter', '')}.yaml`,
        `content/character-arcs/${systemId.replace('-encounter', '').replace('-system', '')}.md`,
        `data/constants/${systemId}.yaml`
      ];
      
      for (const hint of systemHints) {
        const hintPath = join(projectRoot, hint);
        if (existsSync(hintPath)) {
          try {
            const fileContent = readFileSync(hintPath, 'utf8');
            zip.file(hint, fileContent);
            addedFiles++;
          } catch (error) {
            console.error(`Error reading hint file ${hint}:`, error);
          }
        }
      }
    }
    
    // Generate the ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${systemId}-references.zip"`,
      },
    });
    
  } catch (error) {
    console.error('Error creating download:', error);
    return NextResponse.json(
      { error: 'Failed to create download package' },
      { status: 500 }
    );
  }
} 