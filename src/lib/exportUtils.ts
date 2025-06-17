import { SystemData, getAllData } from './dataUtils';
import fs from 'fs';
import path from 'path';

export interface ExportOptions {
  format: 'claude-context' | 'cursor-dev' | 'team-review' | 'system-overview';
  includeSystems: string[];
  includeRelated: boolean;
  maxTokens?: number;
}

interface ContentDoc {
  filename: string;
  title: string;
  content: string;
  version?: string;
  lastUpdated?: string;
}

async function loadContentDocumentation(): Promise<Record<string, ContentDoc>> {
  const contentDocs: Record<string, ContentDoc> = {};
  const contentDir = path.join(process.cwd(), 'content');
  
  if (!fs.existsSync(contentDir)) {
    return contentDocs;
  }
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .filter(file => !file.startsWith('.'));
  
  for (const filename of files) {
    try {
      const filePath = path.join(contentDir, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract title from first h1
      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
      
      // Extract version if available
      const versionMatch = content.match(/\*\*Document Version:\*\* (.+)$/m);
      const version = versionMatch ? versionMatch[1] : undefined;
      
      // Extract last updated if available
      const updatedMatch = content.match(/\*\*Last Updated:\*\* (.+)$/m);
      const lastUpdated = updatedMatch ? updatedMatch[1] : undefined;
      
      contentDocs[filename.replace('.md', '')] = {
        filename,
        title,
        content,
        version,
        lastUpdated
      };
    } catch (error) {
      console.error(`Error loading content doc ${filename}:`, error);
    }
  }
  
  return contentDocs;
}

export async function generateExport(options: ExportOptions): Promise<string> {
  const { format, includeSystems, includeRelated } = options;
  
  // Gather data for requested systems
  const allData: Record<string, Record<string, SystemData>> = {};
  
  for (const system of includeSystems) {
    allData[system] = await getAllData(system);
  }
  
  // Load content documentation if including related documents
  const contentDocs = includeRelated ? await loadContentDocumentation() : {};
  
  // Generate export based on format
  switch (format) {
    case 'claude-context':
      return generateClaudeContext(allData, contentDocs, options);
    case 'cursor-dev':
      return generateCursorDev(allData, contentDocs, options);
    case 'team-review':
      return generateTeamReview(allData, contentDocs, options);
    case 'system-overview':
      return generateSystemOverview(allData, contentDocs, options);
    default:
      throw new Error(`Unknown export format: ${format}`);
  }
}

function generateClaudeContext(allData: Record<string, Record<string, SystemData>>, contentDocs: Record<string, ContentDoc>, options: ExportOptions): string {
  let output = `# Rogue Resident Game Documentation\n`;
  output += `*Generated for Claude AI context - ${new Date().toISOString()}*\n\n`;
  
  output += `## Executive Summary\n`;
  output += `Rogue Resident is an educational game for radiation therapy training featuring:\n`;
  output += `- Application cards system for hands-on learning\n`;
  output += `- Star-based progression across 4 domains (TP, IM, PH, QA)\n`;
  output += `- Complex relationships between cards, stars, and mentors\n`;
  output += `- Professional simulation approach with dual system architecture\n\n`;
  
  // Add content documentation if available
  if (Object.keys(contentDocs).length > 0) {
    output += `## Core Design Documentation\n\n`;
    
    // Prioritize certain documents for Claude context
    const priorityDocs = ['master-gdd', 'visual-design-philosophy', 'core-systems-design', 'activity-framework'];
    const processedDocs = new Set<string>();
    
    // Add priority documents first
    for (const docKey of priorityDocs) {
      if (contentDocs[docKey]) {
        const doc = contentDocs[docKey];
        output += `### ${doc.title}\n`;
        if (doc.version) output += `**Version**: ${doc.version}  \n`;
        if (doc.lastUpdated) output += `**Last Updated**: ${doc.lastUpdated}  \n`;
        output += `\n${doc.content}\n\n---\n\n`;
        processedDocs.add(docKey);
      }
    }
    
    // Add remaining documents
    for (const [docKey, doc] of Object.entries(contentDocs)) {
      if (!processedDocs.has(docKey)) {
        output += `### ${doc.title}\n`;
        if (doc.version) output += `**Version**: ${doc.version}  \n`;
        if (doc.lastUpdated) output += `**Last Updated**: ${doc.lastUpdated}  \n`;
        output += `\n${doc.content}\n\n---\n\n`;
      }
    }
  }
  
  // Cards section
  if (allData.cards && Object.keys(allData.cards).length > 0) {
    output += `## Application Cards System\n\n`;
    
    for (const [systemKey, systemData] of Object.entries(allData.cards)) {
      output += `### ${systemData.system_info.name}\n`;
      output += `${systemData.system_info.description}\n\n`;
      
      if (systemData.cards) {
        for (const [cardId, card] of Object.entries(systemData.cards)) {
          const cardData = card as any;
          output += `#### ${cardData.name} (${cardData.domain})\n`;
          output += `- **Passive**: ${cardData.passive_effect}\n`;
          output += `- **Active**: ${cardData.active_effect}\n`;
          output += `- **Cost**: ${cardData.insight_cost} Insight\n`;
          output += `- **Star**: ${cardData.associated_star}\n`;
          output += `- **Priority**: ${cardData.implementation_priority}\n`;
          if (cardData.cursor_notes) {
            output += `- **Dev Notes**: ${cardData.cursor_notes}\n`;
          }
          output += `\n`;
        }
      }
    }
  }
  
  // Stars section
  if (allData.stars && Object.keys(allData.stars).length > 0) {
    output += `## Star System\n\n`;
    
    for (const [systemKey, systemData] of Object.entries(allData.stars)) {
      output += `### ${systemData.system_info.name}\n`;
      output += `${systemData.system_info.description}\n\n`;
      
      if (systemData.stars) {
        for (const [starId, star] of Object.entries(systemData.stars)) {
          const starData = star as any;
          output += `#### ${starData.name} (${starData.domain})\n`;
          output += `${starData.description}\n\n`;
          output += `**Requirements:**\n`;
          starData.requirements.forEach((req: string) => {
            output += `- ${req}\n`;
          });
          output += `\n**Rewards:**\n`;
          starData.rewards.forEach((reward: string) => {
            output += `- ${reward}\n`;
          });
          output += `\n`;
        }
      }
    }
  }
  
  // Cross-references section
  output += `## System Relationships\n\n`;
  output += `The following relationships exist between systems:\n\n`;
  
  for (const [systemType, systems] of Object.entries(allData)) {
    for (const [systemKey, systemData] of Object.entries(systems)) {
      if (systemData.cross_references) {
        output += `### ${systemData.system_info.name} References\n`;
        for (const [refType, refs] of Object.entries(systemData.cross_references)) {
          if (Array.isArray(refs) && refs.length > 0) {
            output += `- **${refType}**: ${refs.join(', ')}\n`;
          }
        }
        output += `\n`;
      }
    }
  }
  
  return output;
}

function generateCursorDev(allData: Record<string, Record<string, SystemData>>, contentDocs: Record<string, ContentDoc>, options: ExportOptions): string {
  let output = `# Development Specification: Rogue Resident\n`;
  output += `*Generated for Cursor IDE development - ${new Date().toISOString()}*\n\n`;
  
  output += `## Implementation Overview\n`;
  output += `This specification provides implementation details for the Rogue Resident game systems.\n\n`;
  
  // High-priority cards for implementation
  if (allData.cards) {
    output += `## Priority Implementation: Application Cards\n\n`;
    
    const highPriorityCards: any[] = [];
    const mediumPriorityCards: any[] = [];
    
    for (const [systemKey, systemData] of Object.entries(allData.cards)) {
      if (systemData.cards) {
        for (const [cardId, card] of Object.entries(systemData.cards)) {
          const cardData = card as any;
          if (cardData.implementation_priority === 'high') {
            highPriorityCards.push({ id: cardId, ...cardData });
          } else if (cardData.implementation_priority === 'medium') {
            mediumPriorityCards.push({ id: cardId, ...cardData });
          }
        }
      }
    }
    
    output += `### High Priority Cards (${highPriorityCards.length} cards)\n\n`;
    highPriorityCards.forEach(card => {
      output += `#### ${card.name} - PRIORITY HIGH\n`;
      output += `**File**: \`src/cards/${card.domain.toLowerCase()}/${card.id}.ts\`\n\n`;
      output += `**Core Logic**:\n`;
      output += `\`\`\`typescript\n`;
      output += `class ${card.name.replace(/\s+/g, '')}Card extends ApplicationCard {\n`;
      output += `  name = "${card.name}";\n`;
      output += `  domain = Domain.${card.domain};\n`;
      output += `  passiveEffect = "${card.passive_effect}";\n`;
      output += `  activeEffect = "${card.active_effect}";\n`;
      output += `  insightCost = ${card.insight_cost};\n`;
      output += `  associatedStar = "${card.associated_star}";\n\n`;
      output += `  applyPassive(gameState: GameState): void {\n`;
      output += `    // ${card.passive_effect}\n`;
      output += `  }\n\n`;
      output += `  applyActive(gameState: GameState, insightSpent: number): void {\n`;
      output += `    // ${card.active_effect}\n`;
      output += `    // Cost: ${card.insight_cost} insight\n`;
      output += `  }\n`;
      output += `}\n`;
      output += `\`\`\`\n\n`;
      
      if (card.cursor_notes) {
        output += `**Development Notes**: ${card.cursor_notes}\n\n`;
      }
      
      output += `**Dependencies**:\n`;
      output += `- Star System: ${card.associated_star}\n`;
      output += `- Resource System: Insight (${card.insight_cost})\n\n`;
      
      output += `---\n\n`;
    });
  }
  
  // Implementation order
  output += `## Implementation Order\n\n`;
  output += `1. Core ApplicationCard base class\n`;
  output += `2. High priority cards (${highPriorityCards?.length || 0} cards)\n`;
  output += `3. Medium priority cards (${mediumPriorityCards?.length || 0} cards)\n`;
  output += `4. Integration testing with star system\n`;
  output += `5. Visual effects and animations\n\n`;
  
  return output;
}

function generateTeamReview(allData: Record<string, Record<string, SystemData>>, contentDocs: Record<string, ContentDoc>, options: ExportOptions): string {
  let output = `# Rogue Resident Team Review\n`;
  output += `*Generated for team collaboration - ${new Date().toISOString()}*\n\n`;
  
  output += `## Current Status Overview\n\n`;
  
  // Statistics
  let totalCards = 0;
  let totalStars = 0;
  let highPriorityCards = 0;
  
  if (allData.cards) {
    for (const [systemKey, systemData] of Object.entries(allData.cards)) {
      if (systemData.cards) {
        totalCards += Object.keys(systemData.cards).length;
        for (const card of Object.values(systemData.cards)) {
          if ((card as any).implementation_priority === 'high') {
            highPriorityCards++;
          }
        }
      }
    }
  }
  
  if (allData.stars) {
    for (const [systemKey, systemData] of Object.entries(allData.stars)) {
      if (systemData.stars) {
        totalStars += Object.keys(systemData.stars).length;
      }
    }
  }
  
  output += `### System Statistics\n`;
  output += `- **Total Cards**: ${totalCards}\n`;
  output += `- **Total Stars**: ${totalStars}\n`;
  output += `- **High Priority Cards**: ${highPriorityCards}\n`;
  output += `- **Systems Defined**: ${Object.keys(allData).length}\n\n`;
  
  // Next actions
  output += `### Recommended Next Actions\n`;
  output += `1. **Luke**: Implement ${highPriorityCards} high-priority cards\n`;
  output += `2. **Zach**: Review star requirements and rewards\n`;
  output += `3. **Team**: Validate cross-references between systems\n`;
  output += `4. **Team**: Design mentor character interactions\n\n`;
  
  // Detailed sections for each system
  for (const [systemType, systems] of Object.entries(allData)) {
    output += `## ${systemType.charAt(0).toUpperCase() + systemType.slice(1)} Systems\n\n`;
    
    for (const [systemKey, systemData] of Object.entries(systems)) {
      output += `### ${systemData.system_info.name}\n`;
      output += `${systemData.system_info.description}\n\n`;
      
      if (systemType === 'cards' && systemData.cards) {
        output += `**Cards (${Object.keys(systemData.cards).length}):**\n`;
        for (const [cardId, card] of Object.entries(systemData.cards)) {
          const cardData = card as any;
          output += `- ${cardData.name} (${cardData.implementation_priority} priority)\n`;
        }
      } else if (systemType === 'stars' && systemData.stars) {
        output += `**Stars (${Object.keys(systemData.stars).length}):**\n`;
        for (const [starId, star] of Object.entries(systemData.stars)) {
          const starData = star as any;
          output += `- ${starData.name} (${starData.domain})\n`;
        }
      }
      output += `\n`;
    }
  }
  
  return output;
}

function generateSystemOverview(allData: Record<string, Record<string, SystemData>>, contentDocs: Record<string, ContentDoc>, options: ExportOptions): string {
  let output = `# Rogue Resident System Overview\n`;
  output += `*Comprehensive system documentation - ${new Date().toISOString()}*\n\n`;
  
  // Add content documentation summary if available
  if (Object.keys(contentDocs).length > 0) {
    output += `## Documentation Overview\n\n`;
    output += `The following design documents are available:\n\n`;
    
    for (const [docKey, doc] of Object.entries(contentDocs)) {
      output += `- **${doc.title}**`;
      if (doc.version) output += ` (v${doc.version})`;
      output += `\n`;
    }
    output += `\n`;
  }
  
  output += `## Game Architecture\n\n`;
  output += `Rogue Resident uses a modular system architecture:\n\n`;
  
  for (const [systemType, systems] of Object.entries(allData)) {
    output += `### ${systemType.charAt(0).toUpperCase() + systemType.slice(1)} System\n`;
    
    for (const [systemKey, systemData] of Object.entries(systems)) {
      output += `#### ${systemData.system_info.name}\n`;
      output += `${systemData.system_info.description}\n\n`;
      
      // Show structure
      if (systemType === 'cards' && systemData.cards) {
        output += `**Structure**: ${Object.keys(systemData.cards).length} cards defined\n`;
        output += `**Domain**: ${systemData.system_info.domain}\n`;
      } else if (systemType === 'stars' && systemData.stars) {
        output += `**Structure**: ${Object.keys(systemData.stars).length} stars defined\n`;
        output += `**Total Capacity**: ${systemData.system_info.total_stars} stars planned\n`;
      }
      
      // Show relationships
      if (systemData.cross_references) {
        output += `**Dependencies**: `;
        const deps = [];
        for (const [refType, refs] of Object.entries(systemData.cross_references)) {
          if (Array.isArray(refs) && refs.length > 0) {
            deps.push(`${refs.length} ${refType}`);
          }
        }
        output += deps.join(', ') || 'None';
        output += `\n`;
      }
      output += `\n`;
    }
  }
  
  return output;
} 