# Rogue Resident Documentation Hub

A comprehensive Next.js-based documentation and content management system for **Rogue Resident** - an innovative educational game that teaches medical physics concepts through narrative-driven gameplay and knowledge constellation mechanics.

## What is Rogue Resident?

Rogue Resident is an educational game that transforms medical physics learning into an engaging experience where students develop expertise through:

- **Knowledge Constellation System**: Visual progression through interconnected medical physics concepts
- **Mentor Relationships**: Four distinct teaching approaches (Dr. Garcia, Dr. Quinn, Technician Jesse, Dr. Kapoor)
- **Professional Development**: Realistic hospital scenarios and boss encounters that test integrated knowledge
- **Application Cards**: Practical tools that demonstrate knowledge in action

## What is This Documentation Hub?

This Next.js application serves as the central **content management and documentation system** for Rogue Resident, providing:

### 🎭 Three-Audience Workflow System
- **Design Discussion Context**: Perfect for team design discussions and planning
- **Development Plans**: Implementation roadmaps and feature triage
- **Technical Context**: AI-ready documentation for development collaboration

### 📚 Content Library
- Browse and explore all game content: character arcs, boss encounters, educational frameworks
- View YAML configurations, markdown documentation, and JSON data files
- Search and filter through the comprehensive content database

### 📊 System Status Dashboard
- Track development progress across game systems
- Monitor implementation status of core features
- Visualize system relationships and dependencies

## Key Features

- **Interactive Content Browser**: Explore game systems, characters, educational content, and design documents
- **Workflow Documentation Generator**: Create context-appropriate documentation for different audiences
- **Real-time Content Viewing**: Browse YAML configs, markdown docs, and JSON data with syntax highlighting
- **Development Progress Tracking**: Monitor system implementation status and priorities
- **Export & Integration Tools**: Generate documentation packages for external collaboration

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd rogue-docs-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### For Game Designers & Content Creators
1. **Use the Workflow Hub** to generate context-appropriate documentation for design discussions
2. **Browse the Content Library** to explore existing game content and systems
3. **Export documentation** for sharing with team members or external collaborators

### For Developers
1. **Access technical specifications** through the Content Library
2. **Generate implementation context** using the Three-Audience Workflow system
3. **Track development progress** via the System Status dashboard
4. **Explore YAML configurations** and data structures for game systems

### For Educators & Researchers
1. **Review educational frameworks** and pedagogical approaches
2. **Explore the challenge system design** and assessment methodologies
3. **Understand the knowledge constellation** approach to expertise visualization

## Project Structure

```
rogue-docs-web/
├── src/
│   ├── app/                    # Next.js app router pages
│   └── components/            # React components
├── data/                      # Game content and configuration
│   ├── bosses/               # Boss encounter definitions
│   ├── cards/                # Application card systems
│   ├── constants/            # Game system configurations
│   ├── mentors/              # Mentor character data
│   └── stars/                # Knowledge constellation definitions
├── content/                  # Design documentation
├── templates/                # Documentation templates
└── public/                   # Static assets
```

## Core Game Systems Documented

- **Knowledge Constellation**: 90+ interconnected learning nodes across medical physics domains
- **Mentor System**: Four distinct teaching philosophies and relationship mechanics
- **Boss Encounters**: Comprehensive assessment scenarios testing integrated knowledge
- **Application Cards**: 26+ practical tools demonstrating knowledge application
- **Educational Framework**: Adaptive difficulty and personalized learning pathways
- **Professional Development**: Career progression and specialization systems

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor for YAML/JSON editing
- **Diagrams**: Mermaid for system visualization
- **Content Processing**: Gray Matter for markdown processing
- **Data Management**: JS-YAML for configuration files

## Contributing

This documentation system supports the ongoing development of Rogue Resident. Contributors can:

1. **Add new content** through the structured YAML and markdown files
2. **Improve documentation** using the Three-Audience Workflow system
3. **Enhance visualizations** and content browsing capabilities
4. **Extend the educational framework** with new assessment approaches

## Educational Impact

Rogue Resident represents a new approach to professional education that:

- **Visualizes expertise development** through the Knowledge Constellation
- **Integrates authentic professional scenarios** with educational content
- **Supports multiple learning styles** and specialization paths
- **Demonstrates knowledge through application** rather than memorization
- **Builds professional identity** alongside technical competence

## Learn More

To learn more about the educational philosophy and game design principles behind Rogue Resident:

- Explore the [Master Game Design Document](content/master-gdd.md)
- Review the [Educational Framework](content/educational-framework.md)
- Understand the [Core Systems Design](content/core-systems-design.md)
- Browse the comprehensive content in the `/data` directory

## Deployment

The application can be deployed on any platform that supports Next.js:

```bash
npm run build
npm start
```

For deployment on [Vercel](https://vercel.com/), simply connect your repository for automatic deployments.

---

*Rogue Resident Documentation Hub - Transforming medical physics education through innovative game design and comprehensive content management.*
