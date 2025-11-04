# Music-App AI Development Team

A comprehensive agent and skills system for Claude Code, designed specifically for the music-app project. This system provides specialized AI agents with domain expertise and reusable skills for efficient development.

## Overview

**8 Specialized Agents** + **19 Modular Skills** = Complete AI Development Team

This system enables Claude Code to act as a full web development team with specialized knowledge in:
- React + Material-UI frontend development
- Firebase backend (Auth + Firestore)
- Music domain (ABC notation, audio playback)
- Testing and quality assurance
- Performance optimization
- DevOps and deployment
- Code review and architecture

## Quick Start

### For Claude Code

When working on this project, Claude Code will automatically:
1. Load the agent system from `.claude/agents/`
2. Access skills as needed from `.claude/skills/`
3. Select the appropriate agent(s) based on task context
4. Apply relevant skills to solve problems

### For Developers

No configuration needed! The agents and skills are automatically available when using Claude Code with this project.

## Agent Team

### Core Development Agents

#### 1. Frontend Component Architect
**Role**: React components, MUI v6, responsive UI
**Triggers**: Component creation, UI updates, styling, accessibility
**Skills**: mui-patterns, react-hooks, routing, accessibility, dnd-patterns
**Use for**: Building new components, fixing UI bugs, styling issues

#### 2. Firebase Backend Engineer
**Role**: Authentication, Firestore, cloud services
**Triggers**: Auth issues, database queries, deployment, user management
**Skills**: firebase-auth, firestore-operations, firebase-deploy, error-handling
**Use for**: Firebase operations, auth flows, database queries

#### 3. Quality Assurance Engineer
**Role**: Testing, quality gates, test coverage
**Triggers**: Testing requests, bug reports, pre-deployment validation
**Skills**: react-testing, mock-patterns, test-organization, accessibility
**Use for**: Writing tests, fixing failing tests, test coverage

#### 4. Music Domain Expert
**Role**: ABC notation, audio playback, music metadata
**Triggers**: Music notation, ABC rendering, audio player, tune data
**Skills**: abc-notation, audio-playback, react-hooks
**Use for**: Music-specific features, ABC rendering, audio player

#### 5. Performance Engineer
**Role**: Bundle optimization, render performance, search optimization
**Triggers**: Performance issues, slow renders, large bundle
**Skills**: performance, react-hooks, search-optimization
**Use for**: Performance problems, optimization, bundle analysis

#### 6. DevOps Engineer
**Role**: Firebase deployment, CI/CD, environment config
**Triggers**: Deployment, build issues, environment variables
**Skills**: firebase-deploy, error-handling, performance
**Use for**: Deploying to Firebase, build problems, environment setup

### Cross-Cutting Agents

#### 7. Code Reviewer
**Role**: PR reviews, consistency, best practices
**Triggers**: Pull requests, code reviews, quality checks
**Skills**: code-review, accessibility, all skills (read-only)
**Use for**: Code reviews, quality audits, consistency checks

#### 8. Technical Architect
**Role**: System design, architecture, technical strategy
**Triggers**: Architecture questions, refactoring, new features
**Skills**: react-hooks, data-services, routing, all skills (context)
**Use for**: Architectural decisions, system design, refactoring planning

## Skills Library

### Frontend Skills
- **mui-patterns**: MUI v6 components, theming, dark mode, styling
- **react-hooks**: useState, useEffect, useContext, useMemo, useCallback
- **routing**: React Router v6, navigation, route parameters

### Backend Skills
- **firebase-auth**: Authentication flows, Google Sign-In, user sessions
- **firestore-operations**: CRUD, real-time listeners, queries, security
- **firebase-deploy**: Deployment, hosting config, environment management

### Data Skills
- **csv-processing**: PapaParse, data loading, validation
- **search-optimization**: Fuse.js configuration, debouncing, performance
- **data-services**: Service layer patterns, caching, initialization

