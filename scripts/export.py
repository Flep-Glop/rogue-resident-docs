#!/usr/bin/env python3
"""
Rogue Resident Documentation Export System
Generates targeted documentation exports from structured YAML data
"""

import yaml
import json
import os
import argparse
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import glob
from collections import defaultdict
import re
from datetime import datetime

class DocumentationExporter:
    def __init__(self, base_path="."):
        self.base_path = Path(base_path)
        self.data_path = self.base_path / "data"
        self.template_path = self.base_path / "templates"
        self.export_path = self.base_path / "exports"
        self.rogue_docs_web_path = self.base_path / "rogue-docs-web"
        
        # Ensure export directory exists
        self.export_path.mkdir(exist_ok=True)
        
        # Setup Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(self.template_path))
        )
    
    def load_yaml_data(self, file_path):
        """Load YAML data from file"""
        try:
            with open(file_path, 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            print(f"Warning: {file_path} not found")
            return {}
        except yaml.YAMLError as e:
            print(f"Error parsing YAML {file_path}: {e}")
            return {}
    
    def load_all_cards(self):
        """Load all card data from the cards directory"""
        cards_data = {}
        cards_dir = self.data_path / "cards"
        
        if cards_dir.exists():
            for yaml_file in cards_dir.glob("*.yaml"):
                system_name = yaml_file.stem
                data = self.load_yaml_data(yaml_file)
                if data:
                    cards_data[system_name] = data
        
        return cards_data
    
    def load_all_bosses(self):
        """Load all boss data from the bosses directory"""
        bosses_data = {}
        bosses_dir = self.data_path / "bosses"
        
        if bosses_dir.exists():
            for yaml_file in bosses_dir.glob("*.yaml"):
                boss_name = yaml_file.stem
                data = self.load_yaml_data(yaml_file)
                if data:
                    bosses_data[boss_name] = data
        
        return bosses_data
    
    def load_all_mentors(self):
        """Load all mentor data from the mentors directory"""
        mentors_data = {}
        mentors_dir = self.data_path / "mentors"
        
        if mentors_dir.exists():
            for yaml_file in mentors_dir.glob("*.yaml"):
                system_name = yaml_file.stem
                data = self.load_yaml_data(yaml_file)
                if data:
                    mentors_data[system_name] = data
        
        return mentors_data
    
    def load_all_constants(self):
        """Load all constant data from the constants directory"""
        constants_data = {}
        constants_dir = self.data_path / "constants"
        
        if constants_dir.exists():
            for yaml_file in constants_dir.glob("*.yaml"):
                system_name = yaml_file.stem
                data = self.load_yaml_data(yaml_file)
                if data:
                    constants_data[system_name] = data
        
        return constants_data
    
    def load_all_interfaces(self):
        """Load all interface data from the interfaces directory"""
        interfaces_data = {}
        interfaces_dir = self.data_path / "interfaces"
        
        if interfaces_dir.exists():
            for yaml_file in interfaces_dir.glob("*.yaml"):
                system_name = yaml_file.stem
                data = self.load_yaml_data(yaml_file)
                if data:
                    interfaces_data[system_name] = data
        
        return interfaces_data
    
    def load_markdown_content(self):
        """Load markdown content files"""
        content_data = {}
        content_dir = self.base_path / "content"
        
        if content_dir.exists():
            for md_file in content_dir.rglob("*.md"):
                relative_path = md_file.relative_to(content_dir)
                try:
                    with open(md_file, 'r') as f:
                        content_data[str(relative_path)] = f.read()
                except Exception as e:
                    print(f"Error reading {md_file}: {e}")
        
        return content_data
    
    def clean_string_for_js(self, text):
        """Clean strings aggressively for Mermaid compatibility"""
        if not text:
            return "No description"
        
        # Super aggressive cleaning
        cleaned = str(text)
        # Remove all problematic characters
        cleaned = ''.join(char for char in cleaned if char.isalnum() or char in ' -')
        # Replace multiple spaces with single space
        cleaned = ' '.join(cleaned.split())
        # Limit to very short length
        cleaned = cleaned[:25]
        
        return cleaned if cleaned else "No description"
    
    def generate_constellation_map(self):
        """🌟 Generate a simple, bulletproof constellation map! 🌟"""
        
        # Load all system data
        all_systems = {
            **self.load_all_constants(),
            **self.load_all_bosses(), 
            **self.load_all_mentors(),
            **self.load_all_cards()
        }
        
        # Simple priority mapping
        priorities = {}
        for system_name, system_data in all_systems.items():
            if 'boss_encounter' in system_data or system_data.get('system_info', {}).get('type') == 'boss_encounter':
                priorities[system_name] = 'boss'
            elif 'mentor' in system_name or 'mentors' in system_data:
                priorities[system_name] = 'mentor'
            elif 'constellation' in system_name.lower():
                priorities[system_name] = 'core'
            elif any(keyword in system_name.lower() for keyword in ['pico', 'amara', 'journal']):
                priorities[system_name] = 'narrative'
            else:
                priorities[system_name] = 'system'
        
        # Generate super-simple Mermaid
        mermaid_lines = [
            "graph TD",
            ""
        ]
        
        # Add nodes with minimal, safe labels
        for system_name in all_systems.keys():
            # Super simple label
            display_name = system_name.replace('-', ' ').title()[:15]
            priority = priorities.get(system_name, 'system')
            
            # Clean node with prefix only
            if priority == 'boss':
                simple_label = f"BOSS {display_name}"
                style_class = "boss"
            elif priority == 'mentor':
                simple_label = f"MENTOR {display_name}"
                style_class = "mentor"
            elif priority == 'core':
                simple_label = f"CORE {display_name}"
                style_class = "core"
            elif priority == 'narrative':
                simple_label = f"STORY {display_name}"
                style_class = "narrative"
            else:
                simple_label = f"SYS {display_name}"
                style_class = "system"
            
            # Use parentheses instead of brackets to avoid quote issues
            mermaid_lines.append(f"    {system_name}({simple_label})")
            mermaid_lines.append(f"    class {system_name} {style_class}")
        
        mermaid_lines.append("")
        
        # Add simple connections (just a few to test)
        test_connections = [
            ("pico-character", "amara-narrative"),
            ("journal-system", "amara-narrative"),
            ("marcus-chen", "mentors")
        ]
        
        for source, target in test_connections:
            if source in all_systems and target in all_systems:
                mermaid_lines.append(f"    {source} --> {target}")
        
        mermaid_lines.append("")
        
        # Simple styling
        mermaid_lines.extend([
            "    classDef boss fill:#ff6b6b,stroke:#d63447,color:#fff",
            "    classDef mentor fill:#20bf6b,stroke:#0fb9b1,color:#fff", 
            "    classDef core fill:#4834d4,stroke:#3742fa,color:#fff",
            "    classDef narrative fill:#fd79a8,stroke:#e84393,color:#fff",
            "    classDef system fill:#74b9ff,stroke:#0984e3,color:#fff"
        ])
        
        return "\n".join(mermaid_lines)
    
    def generate_focused_system_map(self, focus_system):
        """🎯 Generate a simple focused system view! 🎯"""
        
        all_systems = {
            **self.load_all_constants(),
            **self.load_all_bosses(),
            **self.load_all_mentors(), 
            **self.load_all_cards()
        }
        
        if focus_system not in all_systems:
            return f"graph TD\n    error(System Not Found)"
        
        mermaid_lines = [
            "graph TD",
            ""
        ]
        
        # Simple focus node
        focus_display = focus_system.replace('-', ' ').title()[:15]
        mermaid_lines.append(f"    {focus_system}(FOCUS {focus_display})")
        mermaid_lines.append(f"    class {focus_system} focus")
        mermaid_lines.append("")
        
        # Add a few simple connections for demo
        sample_connections = ['mentors', 'amara-narrative', 'pico-character']
        for conn in sample_connections:
            if conn in all_systems and conn != focus_system:
                conn_display = conn.replace('-', ' ').title()[:12]
                mermaid_lines.append(f"    {conn}(CONN {conn_display})")
                mermaid_lines.append(f"    {focus_system} --> {conn}")
                mermaid_lines.append(f"    class {conn} connected")
        
        mermaid_lines.append("")
        
        # Simple styling
        mermaid_lines.extend([
            "    classDef focus fill:#ff6348,stroke:#ff3838,color:#fff",
            "    classDef connected fill:#7bed9f,stroke:#5f27cd,color:#fff"
        ])
        
        return "\n".join(mermaid_lines)
    
    def generate_priority_hierarchy_map(self):
        """🚀 Generate a beautiful priority-based hierarchy view! 🚀"""
        
        all_systems = {
            **self.load_all_constants(),
            **self.load_all_bosses(),
            **self.load_all_mentors(),
            **self.load_all_cards()
        }
        
        # Categorize systems by priority and type
        categories = {
            'core': [],
            'bosses': [],
            'mentors': [], 
            'narrative': [],
            'systems': []
        }
        
        for system_name, system_data in all_systems.items():
            system_info = system_data.get('system_info', {})
            
            if 'constellation' in system_name.lower() or 'phenomenon' in system_name.lower():
                categories['core'].append(system_name)
            elif 'boss_encounter' in system_data or system_info.get('type') == 'boss_encounter':
                categories['bosses'].append(system_name)
            elif 'mentor' in system_name or 'mentors' in system_data:
                categories['mentors'].append(system_name)
            elif any(keyword in system_name.lower() for keyword in ['pico', 'amara', 'journal']):
                categories['narrative'].append(system_name)
            else:
                categories['systems'].append(system_name)
        
        mermaid_lines = [
            "graph TD",
            "    %% 🚀 Rogue Resident System Hierarchy 🚀",
            "    %% Beautiful priority-based organization! ✨",
            ""
        ]
        
        # Add category headers
        category_info = {
            'core': ('🌟', 'Core Systems', 'The heart of the constellation phenomenon'),
            'bosses': ('⚡', 'Boss Encounters', 'Challenge systems and character confrontations'),
            'mentors': ('🎓', 'Mentor Network', 'Guidance systems and philosophical frameworks'),
            'narrative': ('📖', 'Narrative Arc', 'Story progression and character development'),
            'systems': ('⚙️', 'Support Systems', 'Mechanical frameworks and utilities')
        }
        
        for category, (icon, title, desc) in category_info.items():
            if categories[category]:  # Only add if category has systems
                header_id = f"{category}_header"
                mermaid_lines.append(f'    {header_id}["{icon} {title}<br/><small>{desc}</small>"]')
                mermaid_lines.append(f"    class {header_id} {category}-header")
                
                # Add systems in this category
                for system in categories[category]:
                    system_display = system.replace('-', ' ').replace('_', ' ').title()
                    mermaid_lines.append(f'    {system}["{system_display}"]')
                    mermaid_lines.append(f"    {header_id} --> {system}")
                    mermaid_lines.append(f"    class {system} {category}-item")
                
                mermaid_lines.append("")
        
        # Add the magnificent hierarchy styling! 🎨
        mermaid_lines.extend([
            "    %% 🎨 Hierarchy Styling Magic 🎨",
            "    classDef core-header fill:#6c5ce7,stroke:#5f3dc4,stroke-width:4px,color:#fff,font-weight:bold,font-size:16px",
            "    classDef core-item fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff",
            "    classDef bosses-header fill:#e17055,stroke:#d63031,stroke-width:4px,color:#fff,font-weight:bold,font-size:16px", 
            "    classDef bosses-item fill:#fab1a0,stroke:#e17055,stroke-width:2px,color:#fff",
            "    classDef mentors-header fill:#00b894,stroke:#00a085,stroke-width:4px,color:#fff,font-weight:bold,font-size:16px",
            "    classDef mentors-item fill:#55efc4,stroke:#00b894,stroke-width:2px,color:#fff",
            "    classDef narrative-header fill:#fd79a8,stroke:#e84393,stroke-width:4px,color:#fff,font-weight:bold,font-size:16px",
            "    classDef narrative-item fill:#fdcb6e,stroke:#fd79a8,stroke-width:2px,color:#fff",
            "    classDef systems-header fill:#74b9ff,stroke:#0984e3,stroke-width:4px,color:#fff,font-weight:bold,font-size:16px",
            "    classDef systems-item fill:#81ecec,stroke:#74b9ff,stroke-width:2px,color:#fff",
            "    classDef default font-size:12px"
        ])
        
        return "\n".join(mermaid_lines)
    
    def generate_system_metrics(self):
        """📊 Generate implementation metrics and status data! 📊"""
        
        all_systems = {
            **self.load_all_constants(),
            **self.load_all_bosses(),
            **self.load_all_mentors(),
            **self.load_all_cards()
        }
        
        metrics = {}
        
        for system_name, system_data in all_systems.items():
            system_info = system_data.get('system_info', {})
            
            # Calculate implementation status
            status = "planning"
            progress = 0
            
            # Check for various completion indicators
            if 'boss_encounter' in system_data:
                # Boss encounters - check if phases are defined
                encounter = system_data.get('boss_encounter', {})
                phases = encounter.get('phases', {})
                if len(phases) >= 4:
                    status = "design_complete"
                    progress = 80
                elif len(phases) >= 2:
                    status = "in_progress" 
                    progress = 50
                else:
                    status = "planning"
                    progress = 20
            
            elif 'mentors' in system_data:
                # Mentor system - check mentor count
                mentors = system_data.get('mentors', {}).get('mentors', {})
                if len(mentors) >= 4:
                    status = "design_complete"
                    progress = 85
                else:
                    status = "in_progress"
                    progress = 60
                    
            elif 'cards' in system_data:
                # Card system - check card count and priorities
                cards = system_data.get('cards', {})
                high_priority = [c for c in cards.values() if c.get('implementation_priority') == 'high']
                if len(cards) >= 20:
                    status = "design_complete"
                    progress = 90
                elif len(high_priority) >= 5:
                    status = "in_progress"
                    progress = 65
                else:
                    status = "planning"
                    progress = 30
                    
            elif system_name in ['constellation-phenomenon', 'pico-character', 'amara-narrative']:
                # Core narrative systems - likely well developed
                status = "design_complete"
                progress = 95
                
            else:
                # Other systems - check for content richness
                if len(str(system_data)) > 5000:  # Rich content
                    status = "design_complete"
                    progress = 85
                elif len(str(system_data)) > 2000:  # Some content
                    status = "in_progress"
                    progress = 50
                else:
                    status = "planning"
                    progress = 25
            
            # Determine priority
            priority = "medium"
            if system_name in ['constellation-phenomenon', 'pico-character']:
                priority = "critical"
            elif 'boss' in system_name or system_info.get('type') == 'boss_encounter':
                priority = "high"
            elif system_name in ['amara-narrative', 'journal-system']:
                priority = "high"
            elif 'framework' in system_name or 'system' in system_name:
                priority = "medium"
            else:
                priority = "low"
            
            metrics[system_name] = {
                "status": status,
                "progress": progress,
                "priority": priority,
                "description": self.clean_string_for_js(system_info.get('description', 'No description available')),
                "name": self.clean_string_for_js(system_info.get('name', system_name.replace('-', ' ').title())),
                "type": system_info.get('type', 'system'),
                "dependencies": len(system_data.get('cross_references', {}).get('related_systems', [])),
                "complexity": "high" if len(str(system_data)) > 8000 else "medium" if len(str(system_data)) > 3000 else "low"
            }
        
        return metrics
    
    def export_visual_relationship_maps(self):
        """🎨 Export all the beautiful relationship visualizations! 🎨"""
        
        print("🌟 Generating Visual Relationship Maps... ✨")
        
        # Generate system metrics
        print("📊 Calculating System Metrics... 📊")
        system_metrics = self.generate_system_metrics()
        
        # Generate the magnificent constellation map
        constellation_map = self.generate_constellation_map()
        constellation_file = self.export_path / "constellation-map.mmd"
        with open(constellation_file, 'w') as f:
            f.write(constellation_map)
        print(f"✨ Generated Constellation Map: {constellation_file}")
        
        # Generate hierarchy map
        hierarchy_map = self.generate_priority_hierarchy_map()
        hierarchy_file = self.export_path / "hierarchy-map.mmd" 
        with open(hierarchy_file, 'w') as f:
            f.write(hierarchy_map)
        print(f"🚀 Generated Hierarchy Map: {hierarchy_file}")
        
        # Generate focused maps for key systems
        key_systems = ['pico-character', 'constellation-phenomenon', 'amara-narrative', 'journal-system']
        
        for system in key_systems:
            focused_map = self.generate_focused_system_map(system)
            if "not found" not in focused_map:
                focused_file = self.export_path / f"focused-{system}-map.mmd"
                with open(focused_file, 'w') as f:
                    f.write(focused_map)
                print(f"🎯 Generated Focused Map for {system}: {focused_file}")
        
        # Create the AMAZING interactive HTML file! 🌟✨
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌟 Rogue Resident Interactive System Constellation 🌟</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }}
        
        .header {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }}
        
        .header-content {{
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }}
        
        h1 {{
            color: white;
            font-size: 2em;
            font-weight: 700;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }}
        
        .search-container {{
            position: relative;
            display: flex;
            align-items: center;
            gap: 15px;
        }}
        
        .search-box {{
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 16px;
            width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }}
        
        .search-box:focus {{
            outline: none;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
            transform: translateY(-2px);
        }}
        
        .metrics-toggle {{
            background: linear-gradient(45deg, #6c5ce7, #fd79a8);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }}
        
        .metrics-toggle:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }}
        
        .main-content {{
            display: flex;
            max-width: 1400px;
            margin: 0 auto;
            gap: 20px;
            padding: 20px;
        }}
        
        .diagram-container {{
            flex: 1;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        }}
        
        .side-panel {{
            width: 350px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            height: fit-content;
            position: sticky;
            top: 120px;
            transition: all 0.3s ease;
        }}
        
        .side-panel.hidden {{
            transform: translateX(100%);
            opacity: 0;
        }}
        
        .tab-container {{
            display: flex;
            margin-bottom: 20px;
            background: rgba(116, 185, 255, 0.1);
            border-radius: 12px;
            padding: 5px;
        }}
        
        .tab {{
            flex: 1;
            padding: 12px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 14px;
        }}
        
        .tab.active {{
            background: linear-gradient(45deg, #6c5ce7, #fd79a8);
            color: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }}
        
        .diagram-section {{
            margin-bottom: 40px;
            transition: all 0.3s ease;
        }}
        
        .diagram-section.hidden {{
            display: none;
        }}
        
        .section-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(116, 185, 255, 0.3);
        }}
        
        .diagram-title {{
            font-size: 1.8em;
            font-weight: bold;
            color: #2d3436;
        }}
        
        .diagram-description {{
            color: #636e72;
            margin-bottom: 20px;
            font-style: italic;
            font-size: 1.1em;
        }}
        
        .mermaid {{
            text-align: center;
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            position: relative;
            min-height: 400px;
        }}
        
        .system-info {{
            background: linear-gradient(135deg, #74b9ff, #0984e3);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }}
        
        .system-name {{
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }}
        
        .system-description {{
            opacity: 0.9;
            line-height: 1.4;
        }}
        
        .metrics-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }}
        
        .metric-card {{
            background: rgba(116, 185, 255, 0.1);
            padding: 15px;
            border-radius: 12px;
            text-align: center;
        }}
        
        .metric-value {{
            font-size: 1.5em;
            font-weight: bold;
            color: #2d3436;
        }}
        
        .metric-label {{
            font-size: 0.9em;
            color: #636e72;
            margin-top: 5px;
        }}
        
        .progress-bar {{
            background: rgba(0,0,0,0.1);
            border-radius: 10px;
            height: 8px;
            margin: 10px 0;
            overflow: hidden;
        }}
        
        .progress-fill {{
            height: 100%;
            border-radius: 10px;
            transition: width 0.8s ease;
        }}
        
        .status-critical {{ background: linear-gradient(45deg, #ff6b6b, #ff5252); }}
        .status-high {{ background: linear-gradient(45deg, #ffa726, #ff9800); }}
        .status-medium {{ background: linear-gradient(45deg, #42a5f5, #2196f3); }}
        .status-low {{ background: linear-gradient(45deg, #66bb6a, #4caf50); }}
        
        .connections-list {{
            max-height: 200px;
            overflow-y: auto;
        }}
        
        .connection-item {{
            background: rgba(255, 255, 255, 0.7);
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 4px solid #74b9ff;
        }}
        
        .connection-item:hover {{
            background: rgba(116, 185, 255, 0.2);
            transform: translateX(5px);
        }}
        
        .stats-overview {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }}
        
        .stats-title {{
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
        }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }}
        
        .stat-item {{
            text-align: center;
        }}
        
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            display: block;
        }}
        
        .stat-text {{
            font-size: 0.9em;
            opacity: 0.9;
        }}
        
        .loading {{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 400px;
            font-size: 1.2em;
            color: #636e72;
        }}
        
        .spinner {{
            border: 4px solid rgba(116, 185, 255, 0.3);
            border-left: 4px solid #74b9ff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-right: 15px;
        }}
        
        @keyframes spin {{
            0% {{ transform: rotate(0deg); }}
            100% {{ transform: rotate(360deg); }}
        }}
        
        .highlight {{
            animation: pulse 2s infinite;
        }}
        
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.7; }}
        }}
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {{
            .main-content {{
                flex-direction: column;
            }}
            
            .side-panel {{
                width: 100%;
                position: static;
            }}
            
            .header-content {{
                flex-direction: column;
                gap: 15px;
            }}
            
            .search-box {{
                width: 250px;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>🌟 Rogue Resident Interactive Constellation 🌟</h1>
            <div class="search-container">
                <input type="text" class="search-box" placeholder="🔍 Search systems..." id="searchBox">
                <button class="metrics-toggle" id="metricsToggle">📊 Toggle Metrics</button>
            </div>
        </div>
    </div>
    
    <div class="main-content">
        <div class="diagram-container">
            <div class="tab-container">
                <div class="tab active" data-tab="constellation">🌟 Constellation</div>
                <div class="tab" data-tab="hierarchy">🚀 Hierarchy</div>
                <div class="tab" data-tab="focused">🎯 Focused</div>
            </div>
            
            <div class="diagram-section" id="constellation-section">
                <div class="section-header">
                    <div>
                        <div class="diagram-title">🌟 Complete System Constellation</div>
                        <div class="diagram-description">Click any system to explore its connections! ✨</div>
                    </div>
                </div>
                <div class="mermaid" id="constellation-diagram">
                    <div class="loading">
                        <div class="spinner"></div>
                        Loading constellation map...
                    </div>
                </div>
            </div>
            
            <div class="diagram-section hidden" id="hierarchy-section">
                <div class="section-header">
                    <div>
                        <div class="diagram-title">🚀 System Hierarchy</div>
                        <div class="diagram-description">Organized by priority and category! 🏗️</div>
                    </div>
                </div>
                <div class="mermaid" id="hierarchy-diagram">
                    <div class="loading">
                        <div class="spinner"></div>
                        Loading hierarchy map...
                    </div>
                </div>
            </div>
            
            <div class="diagram-section hidden" id="focused-section">
                <div class="section-header">
                    <div>
                        <div class="diagram-title">🎯 Focused System View</div>
                        <div class="diagram-description">Deep dive into system connections! 🔍</div>
                    </div>
                </div>
                <div class="mermaid" id="focused-diagram">
                    <div class="loading">
                        <div class="spinner"></div>
                        Select a system to see its focused view...
                    </div>
                </div>
            </div>
        </div>
        
        <div class="side-panel" id="sidePanel">
            <div class="stats-overview">
                <div class="stats-title">📊 Project Overview</div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number" id="totalSystems">0</span>
                        <span class="stat-text">Total Systems</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="completeSystems">0</span>
                        <span class="stat-text">Design Complete</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="avgProgress">0%</span>
                        <span class="stat-text">Avg Progress</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="criticalSystems">0</span>
                        <span class="stat-text">Critical Priority</span>
                    </div>
                </div>
            </div>
            
            <div class="system-info" id="systemInfo" style="display: none;">
                <div class="system-name" id="systemName">Select a System</div>
                <div class="system-description" id="systemDescription">Click on any system in the diagram to see detailed information here!</div>
            </div>
            
            <div class="metrics-grid" id="metricsGrid" style="display: none;">
                <div class="metric-card">
                    <div class="metric-value" id="systemProgress">0%</div>
                    <div class="metric-label">Progress</div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressBar"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="systemPriority">-</div>
                    <div class="metric-label">Priority</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="systemDependencies">0</div>
                    <div class="metric-label">Dependencies</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="systemComplexity">-</div>
                    <div class="metric-label">Complexity</div>
                </div>
            </div>
            
            <div id="connectionsSection" style="display: none;">
                <h3 style="margin: 20px 0 10px 0; color: #2d3436;">🔗 Connected Systems</h3>
                <div class="connections-list" id="connectionsList"></div>
            </div>
        </div>
    </div>
    
    <script>
                 // System data and metrics
         const systemMetrics = {json.dumps(system_metrics, indent=8)};
         const constellationMap = {json.dumps(constellation_map)};
         const hierarchyMap = {json.dumps(hierarchy_map)};
        
        let currentTab = 'constellation';
        let metricsVisible = true;
        let selectedSystem = null;
        
                 // Initialize the application
         document.addEventListener('DOMContentLoaded', function() {{
             // Wait for Mermaid to be fully loaded
             if (typeof mermaid !== 'undefined') {{
                 initializeMermaid();
                 setupEventListeners();
                 loadOverviewStats();
                 
                 // Small delay to ensure everything is ready
                 setTimeout(() => {{
                     renderDiagram();
                 }}, 100);
             }} else {{
                 console.error('Mermaid library not loaded');
                 document.getElementById('constellation-diagram').innerHTML = '<div class="loading">❌ Mermaid library failed to load. Please refresh the page.</div>';
             }}
         }});
         
         function initializeMermaid() {{
             try {{
                 mermaid.initialize({{
                     startOnLoad: false,
                     theme: 'base',
                     themeVariables: {{
                         primaryColor: '#74b9ff',
                         primaryTextColor: '#2d3436',
                         fontFamily: 'Segoe UI, sans-serif'
                     }},
                     securityLevel: 'loose',
                     logLevel: 'error'
                 }});
                 console.log('✅ Mermaid initialized successfully');
             }} catch (error) {{
                 console.error('❌ Failed to initialize Mermaid:', error);
             }}
         }}
        
        function setupEventListeners() {{
            // Tab switching
            document.querySelectorAll('.tab').forEach(tab => {{
                tab.addEventListener('click', function() {{
                    switchTab(this.dataset.tab);
                }});
            }});
            
            // Search functionality
            document.getElementById('searchBox').addEventListener('input', function() {{
                handleSearch(this.value);
            }});
            
            // Metrics toggle
            document.getElementById('metricsToggle').addEventListener('click', function() {{
                toggleMetrics();
            }});
        }}
        
        function switchTab(tabName) {{
            // Update tab appearance
            document.querySelectorAll('.tab').forEach(tab => {{
                tab.classList.remove('active');
            }});
            document.querySelector(`[data-tab="${{tabName}}"]`).classList.add('active');
            
            // Update diagram sections
            document.querySelectorAll('.diagram-section').forEach(section => {{
                section.classList.add('hidden');
            }});
            document.getElementById(`${{tabName}}-section`).classList.remove('hidden');
            
            currentTab = tabName;
            renderDiagram();
        }}
        
                 function renderDiagram() {{
             const diagramContainer = document.getElementById(`${{currentTab}}-diagram`);
             let diagramContent = '';
             
             switch(currentTab) {{
                 case 'constellation':
                     diagramContent = constellationMap;
                     break;
                 case 'hierarchy':
                     diagramContent = hierarchyMap;
                     break;
                 case 'focused':
                     if (selectedSystem) {{
                         diagramContent = generateFocusedView(selectedSystem);
                     }} else {{
                         diagramContainer.innerHTML = '<div class="loading">Select a system from the constellation view to see its focused connections!</div>';
                         return;
                     }}
                     break;
             }}
             
             if (diagramContent && typeof diagramContent === 'string' && diagramContent.trim() !== '') {{
                 try {{
                     // Clear the container first
                     diagramContainer.innerHTML = '<div class="loading"><div class="spinner"></div>Rendering diagram...</div>';
                     
                     // Validate diagram content
                     if (!diagramContent.includes('graph ') && !diagramContent.includes('flowchart ')) {{
                         throw new Error('Invalid diagram format - missing graph declaration');
                     }}
                     
                     // Generate unique ID for this render
                     const diagramId = `diagram-${{currentTab}}-${{Date.now()}}`;
                     
                     // Use the correct Mermaid API with proper parameters
                     mermaid.render(diagramId, diagramContent).then(result => {{
                         if (result && result.svg) {{
                             diagramContainer.innerHTML = result.svg;
                             addInteractivity();
                         }} else {{
                             throw new Error('Invalid render result from Mermaid');
                         }}
                     }}).catch(error => {{
                         console.error('Mermaid rendering error:', error);
                         diagramContainer.innerHTML = `<div class="loading">❌ Error rendering diagram: ${{error.message || 'Unknown error'}}<br/><small>Please check the console for details.</small></div>`;
                     }});
                 }} catch (error) {{
                     console.error('Diagram rendering error:', error);
                     diagramContainer.innerHTML = `<div class="loading">❌ Error preparing diagram: ${{error.message || 'Unknown error'}}<br/><small>Please refresh and try again.</small></div>`;
                 }}
             }} else {{
                 diagramContainer.innerHTML = '<div class="loading">❌ No diagram content available</div>';
             }}
         }}
        
        function addInteractivity() {{
            // Add click handlers to diagram nodes
            setTimeout(() => {{
                const nodes = document.querySelectorAll('.mermaid g.node');
                nodes.forEach(node => {{
                    node.style.cursor = 'pointer';
                    node.addEventListener('click', function() {{
                        const nodeId = this.id || extractNodeId(this);
                        if (nodeId && systemMetrics[nodeId]) {{
                            selectSystem(nodeId);
                        }}
                    }});
                }});
            }}, 100);
        }}
        
        function extractNodeId(element) {{
            // Extract system ID from various possible sources
            const text = element.textContent || element.innerText || '';
            return Object.keys(systemMetrics).find(key => 
                text.toLowerCase().includes(key.replace('-', ' ').toLowerCase()) ||
                text.toLowerCase().includes(systemMetrics[key].name.toLowerCase())
            );
        }}
        
        function selectSystem(systemId) {{
            selectedSystem = systemId;
            const system = systemMetrics[systemId];
            
            if (!system) return;
            
            // Update system info panel
            document.getElementById('systemName').textContent = system.name;
            document.getElementById('systemDescription').textContent = system.description;
            document.getElementById('systemInfo').style.display = 'block';
            
            // Update metrics
            document.getElementById('systemProgress').textContent = system.progress + '%';
            document.getElementById('systemPriority').textContent = system.priority.toUpperCase();
            document.getElementById('systemDependencies').textContent = system.dependencies;
            document.getElementById('systemComplexity').textContent = system.complexity.toUpperCase();
            
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = system.progress + '%';
            progressBar.className = `progress-fill status-${{system.priority}}`;
            
            document.getElementById('metricsGrid').style.display = metricsVisible ? 'grid' : 'none';
            
            // Show connections (mock data for now)
            const connections = getSystemConnections(systemId);
            const connectionsList = document.getElementById('connectionsList');
            connectionsList.innerHTML = connections.map(conn => 
                `<div class="connection-item" onclick="selectSystem('${{conn.id}}')">${{conn.name}}</div>`
            ).join('');
            document.getElementById('connectionsSection').style.display = 'block';
            
            // Highlight the selected system
            highlightSystem(systemId);
        }}
        
        function getSystemConnections(systemId) {{
            // Return mock connections - in a real implementation, this would use actual relationship data
            const connections = [];
            Object.keys(systemMetrics).forEach(id => {{
                if (id !== systemId && Math.random() > 0.7) {{ // Mock random connections
                    connections.push({{
                        id: id,
                        name: systemMetrics[id].name
                    }});
                }}
            }});
            return connections.slice(0, 5); // Limit to 5 connections
        }}
        
        function highlightSystem(systemId) {{
            // Remove existing highlights
            document.querySelectorAll('.highlight').forEach(el => {{
                el.classList.remove('highlight');
            }});
            
            // Add highlight to selected system
            setTimeout(() => {{
                const nodes = document.querySelectorAll('.mermaid g.node');
                nodes.forEach(node => {{
                    const nodeId = extractNodeId(node);
                    if (nodeId === systemId) {{
                        node.classList.add('highlight');
                    }}
                }});
            }}, 100);
        }}
        
        function handleSearch(query) {{
            if (!query.trim()) {{
                // Clear search highlights
                document.querySelectorAll('.search-highlight').forEach(el => {{
                    el.classList.remove('search-highlight');
                }});
                return;
            }}
            
            // Find matching systems
            const matches = Object.keys(systemMetrics).filter(id => 
                systemMetrics[id].name.toLowerCase().includes(query.toLowerCase()) ||
                id.toLowerCase().includes(query.toLowerCase())
            );
            
            if (matches.length > 0) {{
                selectSystem(matches[0]); // Select first match
            }}
        }}
        
        function toggleMetrics() {{
            metricsVisible = !metricsVisible;
            document.getElementById('metricsGrid').style.display = metricsVisible ? 'grid' : 'none';
            document.getElementById('metricsToggle').textContent = metricsVisible ? '📊 Hide Metrics' : '📊 Show Metrics';
        }}
        
        function loadOverviewStats() {{
            const systems = Object.values(systemMetrics);
            const total = systems.length;
            const complete = systems.filter(s => s.status === 'design_complete').length;
            const avgProgress = Math.round(systems.reduce((acc, s) => acc + s.progress, 0) / total);
            const critical = systems.filter(s => s.priority === 'critical').length;
            
            document.getElementById('totalSystems').textContent = total;
            document.getElementById('completeSystems').textContent = complete;
            document.getElementById('avgProgress').textContent = avgProgress + '%';
            document.getElementById('criticalSystems').textContent = critical;
        }}
        
                 function validateDiagramContent(content) {{
             if (!content || typeof content !== 'string') {{
                 return false;
             }}
             
             // Check for basic Mermaid structure
             if (!content.includes('graph') && !content.includes('flowchart')) {{
                 return false;
             }}
             
             return true;
         }}
         
         function cleanString(str) {{
             if (!str) return '';
             // Clean string for Mermaid compatibility - avoid regex issues
             let cleaned = str.replace(/"/g, "'");
             cleaned = cleaned.split('\\n').join(' ');
             cleaned = cleaned.split('\\r').join(' ');
             cleaned = cleaned.split('\\t').join(' ');
             return cleaned.substring(0, 60);
         }}
         
         function generateFocusedView(systemId) {{
             // Generate a focused view for the selected system
             const system = systemMetrics[systemId];
             if (!system) {{
                 console.warn(`System ${{systemId}} not found in metrics`);
                 return 'graph TB\\n    error["❌ System not found"]\\n    class error error-node\\n    classDef error-node fill:#ff6b6b,color:#fff';
             }}
             
             const connections = getSystemConnections(systemId);
             const systemName = cleanString(system.name);
             const systemDesc = cleanString(system.description);
             
             let focusedMap = `graph TB
    ${{systemId}}["🌟 ${{systemName}}\\n${{systemDesc}}"]
    class ${{systemId}} focus-node
`;
             
             if (connections.length === 0) {{
                 focusedMap += `
    no_connections["📝 No connections found"]
    ${{systemId}} --> no_connections
    class no_connections info-node
`;
             }} else {{
                 connections.forEach(conn => {{
                     if (systemMetrics[conn.id]) {{
                         const connName = cleanString(systemMetrics[conn.id].name);
                         const connDesc = cleanString(systemMetrics[conn.id].description);
                         focusedMap += `
    ${{conn.id}}["⚡ ${{connName}}\\n${{connDesc}}"]
    ${{systemId}} --> ${{conn.id}}
    class ${{conn.id}} connected-node
`;
                     }}
                 }});
             }}
             
             focusedMap += `
    classDef focus-node fill:#ff6348,stroke:#ff3838,stroke-width:5px,color:#fff,font-weight:bold
    classDef connected-node fill:#7bed9f,stroke:#5f27cd,stroke-width:3px,color:#fff,font-weight:bold
    classDef info-node fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    classDef error-node fill:#ff6b6b,stroke:#d63447,stroke-width:3px,color:#fff
    classDef default font-size:12px
`;
             
             return focusedMap;
         }}
    </script>
</body>
</html>
"""
        
        html_file = self.export_path / "system-constellation.html"
        with open(html_file, 'w') as f:
            f.write(html_content)
        print(f"🌟 Generated Interactive Constellation Viewer: {html_file}")
        
        # Also export for Next.js integration
        relationship_data = {
            "constellation_map": constellation_map,
            "hierarchy_map": hierarchy_map,
            "generated_at": "Now with extra ✨ sparkle!"
        }
        
        nextjs_viz_path = self.rogue_docs_web_path / "data"
        nextjs_viz_path.mkdir(exist_ok=True)
        
        with open(nextjs_viz_path / "relationships.json", 'w') as f:
            json.dump(relationship_data, f, indent=2)
        print(f"💎 Exported relationship data for Next.js: {nextjs_viz_path / 'relationships.json'}")
        
        return {
            "constellation_file": constellation_file,
            "hierarchy_file": hierarchy_file, 
            "html_file": html_file
        }
    
    def export_for_nextjs(self):
        """Export data as JSON for Next.js consumption"""
        # Load all data
        all_data = {
            "cards": self.load_all_cards(),
            "bosses": self.load_all_bosses(),
            "mentors": self.load_all_mentors(),
            "constants": self.load_all_constants(),
            "interfaces": self.load_all_interfaces(),
            "content": self.load_markdown_content()
        }
        
        # Export to rogue-docs-web/data directory for Next.js
        nextjs_data_path = self.rogue_docs_web_path / "data"
        nextjs_data_path.mkdir(exist_ok=True)
        
        # Write all data as separate files
        for data_type, data in all_data.items():
            if data:  # Only write if data exists
                with open(nextjs_data_path / f"{data_type}.json", 'w') as f:
                    json.dump(data, f, indent=2)
                print(f"Exported {data_type} data to {nextjs_data_path / data_type}.json")
        
        return all_data
    
    def export_claude_context(self):
        """Export comprehensive context for Claude conversations"""
        # Load all data
        cards_data = self.load_all_cards()
        bosses_data = self.load_all_bosses()
        mentors_data = self.load_all_mentors()
        constants_data = self.load_all_constants()
        content_data = self.load_markdown_content()
        
        output = ["# Rogue Resident Complete System - Claude Context\n"]
        output.append("**Generated from structured YAML + Markdown documentation system**\n")
        
        # Boss Encounters Section
        if bosses_data:
            output.append("## Boss Encounters\n")
            for boss_name, boss_data in bosses_data.items():
                system_info = boss_data.get('system_info', {})
                output.append(f"### {system_info.get('name', boss_name)}")
                output.append(f"**Type**: {system_info.get('type', 'N/A')}")
                output.append(f"**Difficulty**: {system_info.get('difficulty', 'N/A')}")
                output.append(f"**Season**: {system_info.get('season_availability', 'N/A')}")
                output.append(f"**Duration**: {system_info.get('estimated_duration', 'N/A')}")
                output.append(f"**Mastery Required**: {system_info.get('mastery_threshold', 'N/A')}%")
                
                # Character data - flexible parsing
                char_data = boss_data.get('character_data', {})
                if char_data:
                    char_name = char_data.get('name', 'N/A')
                    char_title = char_data.get('title', char_data.get('nature', char_data.get('composition', '')))
                    if char_title:
                        output.append(f"**Character**: {char_name} - {char_title}")
                    else:
                        output.append(f"**Character**: {char_name}")
                    
                    # Core fear or special traits
                    if char_data.get('core_fear'):
                        output.append(f"**Core Fear**: {char_data.get('core_fear')}")
                    elif char_data.get('special_traits'):
                        traits = char_data.get('special_traits', [])
                        output.append(f"**Special Traits**: {', '.join(traits)}")
                    elif char_data.get('challenge_type'):
                        output.append(f"**Challenge Type**: {char_data.get('challenge_type')}")
                
                # Boss encounter mechanics - flexible parsing
                encounter = boss_data.get('boss_encounter', {})
                if encounter:
                    encounter_name = encounter.get('name', 'N/A')
                    output.append(f"**Encounter**: {encounter_name}")
                    
                    # Energy system (only Marcus Chen has this)
                    energy_sys = encounter.get('energy_system', {})
                    if energy_sys:
                        output.append(f"**Energy System**: {energy_sys.get('name', 'N/A')} (Start: {energy_sys.get('starting_value', 'N/A')})")
                    
                    # Special mechanic (Ionix and Vendor Trio have this)
                    special_mechanic = encounter.get('special_mechanic')
                    if special_mechanic:
                        output.append(f"**Special Mechanic**: {special_mechanic.replace('_', ' ').title()}")
                    
                    # Phases - all bosses have this
                    phases = encounter.get('phases', {})
                    if phases:
                        output.append("**Phases**:")
                        for phase_id, phase in phases.items():
                            phase_name = phase.get('name', phase_id)
                            duration = phase.get('duration', 'N/A')
                            
                            # Different bosses store behavior differently
                            behavior = (phase.get('chen_behavior') or 
                                      phase.get('primary_challenge') or 
                                      phase.get('format') or 'N/A')
                            
                            output.append(f"- **{phase_name}**: {behavior} ({duration})")
                
                # Strategic preparation info
                prep_activities = boss_data.get('preparation_activities', [])
                if prep_activities and len(prep_activities) > 0:
                    output.append("**Key Preparation Activities**:")
                    for activity in prep_activities[:2]:  # Show first 2 activities
                        if isinstance(activity, dict):
                            activity_name = activity.get('name', 'N/A')
                            output.append(f"- {activity_name}")
                        else:
                            output.append(f"- {activity}")
                
                # Rewards
                rewards = boss_data.get('rewards', {})
                if rewards:
                    sp_reward = rewards.get('sp_reward', 'N/A')
                    output.append(f"**SP Reward**: {sp_reward}")
                
                # Cross-references
                cross_refs = boss_data.get('cross_references', {})
                if cross_refs:
                    related_systems = cross_refs.get('related_systems', [])
                    if related_systems:
                        output.append(f"**Related Systems**: {', '.join(related_systems)}")
                
                output.append(f"**See**: `content/character-arcs/{boss_name}.md` for complete narrative\n")
        
        # Mentors Section - FIXED to parse actual data structure
        if mentors_data:
            output.append("## Mentors\n")
            mentors = mentors_data.get('mentors', {}).get('mentors', {})
            for mentor_id, mentor in mentors.items():
                output.append(f"### {mentor.get('full_name', mentor_id)}")
                output.append(f"**Title**: {mentor.get('title', 'N/A')}")
                output.append(f"**Role**: {mentor.get('role', 'N/A')}")
                output.append(f"**Domain**: {mentor.get('domain_expertise', 'N/A')}")
                output.append(f"**Archetype**: {mentor.get('personality_archetype', 'N/A')}")
                
                # Character traits
                traits = mentor.get('character_traits', {})
                if traits:
                    output.append(f"**Teaching Style**: {traits.get('teaching_style', 'N/A')}")
                    output.append(f"**Communication**: {traits.get('communication_style', 'N/A')}")
                
                # Domain focus
                domain_focus = mentor.get('domain_focus', {})
                if domain_focus:
                    output.append(f"**Primary Domain**: {domain_focus.get('primary_domain', 'N/A')}")
                    primary_stars = domain_focus.get('primary_stars', [])
                    if primary_stars:
                        output.append(f"**Primary Stars**: {', '.join(primary_stars)}")
                
                # Dialogue themes
                dialogue_themes = mentor.get('dialogue_themes', [])
                if dialogue_themes:
                    output.append("**Key Dialogue Themes**:")
                    for theme in dialogue_themes[:3]:  # Show first 3 themes
                        output.append(f"- {theme.replace('_', ' ').title()}")
                
                # Special significance
                special_sig = mentor.get('special_significance', {})
                if special_sig:
                    for key, value in special_sig.items():
                        if isinstance(value, bool) and value:
                            output.append(f"**Special Role**: {key.replace('_', ' ').title()}")
                        elif isinstance(value, str):
                            output.append(f"**{key.replace('_', ' ').title()}**: {value}")
                
                output.append("")
        
        # Constants/Systems Section
        if constants_data:
            output.append("## Core Systems\n")
            for system_name, system_data in constants_data.items():
                system_info = system_data.get('system_info', {})
                output.append(f"### {system_info.get('name', system_name)}")
                output.append(f"**Description**: {system_info.get('description', 'N/A')}")
                
                # Special handling for different system types
                if 'journal_progression' in system_data:
                    journals = system_data['journal_progression']
                    output.append("**Four-Journal System**:")
                    for journal_id, journal in journals.items():
                        output.append(f"- **{journal.get('name', journal_id)}**: {journal.get('acquisition', 'N/A')}")
                        caps = journal.get('capabilities', [])
                        if caps:
                            output.append(f"  - Capabilities: {', '.join(caps)}")
                
                elif 'three_interpretations' in system_data:
                    interpretations = system_data['three_interpretations']
                    output.append("**Three Interpretations**:")
                    for interp_id, interp in interpretations.items():
                        output.append(f"- **{interp.get('name', interp_id)}** ({interp.get('category', 'N/A')})")
                        output.append(f"  - {interp.get('core_concept', 'N/A')}")
                
                output.append(f"**See**: `{system_info.get('content_reference', 'N/A')}` for complete details\n")
        
        # Cards Section
        if cards_data:
            output.append("## Cards System\n")
            for system_name, system_data in cards_data.items():
                system_info = system_data.get('system_info', {})
                output.append(f"### {system_info.get('name', system_name)}")
                output.append(f"**Description**: {system_info.get('description', '')}")
                
                # Card system overview
                card_overview = system_data.get('card_system_overview', {})
                if card_overview:
                    total_cards = card_overview.get('total_cards', 'N/A')
                    output.append(f"**Total Cards**: {total_cards}")
                    output.append(f"**Card Slots**: {card_overview.get('card_slot_limit', 'N/A')}")
                    
                    distribution = card_overview.get('card_distribution', {})
                    if distribution:
                        output.append("**Card Distribution**:")
                        for key, value in distribution.items():
                            if key != 'missing_incomplete':  # Don't show missing info
                                output.append(f"- {key.replace('_', ' ').title()}: {value}")
                
                # High Priority Cards by Domain
                domain_sections = {
                    'treatment_planning_cards': 'Treatment Planning Domain',
                    'radiation_therapy_cards': 'Radiation Therapy Domain', 
                    'linear_accelerator_cards': 'Linear Accelerator Domain',
                    'dosimetry_cards': 'Dosimetry Domain',
                    'cross_domain_cards': 'Cross-Domain Cards'
                }
                
                total_cards_shown = 0
                for domain_key, domain_name in domain_sections.items():
                    domain_cards = system_data.get(domain_key, {})
                    if domain_cards and total_cards_shown < 12:  # Limit total cards shown
                        output.append(f"\n**{domain_name}**:")
                        
                        # Show high priority cards first
                        high_priority_cards = []
                        other_cards = []
                        
                        for card_id, card_data in domain_cards.items():
                            if isinstance(card_data, dict):
                                priority = card_data.get('implementation_priority', 'medium')
                                if priority == 'high':
                                    high_priority_cards.append((card_id, card_data))
                                else:
                                    other_cards.append((card_id, card_data))
                        
                        # Show high priority cards first, then fill with others
                        cards_to_show = high_priority_cards + other_cards
                        domain_limit = min(3, len(cards_to_show))  # Max 3 per domain
                        
                        for card_id, card_data in cards_to_show[:domain_limit]:
                            if total_cards_shown >= 12:
                                break
                                
                            card_name = card_data.get('name', card_id)
                            star = card_data.get('associated_star', 'N/A')
                            passive = card_data.get('passive_effect', 'TBD')
                            active = card_data.get('active_effect', 'TBD')
                            priority = card_data.get('implementation_priority', 'medium')
                            
                            # Clean up missing effects
                            if '[NEEDS IMPLEMENTATION]' in passive:
                                passive = 'TBD'
                            if '[NEEDS IMPLEMENTATION]' in active:
                                active = 'TBD'
                            
                            output.append(f"- **{card_name}** ({star}) - Priority: {priority.title()}")
                            output.append(f"  - Passive: {passive}")
                            output.append(f"  - Active: {active}")
                            
                            total_cards_shown += 1
                
                # Implementation status
                impl_status = system_data.get('implementation_status', {})
                if impl_status:
                    complete_cards = impl_status.get('complete_cards', 0)
                    
                    # Handle cases where missing effects might be integers, lists, or strings (due to malformed YAML)
                    missing_passive_raw = impl_status.get('missing_passive_effects', [])
                    missing_active_raw = impl_status.get('missing_active_effects', [])
                    
                    def extract_count(value):
                        if isinstance(value, int):
                            return value
                        elif isinstance(value, list):
                            return len(value)
                        elif isinstance(value, str):
                            # If it's a string, try to extract the number from the beginning
                            match = re.match(r'^(\d+)', value.strip())
                            return int(match.group(1)) if match else 0
                        else:
                            return 0
                    
                    missing_passive = extract_count(missing_passive_raw)
                    missing_active = extract_count(missing_active_raw)
                    
                    output.append(f"\n**Implementation Status**: {complete_cards} complete cards, {missing_passive + missing_active} need completion")
                
                output.append(f"\n**See**: `{system_info.get('content_reference', 'N/A')}` for complete visual designs and implementation details\n")
        
        # Add note about comprehensive content
        if content_data:
            output.append("## Additional Narrative Content\n")
            output.append("**Complete character arcs, design philosophy, and implementation details available in:**")
            for content_path in sorted(content_data.keys()):
                output.append(f"- `content/{content_path}`")
            output.append("")
        
        output.append("---")
        output.append("*This is a comprehensive export from the Rogue Resident documentation system.*")
        output.append("*YAML files contain authoritative mechanical data, Markdown files contain narrative context.*")
        
        export_file = self.export_path / "claude-context.md"
        with open(export_file, 'w') as f:
            f.write('\n'.join(output))
        
        print(f"Exported comprehensive Claude context to {export_file}")
        return export_file
    
    def load_referenced_content(self, content_path):
        """Load and return the actual content of a referenced file"""
        # Try different possible locations for the file
        possible_paths = [
            self.base_path / content_path,
            self.base_path / "content" / content_path.replace("content/", ""),
            self.base_path / content_path.replace("data/", "data/"),
        ]
        
        for path in possible_paths:
            if path.exists():
                try:
                    with open(path, 'r') as f:
                        return f.read()
                except Exception as e:
                    print(f"Warning: Could not read {path}: {e}")
        
        # If not found, return a helpful message
        return f"[CONTENT NOT FOUND: {content_path}]"

    def create_self_contained_context(self, system_data, include_archives=False):
        """Create a self-contained context that embeds all referenced content"""
        context = dict(system_data)
        
        # Embed referenced content files
        if 'cross_references' in system_data and 'content_files' in system_data['cross_references']:
            embedded_content = {}
            for content_file in system_data['cross_references']['content_files']:
                content = self.load_referenced_content(content_file)
                embedded_content[content_file] = content
            context['embedded_content_files'] = embedded_content
        
        # Embed related system data
        if 'cross_references' in system_data and 'related_systems' in system_data['cross_references']:
            embedded_systems = {}
            for system_name in system_data['cross_references']['related_systems']:
                # Try to load the related system data
                system_file = f"data/{system_name}.yaml"
                system_content = self.load_referenced_content(system_file)
                
                # Also try other locations
                if "[CONTENT NOT FOUND:" in system_content:
                    # Try as an interface
                    system_file = f"data/interfaces/{system_name}.yaml"
                    system_content = self.load_referenced_content(system_file)
                
                if "[CONTENT NOT FOUND:" in system_content:
                    # Try in content directory as markdown
                    system_file = f"content/{system_name}.md"
                    system_content = self.load_referenced_content(system_file)
                
                embedded_systems[system_name] = {
                    'file_path': system_file,
                    'content': system_content
                }
            context['embedded_related_systems'] = embedded_systems
        
        # Add comprehensive archives if requested
        if include_archives:
            context.update({
                'archived_content': self.load_markdown_content(),
                'mentors_data': self.load_all_mentors(),
                'constants_data': self.load_all_constants(),
                'cards_data': self.load_all_cards(),
                'bosses_data': self.load_all_bosses(),
                'include_archives': True
            })
        
        # Add repository context
        context['repository_info'] = {
            'source_repository': 'rogue-resident-docs',
            'base_path': str(self.base_path.absolute()),
            'generated_at': self._get_timestamp(),
            'self_contained': True
        }
        
        return context

    def _get_timestamp(self):
        """Get current timestamp for generation tracking"""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def export_three_audience_workflow(self, system_name=None, include_archives=False, copy_to=None, export_references=False):
        """🎯 Export documentation for the three-audience workflow! 🎯"""
        
        if include_archives:
            print("🎭 Generating Enhanced Three-Audience Workflow Documentation (with archives)... ✨")
        else:
            print("🎭 Generating Three-Audience Workflow Documentation... ✨")
        
        # Load all interface data
        interfaces_data = self.load_all_interfaces()
        
        if not interfaces_data:
            print("❌ No interface data found! Please create interface YAML files in data/interfaces/")
            return
        
        # If no specific system requested, use the first available
        if system_name is None:
            system_name = list(interfaces_data.keys())[0]
            print(f"🎯 Using system: {system_name}")
        
        if system_name not in interfaces_data:
            print(f"❌ System '{system_name}' not found in interfaces data!")
            print(f"Available systems: {list(interfaces_data.keys())}")
            return
        
        system_data = interfaces_data[system_name]
        
        # Choose context creation approach
        if export_references:
            print("📚 Creating context with local file references...")
            exported_files = self.export_referenced_files(system_data, self.export_path)
            template_context = self.create_file_reference_context(system_data, exported_files)
            print(f"✅ Exported {len(exported_files)} reference files to references/ directory")
        else:
            print("📚 Creating self-contained context with embedded content...")
            template_context = self.create_self_contained_context(system_data, include_archives)
            
            if include_archives:
                print(f"✅ Enhanced with {len(template_context.get('archived_content', {}))} content files and all game system data")
            else:
                print("✅ Basic self-contained context created with embedded references")
        
        # Generate Audience 1: Conversational Context (Luke + Zach)
        generated_files = []
        
        print("🗣️ Generating Audience 1: Conversational Context...")
        try:
            template = self.jinja_env.get_template('conversational-context.md.jinja')
            output = template.render(**template_context)
            
            output_file = self.export_path / f"{system_name}-conversational.md"
            with open(output_file, 'w') as f:
                f.write(output)
            generated_files.append(output_file)
            print(f"✅ Conversational context: {output_file}")
        except Exception as e:
            print(f"❌ Error generating conversational context: {e}")
        
        # Generate Audience 2: Development Planning (Luke)
        print("📋 Generating Audience 2: Development Planning...")
        try:
            template = self.jinja_env.get_template('development-planning.md.jinja')
            output = template.render(**template_context)
            
            output_file = self.export_path / f"{system_name}-development-plan.md"
            with open(output_file, 'w') as f:
                f.write(output)
            generated_files.append(output_file)
            print(f"✅ Development plan: {output_file}")
        except Exception as e:
            print(f"❌ Error generating development plan: {e}")
        
        # Generate Audience 3: LLM Implementation Context (Claude)
        print("🤖 Generating Audience 3: LLM Implementation Context...")
        try:
            template = self.jinja_env.get_template('llm-implementation-context.md.jinja')
            output = template.render(**template_context)
            
            output_file = self.export_path / f"{system_name}-implementation-context.md"
            with open(output_file, 'w') as f:
                f.write(output)
            generated_files.append(output_file)
            print(f"✅ Implementation context: {output_file}")
        except Exception as e:
            print(f"❌ Error generating implementation context: {e}")
        
        # Copy files to specified directory if requested
        if copy_to and generated_files:
            self._copy_files_to_destination(generated_files, copy_to, system_name)
        
        print("🎉 Three-audience workflow documentation generated successfully!")
        print(f"📁 Files available in: {self.export_path}")
        
        return {
            'conversational': f"{system_name}-conversational.md",
            'planning': f"{system_name}-development-plan.md", 
            'implementation': f"{system_name}-implementation-context.md"
        }
    
    def _copy_files_to_destination(self, generated_files, copy_to, system_name):
        """Copy generated files to the specified destination directory"""
        import shutil
        
        try:
            destination_path = Path(copy_to)
            destination_path.mkdir(parents=True, exist_ok=True)
            
            print(f"\n📂 Copying files to {destination_path}...")
            
            for file_path in generated_files:
                if file_path.exists():
                    dest_file = destination_path / file_path.name
                    shutil.copy2(file_path, dest_file)
                    print(f"✅ Copied {file_path.name} → {dest_file}")
            
            # Copy references directory if it exists
            references_dir = self.export_path / "references"
            if references_dir.exists():
                dest_references = destination_path / "references"
                if dest_references.exists():
                    shutil.rmtree(dest_references)
                shutil.copytree(references_dir, dest_references)
                print(f"✅ Copied references/ directory → {dest_references}")
            
            # Create a simple README in the destination
            references_note = ""
            if references_dir.exists():
                references_note = """
## References

The `references/` directory contains all referenced source files that support the main documentation.
All content is self-contained - no external dependencies required.
"""
            
            readme_content = f"""# {system_name.replace('-', ' ').title()} Documentation

Generated by Rogue Resident Three-Audience Workflow System

## Files

- **{system_name}-conversational.md**: Design discussion context (Luke + Zach)
- **{system_name}-development-plan.md**: Implementation roadmap (Luke's workflow)  
- **{system_name}-implementation-context.md**: Complete technical context (LLM collaboration)
{references_note}
## Usage

These files contain focused documentation for different audiences:

1. **Conversational**: Use for design discussions and team coordination
2. **Development Planning**: Use for implementation planning and priority setting
3. **LLM Implementation**: Attach to LLM conversations for comprehensive context

Generated on: {Path.cwd()}
Source: Rogue Resident documentation system
"""
            
            readme_file = destination_path / "README.md"
            with open(readme_file, 'w') as f:
                f.write(readme_content)
            print(f"✅ Created README.md → {readme_file}")
            
            print(f"🎉 Successfully copied all files to {destination_path}")
            
        except Exception as e:
            print(f"❌ Error copying files to {copy_to}: {e}")

    def export_referenced_files(self, system_data, export_dir):
        """Export all referenced files to a references directory alongside the main docs"""
        references_dir = Path(export_dir) / "references"
        references_dir.mkdir(exist_ok=True)
        
        exported_files = []
        
        # Export related system files
        if 'cross_references' in system_data and 'related_systems' in system_data['cross_references']:
            for system_name in system_data['cross_references']['related_systems']:
                # Try to find and export the system file
                possible_paths = [
                    f"data/{system_name}.yaml",
                    f"data/interfaces/{system_name}.yaml",
                    f"content/{system_name}.md"
                ]
                
                for file_path in possible_paths:
                    content = self.load_referenced_content(file_path)
                    if "[CONTENT NOT FOUND:" not in content:
                        # Export to references directory
                        ref_file = references_dir / f"{system_name}.md"
                        with open(ref_file, 'w') as f:
                            f.write(f"# {system_name.replace('-', ' ').title()}\n\n")
                            f.write(f"**Source**: `{file_path}`\n\n")
                            f.write(content)
                        exported_files.append(f"references/{system_name}.md")
                        break
        
        # Export content files
        if 'cross_references' in system_data and 'content_files' in system_data['cross_references']:
            for content_file in system_data['cross_references']['content_files']:
                content = self.load_referenced_content(content_file)
                if "[CONTENT NOT FOUND:" not in content:
                    # Create subdirectories as needed
                    ref_file_path = references_dir / content_file.replace('content/', '')
                    ref_file_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    with open(ref_file_path, 'w') as f:
                        f.write(content)
                    exported_files.append(f"references/{content_file.replace('content/', '')}")
        
        return exported_files

    def create_file_reference_context(self, system_data, exported_files=None):
        """Create context that references local files instead of embedding content"""
        context = dict(system_data)
        
        # Add repository context
        context['repository_info'] = {
            'source_repository': 'rogue-resident-docs',
            'base_path': str(self.base_path.absolute()),
            'generated_at': self._get_timestamp(),
            'self_contained': True,
            'references_exported': bool(exported_files)
        }
        
        # Add list of exported reference files
        if exported_files:
            context['exported_reference_files'] = exported_files
        
        # CRITICAL FIX: Populate embedded_related_systems with rich data for template access
        if 'embedded_related_systems' not in context:
            context['embedded_related_systems'] = {}
            
            # Get all the data we need for rich template access
            all_constants = system_data.get('constants_data', {})
            all_content = system_data.get('content_data', {})
            all_cards = system_data.get('cards_data', {})
            
            # Add key narrative systems with their rich data (same logic as self-contained context)
            narrative_systems = [
                'constellation-phenomenon', 'journal-system', 'visual-design', 
                'activity-framework', 'amara-narrative', 'pico-character',
                'etching-system', 'journal-integration', 'visual-time-system',
                'complete-card-system', 'educational-framework', 'game-constants'
            ]
            
            # Include constants data (YAML files with rich system specifications)
            for system_name, system_data_item in all_constants.items():
                if any(narrative_sys in system_name for narrative_sys in narrative_systems):
                    if isinstance(system_data_item, dict):
                        import yaml
                        yaml_content = yaml.dump(system_data_item, default_flow_style=False, sort_keys=False)
                        context['embedded_related_systems'][system_name] = {
                            'file_path': f'data/constants/{system_name}.yaml',
                            'content': yaml_content,
                            'system_info': system_data_item.get('system_info', {}),
                            'rich_data': system_data_item  # Keep structured data for template logic
                        }
            
            # Include content data (markdown files with rich narrative content)
            for content_file, content in all_content.items():
                content_name = content_file.replace('content/', '').replace('.md', '').replace('/', '-')
                if any(narrative_sys in content_name for narrative_sys in narrative_systems):
                    context['embedded_related_systems'][content_name] = {
                        'file_path': content_file,
                        'content': content,
                        'type': 'content'
                    }
            
            # Include cards data from cards directory
            for system_name, system_data_item in all_cards.items():
                if any(narrative_sys in system_name for narrative_sys in narrative_systems):
                    if isinstance(system_data_item, dict):
                        import yaml
                        yaml_content = yaml.dump(system_data_item, default_flow_style=False, sort_keys=False)
                        context['embedded_related_systems'][system_name] = {
                            'file_path': f'data/cards/{system_name}.yaml',
                            'content': yaml_content,
                            'system_info': system_data_item.get('system_info', {}),
                            'rich_data': system_data_item  # Keep structured data for template logic
                        }
        
        return context

    def export_narrative_workflow(self, focus_area=None, include_archives=False, copy_to=None, export_references=False):
        """🎭 Export documentation for the narrative/lore/storybuilding workflow! 🎭"""
        
        if include_archives:
            print("📚 Generating Enhanced Narrative Workflow Documentation (with archives)... ✨")
        else:
            print("📚 Generating Narrative Workflow Documentation... ✨")
        
        # Determine focus area - can be character, world, plot, or a specific system
        focus_areas = {
            'character': ['pico-character', 'amara-narrative', 'mentors'],
            'world': ['constellation-phenomenon', 'visual-design', 'game-constants'],
            'plot': ['journal-system', 'activity-framework', 'tutorial-design'],
            'all': None  # Will include everything
        }
        
        if focus_area and focus_area in focus_areas:
            target_systems = focus_areas[focus_area]
            print(f"🎯 Focusing on {focus_area} narrative elements...")
        else:
            # If focus_area is a specific system name or 'all', include everything
            target_systems = None
            if focus_area and focus_area != 'all':
                print(f"🎯 Focusing on specific system: {focus_area}")
            else:
                print("🎯 Creating comprehensive narrative documentation...")
        
        # Load all available data for narrative context
        all_data = {
            'constants': self.load_all_constants(),
            'mentors': self.load_all_mentors(),
            'cards': self.load_all_cards(),
            'bosses': self.load_all_bosses(),
            'interfaces': self.load_all_interfaces(),
            'content': self.load_markdown_content()
        }
        
        # Don't filter data too aggressively - always include core narrative elements
        core_narrative_systems = ['pico-character', 'amara-narrative', 'constellation-phenomenon', 'journal-system', 'activity-framework', 'etching-system', 'complete-card-system', 'visual-design', 'mentors']
        
        if target_systems:
            # Include target systems PLUS core narrative systems
            expanded_targets = list(set(target_systems + core_narrative_systems))
            filtered_data = {}
            for category, data in all_data.items():
                if category == 'content':
                    # Always preserve all content data since it contains character arcs and world building
                    filtered_data[category] = data
                else:
                    filtered_data[category] = {}
                    for system_name, system_data in data.items():
                        if any(target in system_name for target in expanded_targets) or system_name in core_narrative_systems:
                            filtered_data[category][system_name] = system_data
            narrative_data = filtered_data
        else:
            narrative_data = all_data
        
        # Create narrative-focused system info
        system_info = {
            'name': f"Narrative {'& ' + focus_area.title() if focus_area and focus_area != 'all' else ''} Systems",
            'description': f"Story, character, and world-building elements{'focused on ' + focus_area if focus_area and focus_area != 'all' else ''} for Rogue Resident",
            'user_experience_philosophy': 'Authentic medical physics storytelling through character-driven discovery'
        }
        
        # Create development context
        development_context = {
            'current_status': 'Rich narrative foundation with character arcs, world building, and mentor personalities established',
            'inspiration': 'Create meaningful educational experience through compelling character relationships and authentic professional development',
            'decision_points': 'Balancing story depth with educational goals and professional authenticity',
            'success_metrics': 'Players form genuine connections with mentors and feel authentic professional growth',
            'constraints': 'Must maintain medical physics accuracy while creating emotionally engaging narrative'
        }
        
        # Extract and structure mentor data properly
        mentors_structured = {}
        if 'mentors' in narrative_data and narrative_data['mentors']:
            for mentor_file, mentor_data in narrative_data['mentors'].items():
                if 'mentors' in mentor_data:
                    # Extract individual mentors from the structured data
                    for mentor_id, mentor_info in mentor_data['mentors'].items():
                        mentors_structured[mentor_id] = {
                            'name': mentor_info.get('full_name', mentor_info.get('title', mentor_id)),
                            'title': mentor_info.get('title', mentor_id),
                            'role': mentor_info.get('role', 'Medical Physics Mentor'),
                            'teaching_style': mentor_info.get('character_traits', {}).get('teaching_style', 'supportive_guidance'),
                            'personality': {
                                'primary': mentor_info.get('character_traits', {}).get('primary', 'professional'),
                                'dialogue_style': mentor_info.get('character_traits', {}).get('communication_style', 'supportive'),
                                'domain_expertise': mentor_info.get('domain_expertise', 'medical_physics')
                            },
                            'narrative_role': mentor_info.get('narrative_role', {}),
                            'dialogue_themes': mentor_info.get('dialogue_themes', [])
                        }
        
        # Extract boss character data
        boss_characters = {}
        if 'bosses' in narrative_data:
            for boss_name, boss_data in narrative_data['bosses'].items():
                if 'boss_encounter' in boss_data:
                    encounter = boss_data['boss_encounter']
                    boss_characters[boss_name] = {
                        'name': encounter.get('character_name', boss_name.replace('-', ' ').title()),
                        'type': encounter.get('encounter_type', 'character_conflict'),
                        'description': encounter.get('description', 'Character encounter'),
                        'character_arc': encounter.get('character_development', {}),
                        'phases': encounter.get('phases', {}),
                        'difficulty': encounter.get('difficulty', 'intermediate'),
                        'season': encounter.get('season', 'varies'),
                        'duration': encounter.get('duration', '20-30 minutes'),
                        'mastery_required': encounter.get('mastery_required', '40%'),
                        'special_mechanic': encounter.get('special_mechanic', 'standard'),
                        'preparation_activities': encounter.get('preparation_activities', []),
                        'sp_reward': encounter.get('rewards', {}).get('sp_reward', 20),
                        'special_traits': encounter.get('special_traits', []),
                        'rich_encounter_data': encounter  # Keep full data for templates
                    }
        
        # Extract character arc data from content files
        character_arcs = {}
        if 'content' in narrative_data:
            for content_file, content in narrative_data['content'].items():
                if 'character-arcs/' in content_file:
                    char_name = content_file.replace('character-arcs/', '').replace('.md', '')
                    # Extract key info from markdown content
                    character_arcs[char_name] = {
                        'file': content_file,
                        'content_preview': content[:500] + '...' if len(content) > 500 else content,
                        'full_content': content
                    }
        
        # Create enhanced narrative context with properly structured data
        narrative_context = {
            'system_info': system_info,
            'development_context': development_context,
            'mentors_data': {'structured_mentors': mentors_structured},  # Fixed structure
            'boss_characters': boss_characters,
            'character_arcs': character_arcs,
            'constants_data': narrative_data.get('constants', {}),
            'cards_data': narrative_data.get('cards', {}),
            'content_data': narrative_data.get('content', {}),
            'cross_references': {
                'related_systems': list(narrative_data.get('constants', {}).keys()) + list(narrative_data.get('mentors', {}).keys())
            },
            # Add required template variables with enhanced data
            'components': {
                'character_system': {
                    'name': 'Character Development System',
                    'user_experience_role': 'Provides authentic mentor personalities and character growth arcs',
                    'implementation_status': 'Character arcs and mentor personalities established',
                    'narrative_integration': 'Provides authentic mentor personalities and character growth arcs'
                },
                'world_building': {
                    'name': 'World Building System', 
                    'user_experience_role': 'Creates immersive medical physics hospital environment',
                    'implementation_status': 'Core lore and setting established',
                    'narrative_integration': 'Creates immersive medical physics hospital environment'
                },
                'narrative_flow': {
                    'name': 'Narrative Flow System',
                    'user_experience_role': 'Manages story progression and emotional pacing',
                    'implementation_status': 'Tutorial and progression frameworks designed',
                    'narrative_integration': 'Manages story progression and emotional pacing'
                }
            },
            'user_experience_flow': {
                'character_introduction': {
                    'name': 'Character Introduction',
                    'description': 'Players meet mentors and begin forming professional relationships',
                    'user_actions': ['Meet mentor', 'Begin first conversation', 'Establish trust']
                },
                'story_progression': {
                    'name': 'Story Progression',
                    'description': 'Narrative advances through authentic mentor interactions and learning scenarios',
                    'user_actions': ['Engage in dialogue', 'Complete learning activities', 'Build relationships']
                },
                'character_development': {
                    'name': 'Character Development',
                    'description': 'Both player and mentors evolve through continued professional interaction',
                    'user_actions': ['Master concepts', 'Gain mentor recognition', 'Develop competence']
                }
            },
            'asset_pipeline': {
                'immediate_needs': {
                    'character_portraits': ['High-definition mentor faces', 'Character expression sets'],
                    'environments': ['Hospital room backgrounds', 'Medical physics equipment'],
                    'ui_elements': ['Dialogue interface elements', 'Character interaction overlays']
                },
                'asset_creation_order': {
                    'week_1': 'Character portraits and basic dialogue interface',
                    'week_4': 'Full character animation and environmental storytelling'
                }
            },
            'development_priorities': {
                'blocking_items': [
                    {
                        'component': 'character_voice_consistency',
                        'reason': 'Need to establish voice guidelines for each mentor across all systems'
                    }
                ],
                'ready_to_implement': [
                    {
                        'component': 'mentor_personalities',
                        'reason': 'Character framework established, ready for dialogue implementation'
                    }
                ]
            },
            # Add tutorial data for template compatibility
            'first_day_tutorial': {
                'morning_arrival': {
                    'time': '8:00 AM',
                    'location': 'Hospital Physics Department',
                    'primary_mentor': 'Dr. Garcia',
                    'objectives': ['Meet mentor', 'Introduction to hospital environment', 'First professional interaction']
                },
                'mentor_introduction': {
                    'time': '8:30 AM', 
                    'location': 'Physics Office',
                    'primary_mentor': 'Dr. Garcia',
                    'objectives': ['Establish mentor relationship', 'Learn department structure', 'Begin learning journey']
                }
            },
            'night_phase_tutorial': {
                'reflection_time': {
                    'time': '6:00 PM',
                    'location': 'Resident lounge',
                    'delivery_method': 'personal_journal',
                    'objectives': ['Process daily learning', 'Reflect on mentor interactions', 'Plan tomorrow']
                }
            }
        }
        
        # Choose context creation approach
        if export_references:
            print("📚 Creating context with local file references...")
            # For narrative workflow, we want to reference character arcs and content files
            exported_files = self.export_narrative_referenced_files(narrative_context, self.export_path)
            template_context = self.create_file_reference_context(narrative_context, exported_files)
            print(f"✅ Exported {len(exported_files)} narrative reference files to references/ directory")
        else:
            print("📚 Creating self-contained context with embedded content...")
            template_context = self.create_self_contained_narrative_context(narrative_context, include_archives)
            
            if include_archives:
                print(f"✅ Enhanced with comprehensive narrative content and character data")
            else:
                print("✅ Basic self-contained narrative context created")
        
        # Generate the three narrative-focused documents
        generated_files = []
        
        # Generate Narrative Context (for writers/narrative designers)
        print("🎭 Generating Narrative Context (Writers & Narrative Designers)...")
        try:
            template = self.jinja_env.get_template('narrative-context.md.jinja')
            output = template.render(**template_context)
            
            focus_suffix = f"-{focus_area}" if focus_area and focus_area != 'all' else ""
            output_file = self.export_path / f"narrative{focus_suffix}-context.md"
            with open(output_file, 'w') as f:
                f.write(output)
            generated_files.append(output_file)
            print(f"✅ Narrative context: {output_file}")
        except Exception as e:
            print(f"❌ Error generating narrative context: {e}")
        
        # Generate Lore Implementation Guide (for developers)
        print("🛠️ Generating Lore Implementation Guide (Developers)...")
        try:
            template = self.jinja_env.get_template('lore-implementation.md.jinja')
            output = template.render(**template_context)
            
            focus_suffix = f"-{focus_area}" if focus_area and focus_area != 'all' else ""
            output_file = self.export_path / f"lore{focus_suffix}-implementation.md"
            with open(output_file, 'w') as f:
                f.write(output)
            generated_files.append(output_file)
            print(f"✅ Lore implementation: {output_file}")
        except Exception as e:
            print(f"❌ Error generating lore implementation: {e}")
        
        # Generate Story Continuity Reference (for AI assistants)
        print("🧠 Generating Story Continuity Reference (AI Assistants)...")
        try:
            template = self.jinja_env.get_template('story-continuity.md.jinja')
            output = template.render(**template_context)
            
            focus_suffix = f"-{focus_area}" if focus_area and focus_area != 'all' else ""
            output_file = self.export_path / f"story{focus_suffix}-continuity.md"
            with open(output_file, 'w') as f:
                f.write(output)
            generated_files.append(output_file)
            print(f"✅ Story continuity: {output_file}")
        except Exception as e:
            print(f"❌ Error generating story continuity: {e}")
        
        # Copy files to specified directory if requested
        if copy_to and generated_files:
            self._copy_narrative_files_to_destination(generated_files, copy_to, focus_area)
        
        print("🎉 Narrative workflow documentation generated successfully!")
        print(f"📁 Files available in: {self.export_path}")
        
        return {
            'narrative_context': f"narrative{'-' + focus_area if focus_area and focus_area != 'all' else ''}-context.md",
            'lore_implementation': f"lore{'-' + focus_area if focus_area and focus_area != 'all' else ''}-implementation.md",
            'story_continuity': f"story{'-' + focus_area if focus_area and focus_area != 'all' else ''}-continuity.md"
        }

    def export_narrative_referenced_files(self, narrative_context, export_dir):
        """Export narrative-specific referenced files"""
        references_dir = Path(export_dir) / "references"
        references_dir.mkdir(exist_ok=True)
        
        exported_files = []
        
        # Export character arc files
        character_arcs = ['character-arcs/amara-sato.md', 'character-arcs/pico.md', 'character-arcs/marcus-chen.md']
        for arc_file in character_arcs:
            content = self.load_referenced_content(f"content/{arc_file}")
            if "[CONTENT NOT FOUND:" not in content:
                ref_file_path = references_dir / arc_file
                ref_file_path.parent.mkdir(parents=True, exist_ok=True)
                with open(ref_file_path, 'w') as f:
                    f.write(content)
                exported_files.append(f"references/{arc_file}")
        
        # Export mentor philosophy file
        mentor_philosophy = 'mentors/mentor-philosophies.md'
        content = self.load_referenced_content(f"content/{mentor_philosophy}")
        if "[CONTENT NOT FOUND:" not in content:
            ref_file_path = references_dir / mentor_philosophy
            ref_file_path.parent.mkdir(parents=True, exist_ok=True)
            with open(ref_file_path, 'w') as f:
                f.write(content)
            exported_files.append(f"references/{mentor_philosophy}")
        
        # Export visual design philosophy
        visual_design = 'visual-design-philosophy.md'
        content = self.load_referenced_content(f"content/{visual_design}")
        if "[CONTENT NOT FOUND:" not in content:
            ref_file_path = references_dir / visual_design
            with open(ref_file_path, 'w') as f:
                f.write(content)
            exported_files.append(f"references/{visual_design}")
        
        # Export key narrative YAML files as readable references
        narrative_systems = ['pico-character', 'amara-narrative', 'constellation-phenomenon', 'journal-system']
        for system_name in narrative_systems:
            content = self.load_referenced_content(f"data/constants/{system_name}.yaml")
            if "[CONTENT NOT FOUND:" not in content:
                ref_file = references_dir / f"{system_name}.md"
                with open(ref_file, 'w') as f:
                    f.write(f"# {system_name.replace('-', ' ').title()}\n\n")
                    f.write(f"**Source**: `data/constants/{system_name}.yaml`\n\n")
                    f.write("```yaml\n")
                    f.write(content)
                    f.write("\n```\n")
                exported_files.append(f"references/{system_name}.md")
        
        return exported_files

    def create_self_contained_narrative_context(self, narrative_context, include_archives):
        """Create narrative context with embedded content instead of file references"""
        
        # Get all the data we need
        all_constants = narrative_context.get('constants_data', {})
        all_content = narrative_context.get('content_data', {})
        
        # Create embedded systems data with rich YAML content
        embedded_related_systems = {}
        
        # Add key narrative systems with their rich data
        narrative_systems = [
            'constellation-phenomenon', 'journal-system', 'visual-design', 
            'activity-framework', 'amara-narrative', 'pico-character',
            'etching-system', 'journal-integration', 'visual-time-system',
            'complete-card-system', 'educational-framework', 'game-constants'
        ]
        
        # Include constants data (YAML files with rich system specifications)
        for system_name, system_data in all_constants.items():
            if any(narrative_sys in system_name for narrative_sys in narrative_systems):
                # Extract the actual YAML content for template use
                if isinstance(system_data, dict):
                    # Convert YAML data to readable string format for templates
                    import yaml
                    yaml_content = yaml.dump(system_data, default_flow_style=False, sort_keys=False)
                    embedded_related_systems[system_name] = {
                        'file_path': f'data/constants/{system_name}.yaml',
                        'content': yaml_content,
                        'system_info': system_data.get('system_info', {}),
                        'rich_data': system_data  # Keep structured data for template logic
                    }
        
        # Include content data (markdown files with rich narrative content)
        for content_file, content in all_content.items():
            content_name = content_file.replace('content/', '').replace('.md', '').replace('/', '-')
            if any(narrative_sys in content_name for narrative_sys in narrative_systems):
                embedded_related_systems[content_name] = {
                    'file_path': content_file,
                    'content': content,
                    'type': 'content'
                }
        
        # Include cards data from cards directory
        all_cards = narrative_context.get('cards_data', {})
        for system_name, system_data in all_cards.items():
            if any(narrative_sys in system_name for narrative_sys in narrative_systems):
                if isinstance(system_data, dict):
                    import yaml
                    yaml_content = yaml.dump(system_data, default_flow_style=False, sort_keys=False)
                    embedded_related_systems[system_name] = {
                        'file_path': f'data/cards/{system_name}.yaml',
                        'content': yaml_content,
                        'system_info': system_data.get('system_info', {}),
                        'rich_data': system_data  # Keep structured data for template logic
                    }
        
        # Create enhanced context with rich embedded data
        context = {
            **narrative_context,
            'embedded_related_systems': embedded_related_systems,
            'repository_info': {
                'source_repository': 'rogue-resident-docs',
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'references_exported': False
            }
        }
        
        if include_archives:
            # Add archive content if available
            context['embedded_content_files'] = all_content
            
        return context

    def _copy_narrative_files_to_destination(self, generated_files, copy_to, focus_area):
        """Copy narrative workflow files to the specified destination directory"""
        import shutil
        
        try:
            destination_path = Path(copy_to)
            destination_path.mkdir(parents=True, exist_ok=True)
            
            focus_label = f" ({focus_area.title()})" if focus_area and focus_area != 'all' else ""
            print(f"\n📂 Copying narrative workflow files{focus_label} to {destination_path}...")
            
            for file_path in generated_files:
                if file_path.exists():
                    dest_file = destination_path / file_path.name
                    shutil.copy2(file_path, dest_file)
                    print(f"✅ Copied {file_path.name} → {dest_file}")
            
            # Copy references directory if it exists
            references_dir = self.export_path / "references"
            if references_dir.exists():
                dest_references = destination_path / "references"
                if dest_references.exists():
                    shutil.rmtree(dest_references)
                shutil.copytree(references_dir, dest_references)
                print(f"✅ Copied references/ directory → {dest_references}")
            
            # Create narrative-specific README
            focus_suffix = f"-{focus_area}" if focus_area and focus_area != 'all' else ""
            readme_content = f"""# Rogue Resident Narrative Workflow{focus_label}

Generated by Rogue Resident Narrative Documentation System

## Files

- **narrative{focus_suffix}-context.md**: Complete narrative guide (Writers & Narrative Designers)
- **lore{focus_suffix}-implementation.md**: Technical implementation guide (Developers)  
- **story{focus_suffix}-continuity.md**: Story bible and consistency reference (AI Assistants)

## Usage

These files provide focused narrative documentation for different audiences:

1. **Narrative Context**: Character development, world building, story integration
2. **Lore Implementation**: Technical systems for implementing narrative elements
3. **Story Continuity**: Complete story bible for maintaining narrative consistency

## Focus Area{': ' + focus_area.title() if focus_area and focus_area != 'all' else ''}

{f'This documentation focuses specifically on {focus_area} elements of the narrative system.' if focus_area and focus_area != 'all' else 'This documentation covers all narrative systems comprehensively.'}

Generated on: {self._get_timestamp()}
Source: Rogue Resident documentation system
"""
            
            readme_file = destination_path / "README.md"
            with open(readme_file, 'w') as f:
                f.write(readme_content)
            print(f"✅ Created README.md → {readme_file}")
            
            print(f"🎉 Successfully copied all narrative files to {destination_path}")
            
        except Exception as e:
            print(f"❌ Error copying narrative files to {copy_to}: {e}")

def main():
    parser = argparse.ArgumentParser(description='Export Rogue Resident documentation')
    parser.add_argument('--format', choices=['nextjs', 'claude', 'visual', 'workflow', 'narrative', 'all'], 
                       default='all', help='Export format')
    parser.add_argument('--system', 
                       help='System name for workflow export (e.g., activity-interface)')
    parser.add_argument('--focus-area', choices=['character', 'world', 'plot', 'all'],
                       help='Focus area for narrative workflow (character, world, plot, or all)')
    parser.add_argument('--base-path', default='.', 
                       help='Base path for the project')
    parser.add_argument('--include-archives', action='store_true',
                       help='Include all design docs, character content, and game constants in LLM context')
    parser.add_argument('--export-references', action='store_true',
                       help='Export referenced files to references/ directory instead of embedding inline')
    parser.add_argument('--copy-to', 
                       help='Copy generated files to specified directory (e.g., ../rogue-resident/docs/)')
    
    args = parser.parse_args()
    
    exporter = DocumentationExporter(args.base_path)
    
    if args.format in ['nextjs', 'all']:
        exporter.export_for_nextjs()
    
    if args.format in ['claude', 'all']:
        exporter.export_claude_context()
    
    if args.format in ['visual', 'all']:
        exporter.export_visual_relationship_maps()
    
    if args.format == 'workflow':
        exporter.export_three_audience_workflow(args.system, args.include_archives, args.copy_to, args.export_references)
    
    if args.format == 'narrative':
        exporter.export_narrative_workflow(args.focus_area, args.include_archives, args.copy_to, args.export_references)

if __name__ == "__main__":
    main() 