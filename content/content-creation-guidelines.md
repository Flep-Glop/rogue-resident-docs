# Content Creation Guidelines

This document provides comprehensive guidelines for creating educational content, activities, and boss encounters for Rogue Resident. These guidelines ensure consistency, educational effectiveness, and seamless integration with the game's systems.

## Question Writing Principles

### Core Principles
- **Clarity**: Questions should be concise and unambiguous
- **Educational Value**: Each question should reinforce a specific concept
- **Difficulty Progression**: Clear distinction between beginner, intermediate, and advanced
- **Mentor Voice**: Question text should reflect the personality of the assigned mentor
- **Knowledge Connection**: Questions should connect to specific constellation nodes

### Question Structure Standards

**Question Text**:
- Use clear, professional language appropriate to the mentor's voice
- Provide sufficient context without overwhelming detail
- Include relevant clinical or technical scenarios
- Avoid ambiguous phrasing or trick questions

**Answer Options**:
- Provide 3-5 options for multiple choice questions
- Ensure one clearly correct answer (or multiple correct for multi-select)
- Make incorrect options plausible but distinctly wrong
- Maintain parallel grammatical structure

**Educational Feedback**:
- Explain why the correct answer is right
- Address common misconceptions in incorrect answer feedback
- Connect concepts to broader principles when relevant
- Provide references to related constellation stars

## Writing Effective Distractors (Wrong Answers)

### Distractor Design Strategy
- **Use common misconceptions** as the basis for distractors
- **Ensure plausibility** - distractors should seem reasonable to students with incomplete understanding
- **Avoid obvious patterns** that could give away the answer
- **Maintain consistent length** and style with correct options
- **Use parallel structure** for all options

### Examples of Good Distractors
- **Conceptual misconceptions**: "Dose rate increases linearly with beam energy" (when relationship is more complex)
- **Unit confusion**: "100 cGy" when answer should be "1 Gy"
- **Procedural errors**: Steps in wrong order or missing critical components
- **Application mistakes**: Correct concept applied to wrong scenario

### Distractors to Avoid
- Obviously absurd options that no student would select
- Options that are too similar to distinguish
- Answers that contain absolute terms (always, never) unless contextually appropriate
- Distractors that accidentally teach incorrect information

## Educational Feedback Design

### Correct Answer Feedback Structure
1. **Confirmation**: Brief acknowledgment of correct response
2. **Explanation**: Why this answer is correct
3. **Context**: How this connects to broader concepts
4. **Application**: When/where this knowledge is used
5. **Connection**: Links to related constellation stars

**Example**:
> "Correct! The beam quality correction factor kQ accounts for the difference between the calibration beam quality and the user's beam quality. This ensures accurate dose measurements across different photon energies. This principle is fundamental to TG-51 calibration protocols and connects directly to your understanding of photon beam interactions."

### Incorrect Answer Feedback Structure
1. **Gentle correction**: Acknowledge the attempt without discouragement
2. **Misconception address**: Explain why this option is incorrect
3. **Guided learning**: Point toward correct understanding
4. **Positive reinforcement**: Encourage continued learning

**Example**:
> "Not quite. While detector response does vary with beam energy, the beam quality correction factor specifically accounts for this variation to ensure consistent dose measurements. Consider how different photon energies interact differently with detector materials. Review the photon beam interactions star for more details."

## Mentor Voice Integration

Each mentor has distinct characteristics that should be reflected in question presentation:

### Dr. Kapoor (Dosimetry)
- **Tone**: Precise, methodical, exacting
- **Language**: Technical precision, emphasis on accuracy
- **Approach**: Step-by-step explanations, protocol adherence
- **Example**: "Let us examine this calculation with precision. Each step must be exact..."

### Dr. Garcia (Radiation Therapy)
- **Tone**: Warm, patient-centered, encouraging
- **Language**: Clinical context, patient outcomes focus
- **Approach**: Practical applications, real-world scenarios
- **Example**: "Consider how this affects our patient's treatment. The physics here directly impacts their care..."

### Technician Jesse (Linac Anatomy)
- **Tone**: Practical, hands-on, troubleshooting-focused
- **Language**: Equipment-focused, real-world operation
- **Approach**: Problem-solving, technical clarity
- **Example**: "Here's what's actually happening in the machine. When you see this error message..."

### Dr. Quinn (Treatment Planning)
- **Tone**: Conceptual, enthusiastic about connections
- **Language**: Theoretical frameworks, cross-domain links
- **Approach**: Big-picture thinking, optimization focus
- **Example**: "The fascinating thing about this optimization is how it connects radiation biology with physics..."