### Music Skills
- **abc-notation**: abcjs rendering, ABC format, sheet music
- **audio-playback**: YouTube player integration, playback controls

### Testing Skills
- **react-testing**: React Testing Library patterns, component tests
- **mock-patterns**: Context mocking, Firebase mocking, service mocking
- **test-organization**: Test structure, naming, organization

### Quality Skills
- **code-review**: Review checklist, anti-patterns, feedback patterns
- **performance**: React.memo, useMemo, useCallback, lazy loading
- **accessibility**: WCAG compliance, ARIA, keyboard navigation

### Dev Skills
- **dnd-patterns**: DND Kit integration, sortable lists, reordering
- **error-handling**: Error boundaries, try-catch, user feedback

## Usage Examples

### Example 1: Creating a New Component

**User Request**: "Create a component to display a list of favorite tunes"

**Agent Activated**: Frontend Component Architect
**Skills Used**: mui-patterns, react-hooks

**Process**:
1. Agent analyzes existing components for patterns
2. Uses mui-patterns skill for Card, Grid, Typography
3. Uses react-hooks skill for useFavorites context integration
4. Creates responsive, theme-aware component
5. Ensures accessibility compliance

### Example 2: Adding Firebase Feature

**User Request**: "Allow users to save their tune version preferences"

**Agent Activated**: Firebase Backend Engineer
**Skills Used**: firestore-operations, error-handling

**Process**:
1. Agent designs Firestore collection structure
2. Uses firestore-operations skill for CRUD operations
3. Implements error handling with try-catch
4. Creates service layer functions
5. Tests with different user accounts

### Example 3: Performance Optimization

**User Request**: "The search is too slow with 500+ tunes"

**Agent Activated**: Performance Engineer
**Skills Used**: search-optimization, performance

**Process**:
1. Agent profiles search performance
2. Uses search-optimization skill for Fuse.js tuning
3. Implements debouncing (300ms)
4. Adds useMemo for filtered results
5. Measures improvement and validates

### Example 4: Writing Tests

**User Request**: "Add tests for the TuneSummaryCard component"

**Agent Activated**: Quality Assurance Engineer
**Skills Used**: react-testing, mock-patterns

**Process**:
1. Agent analyzes component behavior
2. Uses react-testing skill for test structure
3. Uses mock-patterns skill to mock contexts
4. Creates comprehensive test suite
5. Verifies coverage >80%

## How Agents Collaborate

### Multi-Agent Workflows

**Adding a New Feature (e.g., Playlists)**:
1. **Technical Architect**: Designs data model and component structure
2. **Frontend Component Architect**: Builds UI components
3. **Firebase Backend Engineer**: Implements Firestore operations
4. **Music Domain Expert**: Integrates tune data and playback
5. **Quality Assurance Engineer**: Writes comprehensive tests
6. **Code Reviewer**: Reviews implementation for quality
7. **Performance Engineer**: Optimizes if needed
8. **DevOps Engineer**: Deploys to production

**Fixing a Bug**:
1. **Code Reviewer**: Identifies issue and scope
2. **Appropriate Agent**: Implements fix (Frontend/Backend/etc.)
3. **Quality Assurance Engineer**: Adds regression test
4. **Code Reviewer**: Verifies fix quality

## Best Practices

### For Working with Agents

1. **Be Specific**: "Fix the search bar in NavBar.jsx" vs "Fix search"
2. **Provide Context**: Mention relevant files, error messages, desired behavior
3. **One Agent at a Time**: Let agents focus on their domain
4. **Review Output**: Agents provide suggestions, you make final decisions
5. **Iterate**: Agents can refine based on feedback

### For Extending the System

#### Adding a New Agent

1. Create directory: `.claude/agents/new-agent-name/`
2. Create `AGENT.md` with:
   - Role description
   - Activation triggers
   - Available skills
   - Collaboration patterns
   - Example scenarios
3. Document integration with existing agents

#### Adding a New Skill

