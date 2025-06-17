# Core Systems Design Philosophy

**Document Version:** 3.0  
**Purpose:** Narrative context for core game systems  
**Technical Reference:** `data/constants/game-constants.yaml`, `data/stars/stars-definitions.yaml`

> This document explains the **why** behind the systems - for the **what** and **how**, see the technical YAML specifications.

## Resource Systems as Professional Development

### Star Points: The Economy of Expertise

The SP economy (300 available vs 450 needed) deliberately creates scarcity that mirrors real professional development. No one can master everything - professionals must choose where to focus their limited time and energy.

**Design Intent:** Force meaningful specialization choices while ensuring multiple viable paths to competence. The 33% gap means players must thoughtfully decide which expertise areas to prioritize, just like real medical physicists who develop particular strengths.

**Narrative Context:** Star Points represent the finite mental energy and time available for professional development during a residency year. The progression from 75 SP per season reflects increasing capacity as players develop better learning strategies.

### Insight: Daily Engagement and Flow

Insight resets daily and fluctuates based on engagement, representing the natural rhythm of professional energy and attention.

**Design Intent:** Create daily tactical decisions about when and how to apply expertise. High Insight enables powerful applications, but players must manage this resource carefully throughout the day.

**Narrative Context:** Insight captures the mental clarity and engagement that comes from being "in the zone" professionally. Some days you're sharp and can tackle complex problems; other days require more basic, foundational work.

### Momentum: The Flow State of Learning

Momentum builds through consecutive success and breaks on failure, representing the psychological state of focused learning.

**Design Intent:** Reward sustained focus and thoughtful problem-solving while creating risk/reward decisions about when to attempt challenging problems.

**Narrative Context:** Momentum represents the flow state that comes from engaging deeply with material. When you're understanding concepts well, each new insight builds on the last. When you hit a wall, you need to step back and rebuild understanding.

## Knowledge Constellation: Expertise as Connection

### Stars as Knowledge Nodes

Individual stars represent discrete areas of expertise, but the real power comes from understanding how they relate to each other.

**Design Intent:** Reflect the reality that medical physics expertise comes from integration, not memorization. Individual facts matter less than understanding how concepts inform each other.

**Narrative Context:** Each star is a place you can "stand" in the knowledge landscape. Mastery means not just knowing each location, but understanding the routes between them and why those paths exist.

### Connections as Understanding

The connection system requires both stars to be unlocked and minimum mastery levels because genuine understanding of relationships requires solid foundation knowledge.

**Design Intent:** Prevent superficial "dot-connecting" without deep understanding. Cross-domain connections are harder than same-domain because they require broader perspective.

**Narrative Context:** Professional expertise isn't just knowing facts in isolation - it's understanding how treatment planning informs radiation therapy, how equipment knowledge enables better dosimetry, how all domains connect to provide better patient care.

### Patterns as Professional Perspective

Etching patterns represent breakthrough moments when disconnected knowledge suddenly coheres into deeper understanding.

**Design Intent:** Provide major progression milestones that feel like genuine insights. These aren't just mechanical bonuses - they represent shifts in professional perspective.

**Narrative Context:** Every professional has moments where multiple concepts suddenly "click" together, revealing a deeper pattern. These insights often come through specific learning experiences (etchings) that help you see familiar knowledge in new ways.

## Applications: Knowledge in Practice

### Daily Selection as Professional Identity

Choosing three applications each day represents how professionals decide which aspects of their expertise to emphasize in their daily work.

**Design Intent:** Make knowledge feel practical and immediately relevant. Players aren't just accumulating abstract concepts - they're building a toolkit for professional practice.

**Narrative Context:** Real medical physicists have broad training but develop particular strengths and approaches. Your daily application choices reflect your developing professional identity and preferred problem-solving methods.

### Passive vs Active Effects

The distinction between passive and active effects mirrors how professional expertise works - some knowledge is always informing your work, while other knowledge you apply deliberately to specific challenges.

**Design Intent:** Create both ambient benefits (passive) and tactical decisions (active). Players feel the benefit of their expertise constantly, but also have moments of purposeful application.

**Narrative Context:** Your radiation therapy knowledge is always informing how you think about cases (passive), but when you need to solve a specific dosimetry problem, you deliberately apply your understanding of measurement principles (active).

## Boss Encounters: Professional Challenges

### Mastery-Based Availability