## Activity Design Guidelines

### Educational Flow Structure
1. **Introduction**: Clear learning objectives and context
2. **Foundation**: Basic concepts and definitions
3. **Application**: Practical scenarios and examples
4. **Integration**: Connections to other concepts
5. **Assessment**: Evaluation of understanding
6. **Reflection**: Consolidation and next steps

### Time Management Principles
- **Challenge Quantity Balance**: Match challenge count to available time (see `activity-framework.yaml`)
- **Progression Pacing**: Allow adequate time for concept absorption
- **Variety Maintenance**: Mix different challenge types within activities
- **Break Points**: Natural stopping points for reflection

### Context and Narrative Integration
- **Setting Establishment**: Clear physical and professional context
- **Character Presence**: Appropriate mentor involvement
- **Realistic Scenarios**: Authentic professional situations
- **Meaningful Stakes**: Connect activities to professional competence

### Reward Balance Considerations
- **Effort-Reward Alignment**: Ensure rewards match time and difficulty investment
- **Progress Recognition**: Acknowledge incremental improvements
- **Motivation Maintenance**: Balance challenge with achievability
- **System Integration**: Connect rewards to broader game progression

## Boss Design Guidelines

### Educational Purpose Clarity
Each boss encounter must have clear educational objectives:
- **Domain Focus**: Specific knowledge areas being tested
- **Integration Level**: Degree of cross-domain synthesis required
- **Skill Demonstration**: Professional competencies being evaluated
- **Mastery Assessment**: Methods for measuring understanding

### Narrative Integration Principles
- **Character Development**: Boss encounters should advance character arcs
- **Thematic Consistency**: Maintain coherent narrative themes
- **Emotional Resonance**: Create meaningful emotional stakes
- **Professional Relevance**: Connect to real-world professional challenges

### Balanced Difficulty Design
- **Progressive Challenge**: Escalating difficulty across phases
- **Multiple Success Paths**: Various approaches to victory
- **Recovery Opportunities**: Chances to overcome early mistakes
- **Build Viability**: Ensure all character builds have valid strategies

### Strategic Depth Requirements
- **Preparation Value**: Make preparation activities genuinely helpful
- **Knowledge Application**: Require actual understanding, not memorization
- **Adaptive Responses**: Encounters should respond to player choices
- **Meaningful Decisions**: Provide consequential strategic options

## Quality Assurance Standards

### Content Validation Checklist
- [ ] Educational objectives clearly defined
- [ ] Mentor voice consistency maintained
- [ ] Difficulty level appropriate for target audience
- [ ] Cross-references to constellation stars accurate
- [ ] Feedback constructive and encouraging
- [ ] Technical accuracy verified by subject matter experts
- [ ] Playtesting completed with target audience
- [ ] Integration with game systems tested

### Common Content Issues
- **Ambiguous Questions**: Multiple valid interpretations
- **Inconsistent Difficulty**: Questions that don't match their assigned level
- **Poor Feedback**: Explanations that don't aid understanding
- **Voice Inconsistency**: Mentor personality not reflected
- **Technical Errors**: Factual mistakes or outdated information
- **Integration Failures**: Content that doesn't connect to game systems

### Review Process Standards
1. **Technical Review**: Subject matter expert verification
2. **Educational Review**: Learning effectiveness assessment
3. **Voice Review**: Mentor personality consistency check
4. **Integration Review**: Game system compatibility verification
5. **Playtesting**: Student feedback and usability testing
6. **Final Polish**: Language clarity and presentation refinement

## Implementation Workflow

### Content Creation Process
1. **Specification**: Define learning objectives and scope
2. **Research**: Gather technical information and references
3. **Drafting**: Create initial content following guidelines
4. **Review**: Technical and educational validation
5. **Testing**: Playtesting with target audience
6. **Revision**: Incorporate feedback and improvements
7. **Integration**: Connect to game systems and constellation
8. **Final Review**: Quality assurance and approval

### Collaboration Standards
- **Version Control**: Clear tracking of content revisions
- **Feedback Integration**: Systematic incorporation of reviewer input
- **Documentation**: Comprehensive notes on design decisions
- **Communication**: Regular updates on progress and challenges

## Tools and Resources

### Reference Materials
- Technical standards and protocols
- Mentor personality profiles
- Constellation star definitions
- Educational framework specifications
- Game system integration guides

### Quality Assurance Tools
- Content review checklists
- Technical accuracy validators
- Educational effectiveness assessments
- Integration testing protocols
- Student feedback collection systems

This comprehensive framework ensures all content creation maintains high educational standards while seamlessly integrating with Rogue Resident's game systems and narrative framework. 