import { NextResponse } from 'next/server';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface FileItem {
  name: string;
  path: string;
  type: 'yaml' | 'markdown' | 'json';
  category: string;
  size?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function categorizeFile(filePath: string): string {
  // Handle data directory structure
  if (filePath.includes('data/character-arcs') || filePath.includes('content/character-arcs')) return 'character-arcs';
  if (filePath.includes('data/bosses')) return 'bosses';
  if (filePath.includes('data/cards') || filePath.includes('content/cards')) return 'cards';
  if (filePath.includes('data/mentors') || filePath.includes('content/mentors')) return 'mentors';
  if (filePath.includes('data/constants')) return 'constants';
  if (filePath.includes('data/stars')) return 'constants'; // Group stars with constants
  if (filePath.includes('data/relationships')) return 'constants'; // Group relationships with constants
  
  // Handle content directory structure
  if (filePath.includes('content/amara-journals')) return 'character-arcs'; // Group journals with character arcs
  if (filePath.includes('visual-design') || filePath.includes('design')) return 'design';
  if (filePath.includes('framework') || filePath.includes('activity') || filePath.includes('educational')) return 'framework';
  if (filePath.includes('challenge-system') || filePath.includes('build-strategies') || filePath.includes('qa-testing')) return 'framework';
  if (filePath.includes('master-gdd') || filePath.includes('core-systems')) return 'design';
  if (filePath.includes('time-system') || filePath.includes('content-creation')) return 'design';
  
  return 'design'; // default category
}

function scanDirectory(dirPath: string, baseDir: string, files: FileItem[], content: Record<string, string>) {
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(fullPath, baseDir, files, content);
      } else if (stat.isFile()) {
        const ext = item.split('.').pop()?.toLowerCase();
        let fileType: 'yaml' | 'markdown' | 'json' | null = null;
        
        if (ext === 'yaml' || ext === 'yml') fileType = 'yaml';
        else if (ext === 'md' || ext === 'markdown') fileType = 'markdown';
        else if (ext === 'json') fileType = 'json';
        
        if (fileType) {
          const relativePath = fullPath.replace(baseDir + '/', '');
          const category = categorizeFile(relativePath);
          
          files.push({
            name: item,
            path: relativePath,
            type: fileType,
            category,
            size: formatFileSize(stat.size)
          });
          
          // Read file content
          try {
            const fileContent = readFileSync(fullPath, 'utf8');
            content[relativePath] = fileContent;
          } catch (error) {
            console.error(`Error reading file ${relativePath}:`, error);
            content[relativePath] = `Error reading file: ${error}`;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const files: FileItem[] = [];
    const content: Record<string, string> = {};
    
    // Scan the parent directory to get to the actual source files
    const parentRoot = join(projectRoot, '..');
    
    // Scan data directory (YAML source files)
    const dataPath = join(parentRoot, 'data');
    scanDirectory(dataPath, parentRoot, files, content);
    
    // Scan content directory (Markdown source files)
    const contentPath = join(parentRoot, 'content');
    scanDirectory(contentPath, parentRoot, files, content);
    
    // Sort files by category and then by name
    files.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    const libraryData = {
      files,
      content
    };
    
    return NextResponse.json(libraryData);
  } catch (error) {
    console.error('Error in library-data API:', error);
    return NextResponse.json(
      { error: 'Failed to load library data' },
      { status: 500 }
    );
  }
} 