1. Create directory: `.claude/skills/new-skill-name/`
2. Create `SKILL.md` with:
   - Purpose and scope
   - Code examples
   - Best practices
   - Anti-patterns
   - Common issues

## File Structure

```
.claude/
├── README.md                           # This file
├── agents/
│   ├── frontend-component-architect/
│   │   └── AGENT.md
│   ├── firebase-backend-engineer/
│   │   └── AGENT.md
│   ├── quality-assurance-engineer/
│   │   └── AGENT.md
│   ├── music-domain-expert/
│   │   └── AGENT.md
│   ├── performance-engineer/
│   │   └── AGENT.md
│   ├── devops-engineer/
│   │   └── AGENT.md
│   ├── code-reviewer/
│   │   └── AGENT.md
│   └── technical-architect/
│       └── AGENT.md
└── skills/
    ├── mui-patterns/
    │   └── SKILL.md
    ├── react-hooks/
    │   └── SKILL.md
    ├── firebase-auth/
    │   └── SKILL.md
    ├── firestore-operations/
    │   └── SKILL.md
    ├── react-testing/
    │   └── SKILL.md
    ├── abc-notation/
    │   └── SKILL.md
    ├── csv-processing/
    │   └── SKILL.md
    ├── search-optimization/
    │   └── SKILL.md
    ├── routing/
    │   └── SKILL.md
    ├── firebase-deploy/
    │   └── SKILL.md
    ├── data-services/
    │   └── SKILL.md
    ├── audio-playback/
    │   └── SKILL.md
    ├── mock-patterns/
    │   └── SKILL.md
    ├── test-organization/
    │   └── SKILL.md
    ├── code-review/
    │   └── SKILL.md
    ├── performance/
    │   └── SKILL.md
    ├── accessibility/
    │   └── SKILL.md
    ├── dnd-patterns/
    │   └── SKILL.md
    └── error-handling/
        └── SKILL.md
```

## Benefits

### Specialized Knowledge
- Each agent has deep expertise in their domain
- Skills provide consistent patterns and best practices
- Project-specific knowledge embedded in agents and skills

### Efficiency
- Faster development with specialized agents
- Reusable skills reduce repetition
- Consistent quality across codebase

### Scalability
- Easy to add new agents or skills
- Clear separation of concerns
- Modular, maintainable structure

### Quality
- Built-in code review and testing
- Performance optimization from the start
- Accessibility compliance by default

## Troubleshooting

### Agent Not Activating

**Problem**: Expected agent didn't handle the task
**Solutions**:
- Make request more specific
- Mention keywords from agent triggers
- Reference specific files or domains

### Skill Not Being Used

**Problem**: Agent didn't apply expected skill
**Solutions**:
- Skill may not be in agent's skill set
- Request may not need that particular skill
- Try more explicit request

### Conflicting Suggestions

**Problem**: Different agents suggest different approaches
**Solutions**:
- Consult Technical Architect agent
- Consider trade-offs of each approach
- Make informed decision based on context

## Resources

- **Project Documentation**: `/CLAUDE.md`
- **Agent Definitions**: `/.claude/agents/*/AGENT.md`
- **Skill Definitions**: `/.claude/skills/*/SKILL.md`
- **Anthropic Agent Skills Docs**: https://docs.claude.com/en/docs/agents-and-tools/agent-skills

## Contributing

To improve this agent system:

1. **Identify Gaps**: What tasks are not well-covered?
2. **Propose Agents/Skills**: What specializations would help?
3. **Document Patterns**: Add examples to skill definitions
4. **Refine Triggers**: Improve agent activation accuracy
5. **Share Feedback**: What works well? What could improve?

## Version History

- **v1.0** (Current): Initial agent team with 8 agents and 19 skills
  - Complete web development team
  - Music domain specialization
  - Firebase integration
  - Testing and quality assurance

## License

This agent system is part of the music-app project and follows the same license.

---

**Built with Claude Code** | **Powered by Anthropic's Agent Skills**
