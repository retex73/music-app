# SuperClaude Subagents Reference Guide

Complete reference for all specialized subagents available in the SuperClaude framework.

## Overview

SuperClaude provides 19 specialized subagents accessed via the Task tool. Each agent has unique capabilities, MCP server preferences, and optimal use cases.

---

## Quick Reference Matrix

| Agent | Primary Focus | MCP Servers | Auto-Activation Keywords |
|-------|--------------|-------------|-------------------------|
| general-purpose | Multi-step tasks, complex operations | All (*) | general, complex, multi-step |
| Explore | Codebase exploration, pattern finding | All | explore, find, search, understand |
| Plan | Task planning, strategy development | All | plan, design, strategy |
| technical-writer | Documentation creation | Read, Write, Edit, Bash | document, write, guide, README |
| backend-architect | Server-side systems, APIs | Read, Write, Edit, MultiEdit, Bash, Grep | API, backend, server, database |
| requirements-analyst | Requirements discovery | Read, Write, Edit, TodoWrite, Grep, Bash | requirements, PRD, specification |
| performance-engineer | Performance optimization | Read, Grep, Glob, Bash, Write | optimize, performance, bottleneck |
| socratic-mentor | Educational guidance | Read, Write, Grep, Bash | learn, teach, explain, understand |
| root-cause-analyst | Problem investigation | Read, Grep, Glob, Bash, Write | debug, investigate, root cause |
| quality-engineer | Testing and quality assurance | Read, Write, Bash, Grep | test, quality, validation, QA |
| github-actions-monitor | CI/CD workflow monitoring | Bash, Read, Grep, Write | github actions, workflow, CI, pipeline |
| frontend-architect | UI/UX development | Read, Write, Edit, MultiEdit, Bash | UI, component, frontend, React |
| security-engineer | Security analysis | Read, Grep, Glob, Bash, Write | security, vulnerability, audit |
| learning-guide | Teaching programming concepts | Read, Write, Grep, Bash | learn, tutorial, beginner |
| devops-architect | Infrastructure automation | Read, Write, Edit, Bash | deploy, infrastructure, DevOps |
| refactoring-expert | Code quality improvement | Read, Edit, MultiEdit, Grep, Write, Bash | refactor, cleanup, improve |
| system-architect | System design | Read, Grep, Glob, Write, Bash | architecture, design, system |
| python-expert | Python development | Read, Write, Edit, MultiEdit, Bash, Grep | python, .py |
| statusline-setup | Status line configuration | Read, Edit | statusline, config |

---

## Specialized Agents (Detailed)

### 1. general-purpose
**Purpose**: General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks

**Available Tools**: All tools (*)

**Best For**:
- Complex multi-step operations
- Tasks requiring diverse tool usage
- Situations where no specialized agent fits
- Exploratory tasks with unclear scope

**When to Use**:
- Default choice for complex, undefined tasks
- Multi-domain operations
- Tasks requiring maximum flexibility

**Example Use Cases**:
```
"Research and implement a complex feature across frontend and backend"
"Investigate and fix a multi-layer bug across services"
"Set up a complete development environment"
```

---

### 2. Explore
**Purpose**: Fast agent specialized for exploring codebases, finding files by patterns, searching code for keywords

**Available Tools**: All tools

**Thoroughness Levels**:
- `quick`: Basic searches, single-pass exploration
- `medium`: Moderate exploration, multiple search strategies
- `very thorough`: Comprehensive analysis across multiple locations

**Best For**:
- Finding files by patterns (e.g., "src/components/**/*.tsx")
- Searching code for keywords (e.g., "API endpoints")
- Understanding codebase structure
- Locating specific implementations

**When to Use**:
- Initial codebase exploration
- Finding specific files or patterns
- Understanding project organization
- When you need context but don't know exact locations

**Example Use Cases**:
```
"Find all React components using hooks"
"Where is error handling implemented?"
"Show me the project structure"
"Find all files related to authentication"
```

---

### 3. Plan
**Purpose**: Fast agent specialized for planning tasks, breaking down complex operations, and creating execution strategies

**Available Tools**: All tools

**Thoroughness Levels**: Same as Explore agent

**Best For**:
- Task decomposition
- Strategy development
- Implementation planning
- Workflow design

**When to Use**:
- Before starting complex implementations
- When scope is unclear
- Need structured approach to multi-step tasks
- Creating execution roadmaps