Boss encounters unlock based on competence rather than time because real professional challenges appear when you're ready to handle them, not on a schedule.

**Design Intent:** Ensure players face challenges they can meaningfully engage with. Unlock thresholds represent the minimum competence needed to even attempt these professional scenarios.

**Narrative Context:** In real practice, you don't face certain types of challenges until supervisors believe you're ready. Complex cases, leadership responsibilities, and high-stakes situations require demonstrated competence.

### Five-Phase Escalation

The consistent five-phase structure reflects how real professional challenges build in complexity and pressure.

**Design Intent:** Create a predictable framework that allows for different content while maintaining consistent emotional arc - initial confidence, growing challenge, crisis point, final push, resolution.

**Narrative Context:** Professional challenges often follow this pattern - they start manageable, reveal hidden complexity, reach a crisis point where everything seems overwhelming, require a final application of all your skills, then resolve into new understanding.

### Multiple Solution Paths

Different build approaches succeed because real professional competence takes many forms.

**Design Intent:** Validate different learning styles and professional strengths. Technical expertise, communication skills, and integrative thinking are all valuable professional approaches.

**Narrative Context:** Medical physics is a diverse field where different professionals bring different strengths. Some excel at equipment troubleshooting, others at protocol development, others at patient communication. All paths can lead to professional success.

## Mentor Relationships: Professional Guidance

### Four Distinct Approaches

The four mentors represent different valid approaches to medical physics practice, each emphasizing different aspects of professional development.

**Design Intent:** Show players that there are multiple ways to be excellent in this field. Relationship development is about finding mentors whose approaches resonate with your developing professional identity.

**Narrative Context:** Real mentorship relationships form around shared values and complementary strengths. Students naturally gravitate toward mentors whose approaches make sense to them, while benefiting from exposure to different perspectives.

### Relationship Progression Through Engagement

Mentor relationships develop through participation in activities and dialogue rather than mechanical optimization.

**Design Intent:** Reward authentic engagement over gaming the system. Relationships should feel earned through shared professional experiences.

**Narrative Context:** Real mentorship develops through working together on meaningful problems. Trust and respect grow from demonstrated competence and shared values, not from saying the right things.

## Progressive Control: Professional Development

### Increasing Agency with Competence

Player control increases as mastery develops because real professional development involves gaining increasing autonomy and responsibility.

**Design Intent:** Create a natural progression from guided learning to independent practice. Players earn increased freedom through demonstrated competence.

**Narrative Context:** Medical physics education moves from highly supervised student work to increasingly independent resident responsibilities to fully autonomous professional practice. Agency follows competence.

### Time Control as Professional Maturity

The ability to structure your own schedule is both a privilege and a responsibility of professional development.

**Design Intent:** Make increased control feel like earned trust rather than arbitrary game mechanics. Players appreciate freedom more when they've experienced guided structure first.

**Narrative Context:** Students follow rigid schedules because they need structure. Professionals manage their own time because they understand priorities and can be trusted with autonomy.

## System Integration Philosophy

### Everything Connects

All systems reference and reinforce each other because real professional development is holistic - knowledge, relationships, and practical skills all develop together.

**Design Intent:** Avoid the feeling of disconnected mini-games. Every system should feel like part of a coherent professional development experience.

**Narrative Context:** Professional growth isn't compartmentalized. Your knowledge development affects your relationship with mentors, which provides opportunities for new challenges, which develops your practical skills, which deepens your knowledge understanding.

### Choice Supports Identity

Every major choice in the game (which stars to unlock, which mentors to engage with, which applications to use) should feel like it's building toward a coherent professional identity.

**Design Intent:** Make players feel like they're not just optimizing numbers, but discovering who they want to be as a professional. Choices should feel personally meaningful.

**Narrative Context:** Professional development is ultimately about identity formation - what kind of medical physicist do you want to be? How do you want to contribute to patient care? What aspects of the field excite you most?

---

## Related Documentation

**Technical Specifications:**
- `data/constants/game-constants.yaml` - Detailed numerical implementation
- `data/stars/stars-definitions.yaml` - Complete constellation system
- `data/mentors/mentors.yaml` - Mentor relationship mechanics
- `data/bosses/boss-encounters.yaml` - Boss encounter specifications

**Design Context:**
- `content/master-gdd.md` - Overall game vision and philosophy
- `content/mentors/mentor-philosophies.md` - Mentor character development
- `content/constellation-design.md` - Knowledge visualization philosophy 