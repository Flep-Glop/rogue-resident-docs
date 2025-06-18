import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const dataPath = join(process.cwd(), 'data');
    
    // Load all JSON data files
    const loadJsonFile = (filename: string) => {
      try {
        const filePath = join(dataPath, filename);
        const fileContents = readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
      } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return {};
      }
    };

    const contextData = {
      bosses: loadJsonFile('bosses.json'),
      cards: loadJsonFile('cards.json'),
      mentors: loadJsonFile('mentors.json'),
      constants: loadJsonFile('constants.json'),
      content: loadJsonFile('content.json')
    };

    return NextResponse.json(contextData);
  } catch (error) {
    console.error('Error in context-data API:', error);
    return NextResponse.json(
      { error: 'Failed to load context data' },
      { status: 500 }
    );
  }
} 