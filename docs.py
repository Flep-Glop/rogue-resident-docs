#!/usr/bin/env python3
"""
Rogue Resident Documentation CLI
Simple interface for the documentation system
"""

import sys
import subprocess
from pathlib import Path

def run_export(format_type="all", system_name=None, include_archives=False, copy_to=None, export_references=False):
    """Run the export script with the specified format"""
    try:
        cmd = [
            "python3", "scripts/export.py", 
            "--format", format_type
        ]
        
        if system_name:
            cmd.extend(["--system", system_name])
            
        if include_archives:
            cmd.append("--include-archives")
            
        if export_references:
            cmd.append("--export-references")
            
        if copy_to:
            cmd.extend(["--copy-to", copy_to])
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(result.stdout)
        else:
            print(f"Error: {result.stderr}")
    except Exception as e:
        print(f"Error running export: {e}")

def run_narrative_export(focus_area="all", include_archives=False, copy_to=None, export_references=False):
    """Run the narrative workflow export with the specified focus area"""
    try:
        cmd = [
            "python3", "scripts/export.py", 
            "--format", "narrative"
        ]
        
        if focus_area:
            cmd.extend(["--focus-area", focus_area])
            
        if include_archives:
            cmd.append("--include-archives")
            
        if export_references:
            cmd.append("--export-references")
            
        if copy_to:
            cmd.extend(["--copy-to", copy_to])
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(result.stdout)
        else:
            print(f"Error: {result.stderr}")
    except Exception as e:
        print(f"Error running narrative export: {e}")

def show_help():
    print("""
🌟 Rogue Resident Documentation System 🌟

Usage:
  python3 docs.py export [format]         - Export documentation
  python3 docs.py workflow [system]       - Three-audience workflow export
  python3 docs.py narrative [focus]       - Narrative/lore/storybuilding workflow export 🎭
  python3 docs.py help                    - Show this help

Export formats:
  nextjs   - Generate JSON for Next.js app
  claude   - Generate Claude context markdown  
  visual   - Generate beautiful relationship maps! ✨
  workflow - Generate three-audience workflow docs (requires system name)
  narrative- Generate narrative/lore workflow docs 🎭
  all      - Generate all formats (default)

Three-audience workflow:
  Generates three focused documents for each system:
  1. Conversational context (Luke + Zach design discussions)
  2. Development planning (Luke's implementation workflow)  
  3. LLM implementation context (Claude collaboration)

Narrative workflow 🎭:
  Generates three story-focused documents:
  1. Narrative context (Writers & narrative designers)
  2. Lore implementation (Developers implementing narrative)
  3. Story continuity (AI assistants maintaining consistency)

Narrative focus areas:
  character - Character arcs, personalities, dialogue systems
  world     - World building, medical physics setting, lore
  plot      - Story progression, tutorial narrative, journal system
  all       - Comprehensive narrative documentation (default)

Enhanced workflow options:
  --export-references   Export referenced files to references/ folder (recommended!)
  --include-archives    Include all design docs, character content, and game constants
  --copy-to [path]      Copy generated files to specified directory (e.g., game repo)

Examples:
  python3 docs.py export                                                # Export all formats
  python3 docs.py export claude                                         # Export Claude context only
  python3 docs.py export nextjs                                         # Export Next.js data only
  python3 docs.py export visual                                         # Generate visual relationship maps! 🎨
  python3 docs.py workflow activity-interface --export-references       # Generate clean docs with separate reference files (recommended)
  python3 docs.py workflow activity-interface                           # Generate docs with embedded content
  python3 docs.py workflow activity-interface --include-archives        # Include ALL context (creates very large files)
  python3 docs.py workflow activity-interface --export-references --copy-to ../game-repo/docs/  # Export to another repo
  
  python3 docs.py narrative character --export-references               # Character-focused narrative docs 🎭
  python3 docs.py narrative world                                       # World building & lore docs 🌍
  python3 docs.py narrative plot                                        # Story progression & tutorial narrative 📖
  python3 docs.py narrative all --include-archives                      # Complete narrative documentation 📚
    """)

def main():
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1]
    
    if command == "export":
        format_type = sys.argv[2] if len(sys.argv) > 2 else "all"
        run_export(format_type)
    elif command == "workflow":
        if len(sys.argv) < 3:
            print("❌ Error: workflow command requires a system name")
            print("Example: python3 docs.py workflow activity-interface")
            print("Enhanced: python3 docs.py workflow activity-interface --include-archives")
            return
        
        # Parse workflow arguments
        system_name = sys.argv[2]
        include_archives = "--include-archives" in sys.argv
        export_references = "--export-references" in sys.argv
        
        # Parse --copy-to flag
        copy_to = None
        if "--copy-to" in sys.argv:
            copy_index = sys.argv.index("--copy-to")
            if copy_index + 1 < len(sys.argv):
                copy_to = sys.argv[copy_index + 1]
        
        run_export("workflow", system_name, include_archives, copy_to, export_references)
    elif command == "narrative":
        # Parse narrative arguments
        focus_area = sys.argv[2] if len(sys.argv) > 2 else "all"
        if focus_area not in ["character", "world", "plot", "all"]:
            print(f"❌ Error: Invalid focus area '{focus_area}'")
            print("Valid focus areas: character, world, plot, all")
            print("Example: python3 docs.py narrative character --export-references")
            return
        
        include_archives = "--include-archives" in sys.argv
        export_references = "--export-references" in sys.argv
        
        # Parse --copy-to flag
        copy_to = None
        if "--copy-to" in sys.argv:
            copy_index = sys.argv.index("--copy-to")
            if copy_index + 1 < len(sys.argv):
                copy_to = sys.argv[copy_index + 1]
        
        run_narrative_export(focus_area, include_archives, copy_to, export_references)
    elif command == "help":
        show_help()
    else:
        print(f"Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main() 