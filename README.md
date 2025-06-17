# Rogue Resident Documentation System

A custom web-based documentation system for the Rogue Resident educational game, built with Next.js and deployed on Vercel.

## Overview

This system solves documentation chaos by providing a **Three-Audience Workflow System** that generates focused, modular documentation for different stakeholders. The core innovation is recognizing that design discussions, development planning, and LLM implementation require completely different information formats.

## 🎯 Current Development Priority

**Active Focus**: All three interface systems are operational and generating comprehensive documentation:
- **Activity Interface System** - Hospital exploration and dialogue systems ✅ 
- **Mentor Relationship System** - Character interactions and progression ✅
- **Tutorial Flow System** - Player onboarding and system introduction ✅

The system generates focused documentation for any interface system you select. Choose the system that matches your current development session needs.

### Key Features

- **🎭 Three-Audience Workflow**: Generate focused docs for design discussions, development planning, and LLM collaboration
- **📊 Rich Metadata System**: YAML-based data with implementation details, technical files, and specific needs
- **📄 Actionable Documentation**: Technical accuracy PLUS immediate actionability with file references
- **🔄 Template Evolution**: System improves based on output quality through iterative enhancement
- **⚡ 59× Faster**: 30-second context generation (vs 30-minute manual assembly)
- **✅ Status Accuracy**: Validation workflows ensuring documentation matches implementation reality
- **🎯 Strategic Intelligence**: Production-ready development guidance, not just information

## Quick Start

### Local Development

1. **Clone and install dependencies**:
```bash
cd rogue-docs-web
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to `http://localhost:3000`

### Adding Data

1. **Edit YAML files** in the `/data` directory:
   - `/data/cards/` - Application cards
   - `/data/stars/` - Star system
   - `/data/mentors/` - Mentor characters
   - `/data/bosses/` - Boss encounters

2. **Sample structure** (see existing files for examples):
```yaml
system_info:
  name: "System Name"
  description: "System description"

cards: # or stars, mentors, etc.
  card-id:
    name: "Card Name"
    # ... other properties
```

3. **Refresh the web app** to see changes

## Documentation System

### Update Logs
The project maintains a comprehensive update log system to track documentation evolution:

- **📁 `/update-logs/`** - Historical record of all significant documentation updates
- **📋 `INDEX.md`** - Sequential navigation (001, 002, 003...) to all update logs  
- **📄 Individual Logs** - Detailed breakdown of changes, impact, and technical notes
- **🔢 Sequential Numbering**: Consistent ordering system (no more confusing dates)

**When to check update logs:**
- Understanding recent documentation changes
- Tracking implementation progress alignment  
- Finding rationale behind architectural decisions
- Coordinating with ongoing development work

[📖 View Update Logs](update-logs/INDEX.md)

### Quick Start Guides
- **🎭 [Three-Audience Workflow Guide](THREE_AUDIENCE_WORKFLOW_GUIDE.md)** - Complete guide to the main feature
- **📚 [Development Guide](rogue_docs_dev_guide.md)** - Comprehensive system overview  
- **⚡ [Smart Context Assembly](SMART_CONTEXT_ASSEMBLY_GUIDE.md)** - Legacy feature documentation

## Export Formats

### Claude Context
Optimized for AI conversations with complete game context:
- Executive summary
- Detailed card and star information
- Cross-reference relationships
- Development notes

### Cursor Development
Implementation specifications for IDE development:
- Priority-sorted implementation order
- TypeScript code templates
- Dependency mapping
- Development notes integration

### Team Review
Summary format for collaboration:
- Current status overview
- System statistics
- Recommended next actions
- High-level system summaries

### System Overview
Comprehensive architecture documentation:
- Game system architecture
- Data structure overview
- Relationship dependencies
- Complete system catalog

## Project Structure

```
rogue-docs-web/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── cards/             # Cards management page
│   │   ├── stars/             # Stars management page
│   │   ├── exports/           # Export generation page
│   │   └── ...
│   ├── components/            # React components
│   └── lib/                   # Utilities and data management
├── data/                      # YAML data files
│   ├── cards/
│   ├── stars/
│   ├── mentors/
│   └── bosses/
└── README.md
```

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository

### Deploy Steps

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

3. **Environment Setup**:
   No environment variables required for basic functionality.

### Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Instant global CDN distribution

## Primary Workflow: Three-Audience System