**Example Use Cases**:
```
"Plan the implementation of a new feature"
"Create a strategy for refactoring this module"
"Break down this epic into implementable tasks"
```

---

### 4. technical-writer
**Purpose**: Create clear, comprehensive technical documentation tailored to specific audiences

**Available Tools**: Read, Write, Edit, Bash

**Focus Areas**:
- Usability and accessibility
- Audience-appropriate language
- Clear structure and organization
- Code examples and tutorials

**Best For**:
- API documentation
- User guides and tutorials
- README files
- Architecture documentation
- Code comments and inline docs

**When to Use**:
- Creating new documentation
- Improving existing docs
- Generating API references
- Writing technical guides

**Example Use Cases**:
```
"Write API documentation for the authentication endpoints"
"Create a user guide for the deployment process"
"Generate README for this component library"
"Document the database schema with examples"
```

---

### 5. backend-architect
**Purpose**: Design reliable backend systems with focus on data integrity, security, and fault tolerance

**Available Tools**: Read, Write, Edit, MultiEdit, Bash, Grep

**Priority Hierarchy**: Reliability > Security > Performance > Features

**Core Principles**:
- Systems must be fault-tolerant and recoverable
- Security by default with defense in depth
- Data integrity and consistency

**Best For**:
- API design and implementation
- Database architecture
- Service layer design
- Backend system reliability

**When to Use**:
- Designing or implementing APIs
- Database schema design
- Server-side architecture decisions
- Reliability and fault tolerance needs

**Example Use Cases**:
```
"Design a RESTful API for e-commerce"
"Implement robust error handling for the service layer"
"Create database migration strategy"
"Design authentication and authorization system"
```

---

### 6. requirements-analyst
**Purpose**: Transform ambiguous project ideas into concrete specifications through systematic requirements discovery

**Available Tools**: Read, Write, Edit, TodoWrite, Grep, Bash

**Methodology**:
- Socratic questioning
- Stakeholder analysis
- User story mapping
- Acceptance criteria definition
- Prioritization (MoSCoW method)

**Best For**:
- Vague project requests
- PRD creation
- Requirements elicitation
- Scope definition

**When to Use**:
- Project inception phase
- When requirements are unclear
- Need structured discovery process
- Creating formal specifications

**Example Use Cases**:
```
"I want to build a project management tool" → Guided discovery
"Define requirements for the new feature"
"Create a PRD from this rough idea"
"Help me understand what stakeholders need"
```

---

### 7. performance-engineer
**Purpose**: Optimize system performance through measurement-driven analysis and bottleneck elimination

**Available Tools**: Read, Grep, Glob, Bash, Write

**Priority Hierarchy**: Measure first > Optimize critical path > User experience > Avoid premature optimization

**Performance Budgets**:
- Load Time: <3s on 3G, <1s on WiFi
- Bundle Size: <500KB initial, <2MB total
- Memory: <100MB mobile, <500MB desktop
- CPU: <30% average, <80% peak

**Best For**:
- Performance profiling
- Bottleneck identification
- Optimization implementation
- Performance regression prevention

**When to Use**:
- Performance issues detected
- Optimization requirements
- Performance budgets not met
- Profiling and measurement needed

**Example Use Cases**:
```
"Analyze page load performance and optimize"
"Find and fix performance bottlenecks"
"Reduce bundle size for faster loading"
"Profile database query performance"
```

---

### 8. socratic-mentor
**Purpose**: Educational guide using Socratic method for programming knowledge with focus on discovery learning

**Available Tools**: Read, Write, Grep, Bash

**Teaching Methods**:
- Guided questioning
- Progressive scaffolding
- Discovery learning
- Conceptual understanding over rote learning

**Best For**:
- Teaching programming concepts
- Explaining complex systems
- Building deep understanding
- Educational content creation

**When to Use**:
- User wants to learn, not just solve
- Educational context
- Building understanding of concepts
- Mentoring and guidance needed

**Example Use Cases**:
```
"Help me understand how closures work"
"Teach me React hooks through discovery"
"Explain this algorithm so I can learn the pattern"
"I want to learn async/await properly"
```

---

### 9. root-cause-analyst
**Purpose**: Systematically investigate complex problems to identify underlying causes through evidence-based analysis

**Available Tools**: Read, Grep, Glob, Bash, Write

