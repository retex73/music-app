# Music-App AI Development Team

A comprehensive agent and skills system for Claude Code, designed specifically for the music-app project. This system provides specialized AI agents with domain expertise and reusable skills for efficient development.

## Overview

**9 Specialized Agents** + **23 Modular Skills** = Complete AI Development Team

This system enables Claude Code to act as a full web development team with specialized knowledge in:
- React + Material-UI frontend development
- Firebase backend (Auth + Firestore)
- Music domain (ABC notation, audio playback)
- Testing and quality assurance
- Performance optimization
- DevOps and deployment
- Code review and architecture
- **Trunk-based git workflow** (enforces continuous integration best practices)

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
**Role**: PR reviews, consistency, best practices, trunk-based PR validation
**Triggers**: Pull requests, code reviews, quality checks
**Skills**: code-review, rapid-pr-review, accessibility, trunk-based-git, all skills (read-only)
**Use for**: Code reviews, quality audits, consistency checks, trunk-based PR validation

#### 8. Technical Architect
**Role**: System design, architecture, technical strategy
**Triggers**: Architecture questions, refactoring, new features
**Skills**: react-hooks, data-services, routing, all skills (context)
**Use for**: Architectural decisions, system design, refactoring planning

#### 9. Git Workflow Manager
**Role**: Trunk-based development enforcement, git workflow guardian
**Triggers**: Branch operations, merges, commits, workflow violations
**Skills**: trunk-based-git, feature-flags, git-hygiene
**Use for**: Enforcing ≤3 branches, daily merges, workflow compliance, feature flag guidance

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
- **rapid-pr-review**: Fast PR reviews, small-batch protocols, trunk-based review (NEW!)

### Dev Skills
- **dnd-patterns**: DND Kit integration, sortable lists, reordering
- **error-handling**: Error boundaries, try-catch, user feedback

### Git & Workflow Skills (NEW!)
- **trunk-based-git**: Trunk-based development workflow, branch management, merge strategies
- **feature-flags**: Feature toggles for incomplete work, environment-based flags
- **git-hygiene**: Branch cleanup automation, commit quality, repository maintenance

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

### Example 5: Trunk-Based Workflow (NEW!)

**User Request**: "I want to start working on a playlist feature but won't finish today"

**Agents Activated**: Git Workflow Manager + Frontend Component Architect
**Skills Used**: trunk-based-git, feature-flags, mui-patterns

**Process**:
1. **Git Workflow Manager**: Checks branch count (currently 2/3 - OK to proceed)
2. **Git Workflow Manager**: Creates branch `feature/playlists`
3. **Frontend Component Architect**: Builds playlist UI components
4. **Git Workflow Manager**: At EOD, detects incomplete feature
5. **Git Workflow Manager**: Suggests wrapping in feature flag
6. **Git Workflow Manager**: Helps implement flag in `featureFlags.js`
7. **Frontend Component Architect**: Wraps components: `{FEATURE_FLAGS.PLAYLISTS && <PlaylistUI />}`
8. **Git Workflow Manager**: Verifies tests pass with flag disabled
9. **Git Workflow Manager**: Creates PR (87 lines, <24h old)
10. **Code Reviewer**: Fast-track review (< 30 min)
11. **Both approve**: Merge to main (flag disabled in production)
12. **Git Workflow Manager**: Auto-deletes branch
13. **Result**: Daily merge achieved, main stays green, work continues tomorrow!

## How Agents Collaborate

### Multi-Agent Workflows

**Adding a New Feature (e.g., Playlists) - Trunk-Based Workflow**:
1. **Git Workflow Manager**: Validates ≤3 branches, creates feature branch
2. **Technical Architect**: Designs data model and component structure
3. **Frontend Component Architect**: Builds UI components (Day 1 - partial)
4. **Git Workflow Manager**: Wraps in feature flag, merges to main (EOD)
5. **Firebase Backend Engineer**: Implements Firestore operations (Day 2)
6. **Git Workflow Manager**: Merges to main again (EOD)
7. **Music Domain Expert**: Integrates tune data and playback (Day 3)
8. **Quality Assurance Engineer**: Writes comprehensive tests
9. **Git Workflow Manager**: Final merge, enables feature flag
10. **Code Reviewer**: Reviews each daily PR (<2h each)
11. **Performance Engineer**: Optimizes if needed
12. **DevOps Engineer**: Deploys to production (main always ready!)