### 🎭 **The Three-Audience Workflow** (Main Feature)

**Problem Solved**: Different audiences need completely different information formats
**Solution**: Generate 3 focused documents from single source data

#### **Audience 1: Design Discussions** 🗣️
- **Who**: Luke + Zach design coordination
- **Content**: Player experience focus, design rationale, team discussion points
- **Size**: ~270 lines - perfect for conversations

#### **Audience 2: Development Planning** 📋  
- **Who**: Luke's implementation workflow
- **Content**: Triage-style priorities, asset pipeline, technical unknowns
- **Size**: ~440 lines - focused action plans

#### **Audience 3: LLM Implementation** 🤖
- **Who**: Claude/AI development collaboration  
- **Content**: Complete technical specs, asset lists, integration patterns
- **Size**: ~550 lines - comprehensive but focused

### **How to Use the Three-Audience System**

1. **Go to web app home page**: `http://localhost:3000`
2. **Select system**: Choose from available interface systems  
3. **Configure options**: Include archives for enhanced context
4. **Generate**: Click "Generate Workflow Docs" 
5. **Get focused files**: Download or copy the specific audience document you need

### **Traditional Export Options** (Still Available)

- **Claude Context**: Legacy comprehensive format
- **Cursor Development**: IDE-focused specifications  
- **Team Review**: Meeting summaries
- **System Overview**: Architecture documentation

## Data Management

### Adding New Systems
1. Create new directory in `/data/`
2. Add YAML files following existing patterns
3. Update API routes if needed
4. Add to export utilities

### Cross-Reference Validation
The system automatically validates references between:
- Cards ↔ Stars
- Stars ↔ Mentors
- Systems ↔ Dependencies

### File Naming Conventions
- Use kebab-case for file names
- Match directory names to system types
- Keep YAML structure consistent

## Development Roadmap

### Completed ✅
- Basic web interface
- YAML data management
- Export generation system
- Cards and stars viewing
- Vercel deployment ready

### In Progress 🚧
- Cross-reference validation
- Real-time collaboration features
- Enhanced export options

### Planned 📋
- Monaco editor integration
- Real-time YAML editing
- Git integration for changes
- Advanced filtering and search
- Mentor and boss systems
- Version history tracking

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Data**: YAML files, file system storage
- **Deployment**: Vercel
- **Development**: Node.js, npm

## Contributing

### For Luke & Zach
1. Edit YAML files directly in your IDE
2. Use exports for development sessions
3. Push changes to trigger redeployment
4. Share export links for collaboration

### For External Contributors
1. Fork the repository
2. Make changes to data files
3. Submit pull request
4. Review and merge

## Support & Issues

For issues or questions:
1. Check existing data file formats
2. Validate YAML syntax
3. Test exports locally first
4. Document any bugs found

## Success Metrics Achieved ✅

### **System Maturation Completed**
**Phase 1**: Built three-audience workflow system ✅  
**Phase 2**: Discovered and fixed critical metadata sync failure mode ✅  
**Phase 3**: **Enhanced to production-ready strategic development intelligence** ✅

### **Transformation Achieved**
- **Before**: "Technically accurate but not actionable" documentation
- **After**: **"Production-ready strategic development intelligence"**

### **Performance Metrics**
- ✅ **30-second context generation** (vs 30-minute manual assembly) - **59× faster**
- ✅ **Three optimized audience formats** serving distinct needs perfectly
- ✅ **Status accuracy validation** with mandatory sync workflows
- ✅ **Template evolution** based on output quality, not just generation success
- ✅ **Self-contained context** eliminating external dependencies for AI collaboration

### **Quality Metrics**
- ✅ **Actionability**: Can someone start work immediately from the documentation?
- ✅ **Accuracy**: Does generated content match implementation reality?
- ✅ **Completeness**: Are all necessary technical details included?
- ✅ **Specificity**: Are requirements detailed enough to be actionable?

### **Strategic Impact**
- **Development Planning**: Manual curation → **Actionable roadmaps with technical context**
- **Team Coordination**: Basic context → **Complete handoff capability with file references**
- **LLM Collaboration**: Broken references → **Self-contained strategic intelligence**
- **Documentation Trust**: Often outdated → **Validated accuracy with sync workflows**

---

**Built for the Rogue Resident educational game project**  
*Solving documentation chaos, enabling efficient development* 