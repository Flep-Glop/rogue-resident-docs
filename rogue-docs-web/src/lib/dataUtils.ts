import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface SystemData {
  system_info: {
    name: string;
    description: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export async function readDataFile(category: string, filename: string): Promise<SystemData | null> {
  try {
    const filePath = path.join(DATA_DIR, category, `${filename}.yaml`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContent) as SystemData;
    
    return data;
  } catch (error) {
    console.error(`Error reading ${category}/${filename}:`, error);
    return null;
  }
}

export async function writeDataFile(category: string, filename: string, data: SystemData): Promise<boolean> {
  try {
    const categoryDir = path.join(DATA_DIR, category);
    
    // Ensure directory exists
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const filePath = path.join(categoryDir, `${filename}.yaml`);
    const yamlContent = yaml.dump(data, { 
      indent: 2,
      lineWidth: 100,
      noRefs: true 
    });
    
    fs.writeFileSync(filePath, yamlContent, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${category}/${filename}:`, error);
    return false;
  }
}

export async function listDataFiles(category: string): Promise<string[]> {
  try {
    const categoryDir = path.join(DATA_DIR, category);
    
    if (!fs.existsSync(categoryDir)) {
      return [];
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.yaml'))
      .map(file => path.basename(file, '.yaml'));
    
    return files;
  } catch (error) {
    console.error(`Error listing files in ${category}:`, error);
    return [];
  }
}

export async function getAllData(category: string): Promise<Record<string, SystemData>> {
  const files = await listDataFiles(category);
  const allData: Record<string, SystemData> = {};
  
  for (const filename of files) {
    const data = await readDataFile(category, filename);
    if (data) {
      allData[filename] = data;
    }
  }
  
  return allData;
}

export async function validateCrossReferences(data: SystemData, category: string): Promise<string[]> {
  const errors: string[] = [];
  
  if (data.cross_references) {
    const refs = data.cross_references;
    
    // Check star references
    if (refs.stars && Array.isArray(refs.stars)) {
      const allStars = await getAllData('stars');
      const starIds = Object.values(allStars).flatMap(starFile => 
        Object.keys(starFile.stars || {})
      );
      
      for (const starRef of refs.stars) {
        if (!starIds.includes(starRef)) {
          errors.push(`Star reference '${starRef}' not found`);
        }
      }
    }
    
    // Check card references
    if (refs.cards && Array.isArray(refs.cards)) {
      const allCards = await getAllData('cards');
      const cardIds = Object.values(allCards).flatMap(cardFile => 
        Object.keys(cardFile.cards || {})
      );
      
      for (const cardRef of refs.cards) {
        if (!cardIds.includes(cardRef)) {
          errors.push(`Card reference '${cardRef}' not found`);
        }
      }
    }
  }
  
  return errors;
} 