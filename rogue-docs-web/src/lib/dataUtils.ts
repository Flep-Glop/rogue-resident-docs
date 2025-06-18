import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface SystemData {
  system_info: {
    name: string;
    description: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Read from consolidated JSON files instead of individual YAML files
export async function readDataFile(category: string, filename: string): Promise<SystemData | null> {
  try {
    // Read from the consolidated JSON file for this category
    const jsonFilePath = path.join(DATA_DIR, `${category}.json`);
    
    if (!fs.existsSync(jsonFilePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const allData = JSON.parse(fileContent);
    
    // Return the specific file data from the consolidated structure
    return allData[filename] || null;
  } catch (error) {
    console.error(`Error reading ${category}/${filename}:`, error);
    return null;
  }
}

export async function writeDataFile(category: string, filename: string, data: SystemData): Promise<boolean> {
  try {
    // Note: Writing back to JSON files is not supported in this architecture
    // Data should be edited in YAML files and re-exported using: python3 docs.py export nextjs
    console.warn('Writing to JSON files is not supported. Edit YAML files and run: python3 docs.py export nextjs');
    return false;
  } catch (error) {
    console.error(`Error writing ${category}/${filename}:`, error);
    return false;
  }
}

export async function listDataFiles(category: string): Promise<string[]> {
  try {
    // Read from the consolidated JSON file for this category
    const jsonFilePath = path.join(DATA_DIR, `${category}.json`);
    
    if (!fs.existsSync(jsonFilePath)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const allData = JSON.parse(fileContent);
    
    // Return the keys (filenames) from the consolidated data
    return Object.keys(allData);
  } catch (error) {
    console.error(`Error listing files in ${category}:`, error);
    return [];
  }
}

export async function getAllData(category: string): Promise<Record<string, SystemData>> {
  try {
    // Read the entire consolidated JSON file for this category
    const jsonFilePath = path.join(DATA_DIR, `${category}.json`);
    
    if (!fs.existsSync(jsonFilePath)) {
      return {};
    }
    
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const allData = JSON.parse(fileContent);
    
    return allData;
  } catch (error) {
    console.error(`Error reading all data for ${category}:`, error);
    return {};
  }
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

export async function getAvailableSystems(): Promise<string[]> {
  try {
    // Check what interface systems are available
    const jsonFilePath = path.join(DATA_DIR, 'interfaces.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      // Fallback to checking individual category files
      const availableSystems = [];
      const categories = ['interfaces', 'bosses', 'mentors', 'cards', 'constants'];
      
      for (const category of categories) {
        const categoryPath = path.join(DATA_DIR, `${category}.json`);
        if (fs.existsSync(categoryPath)) {
          const content = fs.readFileSync(categoryPath, 'utf8');
          const data = JSON.parse(content);
          availableSystems.push(...Object.keys(data));
        }
      }
      
      return [...new Set(availableSystems)]; // Remove duplicates
    }
    
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const interfacesData = JSON.parse(fileContent);
    
    return Object.keys(interfacesData);
  } catch (error) {
    console.error('Error getting available systems:', error);
    return ['activity-interface', 'mentors-interface', 'tutorial-flows']; // Fallback
  }
} 