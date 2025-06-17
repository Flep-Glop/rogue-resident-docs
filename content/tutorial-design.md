# Tutorial Flow Design & Implementation Guide

## Overview

The tutorial system introduces players to the complex medical physics concepts and gameplay mechanics through carefully crafted narrative sequences. This design leverages the existing hospital backdrop and dialogue systems to create seamless onboarding.

## Design Philosophy

### Narrative-Driven Learning
- **Mechanics Through Story**: All game systems introduced through mentor interactions
- **Progressive Complexity**: Single concept focus per interaction to avoid overwhelm
- **Natural Transitions**: Character-driven scene changes between day/night phases
- **Contextual Learning**: Educational content framed within meaningful hospital scenarios

### Integration with Existing Systems
- **Hospital Backdrop**: ✅ Implemented - Tutorial overlays on existing scenes
- **Dialogue System**: ✅ Implemented - Tutorial extends current dialogue mechanics
- **Scene Management**: ✅ Implemented - Tutorial uses existing transition system
- **Mentor Characters**: ✅ Implemented - Tutorial leverages existing mentor data

## First Day Tutorial Sequence

### Morning Arrival (08:00 - Hospital Entrance)
**Objective**: Establish setting and introduce first mentor

**Mentor**: Dr. Garcia (Lead Radiation Oncologist)
**Implementation**: Extend existing dialogue system with tutorial overlays

**Key Interactions**:
1. **Welcome Dialogue**
   - Introduces hospital setting
   - Establishes mentor personality
   - Provides initial player agency through dialogue choices

2. **Exploration Choice**
   - Tour vs. self-exploration options
   - Branches to different tutorial paths
   - Demonstrates player agency in learning approach

### First Educational Activity (10:30 - Orientation Room)
**Objective**: Introduce insight mechanic and progress feedback

**Implementation Requirements**:
- Tutorial overlay showing insight meter
- Progress tracking visual feedback
- Integration with existing question system

**Sample Question Flow**:
```
Question: "What's the primary purpose of a multileaf collimator?"
- Correct Answer → +15 Insight + Explanation + Visual feedback
- Tutorial Popup: "You gained Insight! This represents your growing understanding."
```

### Lunch Dialogue (12:15 - Hospital Cafeteria) 
**Objective**: Introduce second mentor and foreshadow night phase

**Mentor**: Dr. Quinn (Treatment Planning)
**Key Feature**: Constellation system preview without overwhelming detail

### Ability Introduction (14:30 - Treatment Planning Lab)
**Objective**: Introduce ability card system and day-night connection

**Implementation**: 
- Physical card handover animation
- Journal system preview
- Clear explanation of night phase usage

### Night Phase Transition (17:15 - Hospital Exit)
**Objective**: Smooth transition to night phase tutorial

**Mentor**: Dr. Kapoor (Dosimetry)
**Implementation**: Transition animation to Hill House observatory

## Night Phase Tutorial Sequence

### Observatory Introduction (19:30 - Hill House Observatory)
**Objective**: Introduce knowledge constellation system

**Implementation Requirements**:
- Phone call UI with mentor portrait
- Constellation interface tutorial overlays
- Star selection mechanics tutorial
- SP (Star Points) system explanation

**Guided Interactions**:
1. Phone call from Dr. Quinn explaining constellation
2. Interactive tutorial for star selection
3. SP spending mechanics demonstration
4. First star unlock celebration

### Journal System Tutorial (20:15 - Hill House Study)
**Objective**: Introduce ability management system

**Implementation Requirements**:
- Text message UI from mentors
- Journal interface tutorial
- Drag-and-drop card placement tutorial
- Equipped abilities preview for tomorrow

**Key Features**:
- Visual card placement tutorial
- Ability slot limitation explanation (3 max)
- Preview of tomorrow's enhanced capabilities

### Sleep Transition (21:30 - Hill House Bedroom)
**Objective**: Complete tutorial cycle and prepare for main game

**Implementation**:
- Reflection summary of day's learning
- Progress visualization (stars unlocked, abilities equipped)
- Smooth transition to Day 2 with enhanced systems

## Technical Implementation Specifications

### Tutorial Overlay System
**Status**: Ready to implement (hospital backdrop + dialogue systems operational)

**Requirements**:
- Overlay components for contextual help
- Progress indicators for tutorial completion
- Interactive hotspots for guided interactions
- Skip/replay options for experienced players

### Integration Points
**Existing Systems Integration**:
- Hospital scene renderer → Add tutorial overlay layer
- Dialogue system → Extend with tutorial-specific flows
- Mentor data → Add tutorial-specific dialogue content
- Activity framework → Add tutorial questions and feedback

### Asset Pipeline Integration
**Priority Assets**:
1. Tutorial overlay UI elements (Week 1)
2. Progress indicator graphics (Week 1) 
3. Phone call interface for mentor guidance (Week 2)
4. Constellation tutorial overlays (Week 3)

## Implementation Strategy

### Phase 1: Core Tutorial Infrastructure
- Tutorial overlay system on existing hospital backdrop
- Progress tracking and visual feedback
- Integration with existing dialogue system

### Phase 2: Mentor-Guided Learning
- Enhanced mentor dialogue with tutorial content
- Phone call system for night phase guidance
- Text message system for asynchronous mentor tips

### Phase 3: System Introductions
- Constellation interface tutorial overlays
- Journal system guided interactions
- Ability card management tutorial

### Phase 4: Polish and Accessibility
- Skip options for returning players
- Tutorial replay functionality
- Accessibility features for guided interactions

## Success Metrics

### Learning Objectives
- Players understand core mechanics within 30 minutes
- 95% tutorial completion rate
- Smooth transition to main game loop

### Technical Objectives
- Zero blocking bugs in tutorial progression
- Consistent mentor personality between tutorial and main game
- Tutorial state properly saves/loads

### User Experience Objectives
- Tutorial feels integrated, not separate from main game
- Players feel confident to engage with all systems
- Mentors established as helpful guides, not just exposition

## Content Integration Notes

**Existing Content Leverage**:
- Mentor personalities from `data/mentors/mentors.yaml`
- Hospital locations from implemented scene system
- Educational content from activity framework
- Narrative context from character arc files

**New Content Requirements**:
- Tutorial-specific dialogue variants
- Guided interaction prompts
- Progress celebration moments
- Contextual help text for complex systems

This design ensures the tutorial system builds on existing, working implementations rather than creating parallel systems, addressing the core concern raised in the feedback. 