**Fixing a Bug - Trunk-Based**:
1. **Git Workflow Manager**: Creates hotfix branch
2. **Code Reviewer**: Identifies issue and scope
3. **Appropriate Agent**: Implements minimal fix (Frontend/Backend/etc.)
4. **Quality Assurance Engineer**: Adds regression test
5. **Git Workflow Manager**: Creates PR, fast-track review
6. **Code Reviewer**: Approves within 30 minutes
7. **Git Workflow Manager**: Merges and deletes branch
8. **Total time**: < 2 hours from bug to production fix

## Best Practices

### For Working with Agents

1. **Be Specific**: "Fix the search bar in NavBar.jsx" vs "Fix search"
2. **Provide Context**: Mention relevant files, error messages, desired behavior
3. **One Agent at a Time**: Let agents focus on their domain
4. **Review Output**: Agents provide suggestions, you make final decisions
5. **Iterate**: Agents can refine based on feedback

### For Trunk-Based Development (NEW!)

**Core Rules** (enforced by Git Workflow Manager):
1. **≤3 active branches** at any time
2. **Merge to main daily** (at least once per day)
3. **Small PRs** (< 200 lines for fast review)
4. **Delete branches immediately** after merge
5. **Use feature flags** for incomplete work
6. **Main always green** (all tests pass)
7. **Fast reviews** (< 2 hour target)

**Daily Workflow**:
```
Morning:
1. Check branch count (Git Workflow Manager)
2. Create/resume feature branch
3. Make small commits throughout day

Evening:
4. If feature incomplete → wrap in feature flag
5. Create PR (< 200 lines)
6. Get fast review (< 2 hours)
7. Merge to main
8. Delete branch
9. Repeat tomorrow!
```

**Benefits**:
- ✅ Continuous integration (merge daily)
- ✅ Fast feedback (reviews < 2h)
- ✅ Low risk (small changes)
- ✅ Always deployable (main stays green)
- ✅ No merge hell (daily integration)
- ✅ Simple git history (linear)

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
│   ├── technical-architect/
│   │   └── AGENT.md
│   └── git-workflow-manager/
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
    ├── error-handling/
    │   └── SKILL.md
    ├── trunk-based-git/
    │   └── SKILL.md
    ├── feature-flags/
    │   └── SKILL.md
    ├── git-hygiene/
    │   └── SKILL.md
    └── rapid-pr-review/
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

### Trunk-Based Development (NEW!)
- **Continuous Integration**: Daily merges eliminate integration nightmares
- **Fast Feedback**: < 2 hour PR reviews accelerate development
- **Low Risk**: Small, frequent changes reduce deployment risk
- **Always Deployable**: Main branch ready for production at all times
- **Simplified Workflow**: Linear git history, no complex branching strategies
- **Team Velocity**: No blocking on long-lived feature branches
- **Feature Flags**: Ship incomplete work safely

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

- **v1.1** (Current): Trunk-based development integration
  - **New Agent**: Git Workflow Manager (enforces trunk-based practices)
  - **Enhanced Agent**: Code Reviewer (trunk-based PR validation)
  - **New Skills**: trunk-based-git, feature-flags, git-hygiene, rapid-pr-review
  - Enforces ≤3 active branches, daily merges, small PRs (<200 lines)
  - Feature flag support for incomplete work
  - Fast PR reviews (<2 hour target)
  - Total: 9 agents + 23 skills

- **v1.0**: Initial agent team with 8 agents and 19 skills
  - Complete web development team
  - Music domain specialization
  - Firebase integration
  - Testing and quality assurance

## License

This agent system is part of the music-app project and follows the same license.

---

**Built with Claude Code** | **Powered by Anthropic's Agent Skills**