**Investigation Methodology**:
- Evidence collection
- Pattern recognition
- Hypothesis testing
- Root cause validation

**Best For**:
- Debugging complex issues
- Multi-component failures
- Systematic investigation
- Evidence-based problem solving

**When to Use**:
- Bugs with unclear causes
- Intermittent failures
- Multi-layer problems
- Need systematic investigation

**Example Use Cases**:
```
"Debug: Payment processing fails intermittently"
"Why does the app crash on mobile only?"
"Investigate production performance degradation"
"Find root cause of authentication failures"
```

---

### 10. quality-engineer
**Purpose**: Ensure software quality through comprehensive testing strategies and systematic edge case detection

**Available Tools**: Read, Write, Bash, Grep

**Priority Hierarchy**: Prevention > Detection > Correction

**Quality Focus**:
- Test strategy development
- Edge case identification
- Quality gate implementation
- Test automation

**Best For**:
- Test suite creation
- Quality assurance planning
- Test coverage improvement
- Edge case testing

**When to Use**:
- Need comprehensive testing
- Quality assurance requirements
- Test strategy development
- Coverage gaps identified

**Example Use Cases**:
```
"Create comprehensive test suite for checkout flow"
"Develop testing strategy for the API"
"Identify and test edge cases for form validation"
"Implement quality gates for CI/CD pipeline"
```

---

### 11. github-actions-monitor
**Purpose**: Monitor and analyze GitHub Actions workflows with intelligent diagnostics and failure resolution

**Available Tools**: Bash, Read, Grep, Write

**Priority Hierarchy**: Quick diagnosis > Actionable fixes > Pattern recognition > Prevention

**Capabilities**:
- Workflow run status monitoring
- Failure analysis and triage
- Log parsing and error extraction
- Performance optimization
- Pattern recognition for recurring issues

**Best For**:
- CI/CD troubleshooting
- Workflow optimization
- Failure investigation
- Pipeline monitoring

**When to Use**:
- GitHub Actions failures
- CI/CD performance issues
- Workflow optimization needed
- Pipeline debugging required

**Example Use Cases**:
```
"Debug why GitHub Actions workflow failed"
"Optimize workflow build time"
"Analyze pattern of test failures in CI"
"Monitor workflow execution and report issues"
```

---

### 12. frontend-architect
**Purpose**: Create accessible, performant user interfaces with focus on user experience and modern frameworks

**Available Tools**: Read, Write, Edit, MultiEdit, Bash

**Priority Hierarchy**: User needs > Accessibility > Performance > Technical elegance

**Performance Budgets**:
- Load Time: <3s on 3G
- Bundle Size: <500KB initial
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Accessibility: WCAG 2.1 AA minimum

**Best For**:
- UI component development
- Frontend architecture design
- User experience optimization
- Accessibility implementation

**When to Use**:
- UI/UX development tasks
- Component library creation
- Frontend performance optimization
- Accessibility requirements

**Example Use Cases**:
```
"Build a responsive navigation with accessibility"
"Design component library architecture"
"Optimize frontend performance to meet budgets"
"Create accessible form components"
```

---

### 13. security-engineer
**Purpose**: Identify security vulnerabilities and ensure compliance with security standards and best practices

**Available Tools**: Read, Grep, Glob, Bash, Write

**Priority Hierarchy**: Security > Compliance > Reliability > Performance

**Threat Assessment**:
- OWASP Top 10 compliance
- Vulnerability scanning
- Security best practices
- Compliance requirements

**Best For**:
- Security audits
- Vulnerability assessment
- Security implementation
- Compliance validation

**When to Use**:
- Security concerns identified
- Audit requirements
- Vulnerability scanning needed
- Security best practices implementation

**Example Use Cases**:
```
"Perform comprehensive security audit"
"Identify and fix SQL injection vulnerabilities"
"Implement OAuth 2.0 authentication securely"
"Ensure OWASP compliance across the application"
```

---

### 14. learning-guide
**Purpose**: Teach programming concepts and explain code with focus on understanding through progressive learning

**Available Tools**: Read, Write, Grep, Bash

**Teaching Approach**:
- Progressive complexity
- Practical examples
- Concept reinforcement
- Interactive learning

**Best For**:
- Code explanations
- Programming tutorials
- Concept teaching
- Educational content

**When to Use**:
- User requests explanations
- Learning-focused interactions
- Tutorial creation
- Concept clarification needed

**Example Use Cases**:
```
"Explain how this authentication system works"
"Teach me the concepts behind this code"
"Create a tutorial for using this API"
"Help me understand this design pattern"
```

---

### 15. devops-architect
**Purpose**: Automate infrastructure and deployment processes with focus on reliability and observability

**Available Tools**: Read, Write, Edit, Bash

**Priority Hierarchy**: Automation > Observability > Reliability > Scalability

**Focus Areas**:
- Infrastructure as Code
- CI/CD pipeline design
- Monitoring and logging
- Deployment automation

**Best For**:
- Infrastructure automation
- Deployment pipeline design
- DevOps best practices
- Observability implementation

**When to Use**:
- Infrastructure setup
- Deployment automation needs
- CI/CD pipeline creation
- Monitoring implementation

**Example Use Cases**:
```
"Design CI/CD pipeline for microservices"
"Setup Kubernetes deployment automation"
"Implement monitoring and alerting strategy"
"Create infrastructure as code with Terraform"
```

---

### 16. refactoring-expert
**Purpose**: Improve code quality and reduce technical debt through systematic refactoring and clean code principles

**Available Tools**: Read, Edit, MultiEdit, Grep, Write, Bash

**Priority Hierarchy**: Simplicity > Maintainability > Readability > Performance

**Code Quality Focus**:
- Clean code principles
- SOLID principles
- Technical debt reduction
- Maintainability improvement

**Best For**:
- Code refactoring
- Technical debt reduction
- Code quality improvement
- Maintainability enhancement

**When to Use**:
- Code needs improvement
- Technical debt identified
- Refactoring requirements
- Quality standards not met

**Example Use Cases**:
```
"Refactor this module to improve maintainability"
"Reduce technical debt in authentication system"
"Apply SOLID principles to this codebase"
"Clean up and simplify this complex function"
```

---

### 17. system-architect
**Purpose**: Design scalable system architecture with focus on maintainability and long-term technical decisions

**Available Tools**: Read, Grep, Glob, Write, Bash

**Priority Hierarchy**: Long-term maintainability > Scalability > Performance > Short-term gains

**Design Focus**:
- System-wide architecture
- Scalability planning
- Technology selection
- Trade-off analysis

**Best For**:
- System design
- Architecture decisions
- Scalability planning
- Technology evaluation

**When to Use**:
- Major architectural decisions
- System design requirements
- Scalability needs
- Technology selection

**Example Use Cases**:
```
"Design scalable microservices architecture"
"Evaluate and select database technology"
"Create system architecture for high traffic application"
"Design event-driven architecture for real-time features"
```

---

### 18. python-expert
**Purpose**: Deliver production-ready, secure, high-performance Python code following SOLID principles and modern best practices

**Available Tools**: Read, Write, Edit, MultiEdit, Bash, Grep

**Python Focus**:
- Modern Python syntax (3.8+)
- Type hints and static typing
- Async/await patterns
- Testing with pytest
- Security best practices

**Best For**:
- Python development
- Python architecture
- Python testing
- Python optimization

**When to Use**:
- Python-specific tasks
- Python best practices needed
- Python performance optimization
- Python testing requirements

**Example Use Cases**:
```
"Implement async web scraper with rate limiting"
"Create Python API with FastAPI and type hints"
"Optimize Python code for performance"
"Write comprehensive pytest test suite"
```

---

### 19. statusline-setup
**Purpose**: Configure Claude Code status line settings

**Available Tools**: Read, Edit

**Best For**:
- Status line configuration
- UI customization

**When to Use**:
- Configuring status line
- UI preferences setup

---

## Agent Selection Guide

### By Task Type

**Code Development**:
- General: `general-purpose`
- Frontend: `frontend-architect`
- Backend: `backend-architect`
- Python: `python-expert`

**Analysis & Investigation**:
- Codebase exploration: `Explore`
- Root cause debugging: `root-cause-analyst`
- Performance analysis: `performance-engineer`
- Security audit: `security-engineer`

**Planning & Design**:
- Task planning: `Plan`
- Requirements gathering: `requirements-analyst`
- System architecture: `system-architect`
- Infrastructure: `devops-architect`

**Quality & Testing**:
- Test strategy: `quality-engineer`
- Code quality: `refactoring-expert`
- CI/CD monitoring: `github-actions-monitor`

**Documentation & Learning**:
- Technical writing: `technical-writer`
- Code explanation: `learning-guide`
- Teaching concepts: `socratic-mentor`

### By Complexity Level

**Simple Tasks** (< 3 steps):
- Use native Claude Code capabilities
- No agent needed

**Moderate Tasks** (3-10 steps):
- `Explore` for codebase discovery
- `Plan` for strategy development
- Specialized agents for domain-specific work

**Complex Tasks** (> 10 steps):
- `general-purpose` for multi-domain
- Multiple specialized agents in sequence
- Wave mode for large-scale operations

### By Thoroughness Need

**Quick Exploration**:
```
Task(Explore, thoroughness: "quick")
```

**Moderate Analysis**:
```
Task(Explore, thoroughness: "medium")
Task(Plan, thoroughness: "medium")
```

**Comprehensive Investigation**:
```
Task(Explore, thoroughness: "very thorough")
Task(root-cause-analyst)
```

---

## Best Practices

### 1. Agent Selection
- **Match domain to agent**: Use specialized agents for their expertise areas
- **Start broad, then narrow**: Use `Explore` → specialized agent pattern
- **Consider complexity**: Simple tasks don't need agents

### 2. Prompt Engineering
- **Be specific**: "Explore React hooks usage" > "find stuff"
- **Specify thoroughness**: Include level for Explore/Plan agents
- **Provide context**: Give agents relevant background information

### 3. Multi-Agent Workflows
- **Sequential composition**: Plan → Implement → Test
- **Parallel execution**: Multiple agents for different aspects
- **Handoff clarity**: Clear context transfer between agents

### 4. Tool Awareness
- **Know agent tools**: Each agent has specific tool access
- **Match task to tools**: Ensure agent has necessary tools
- **Tool limitations**: Respect agent tool constraints

### 5. Performance Optimization
- **Agent reuse**: Cache agent results when possible
- **Appropriate scope**: Don't over-engineer simple tasks
- **Parallel when possible**: Independent tasks can run concurrently

---

## Common Patterns

### Pattern 1: Explore → Implement
```yaml
Step 1: Task(Explore, "Find authentication implementation", thoroughness: "medium")
Step 2: Task(backend-architect, "Implement OAuth 2.0 based on current patterns")
```

### Pattern 2: Plan → Execute → Validate
```yaml
Step 1: Task(Plan, "Strategy for refactoring user service")
Step 2: Task(refactoring-expert, "Execute refactoring plan")
Step 3: Task(quality-engineer, "Validate refactoring with tests")
```

### Pattern 3: Analyze → Design → Implement
```yaml
Step 1: Task(root-cause-analyst, "Investigate performance issues")
Step 2: Task(performance-engineer, "Design optimization strategy")
Step 3: Task(general-purpose, "Implement optimizations")
```

### Pattern 4: Requirements → Architecture → Implementation
```yaml
Step 1: Task(requirements-analyst, "Gather project requirements")
Step 2: Task(system-architect, "Design system architecture")
Step 3: Task(backend-architect, "Implement backend services")
Step 4: Task(frontend-architect, "Implement UI components")
```

---

## Troubleshooting

### Agent Not Producing Expected Results
- **Verify agent capabilities**: Check available tools
- **Improve prompt specificity**: More detailed instructions
- **Check thoroughness level**: Adjust for Explore/Plan agents
- **Consider different agent**: May need specialized agent

### Agent Taking Too Long
- **Reduce thoroughness**: Use "quick" instead of "very thorough"
- **Narrow scope**: Be more specific about what's needed
- **Use simpler agent**: May not need comprehensive analysis

### Agent Missing Context
- **Provide background**: Include relevant project context
- **Reference previous work**: Link to earlier findings
- **Use memory**: Leverage project memory for context

### Multiple Agents Not Coordinating
- **Clear handoffs**: Explicitly state what next agent needs
- **Sequential execution**: Ensure proper ordering
- **Shared context**: Pass relevant information between agents

---

## Version History

**Version 1.0** (2025-01-08)
- Initial comprehensive subagents reference
- All 19 agents documented
- Usage patterns and best practices included

---

## See Also

- `PERSONAS.md` - Persona system and auto-activation
- `ORCHESTRATOR.md` - Agent routing and selection logic
- `MCP.md` - MCP server integration with agents
- `COMMANDS.md` - Command system and agent coordination
