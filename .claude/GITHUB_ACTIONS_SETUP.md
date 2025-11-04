# GitHub Actions Monitoring Setup Complete

## What Was Created

### 1. GitHub Actions Monitor Agent
**Location**: `~/.claude/agents/github-actions-monitor.md`

A specialized agent that:
- Monitors GitHub Actions workflow runs
- Analyzes failure logs with intelligent parsing
- Provides root cause diagnosis with evidence
- Generates actionable fix recommendations
- Tracks workflow health and performance

### 2. Slash Command Skill
**Location**: `~/.claude/commands/sc/gh-ci.md`

A command interface that provides:
- Quick status checks (`/sc:gh-ci status`)
- Deep failure analysis (`/sc:gh-ci analyze <run-id>`)
- Log parsing and error extraction
- Performance optimization suggestions
- Pattern detection for recurring issues

### 3. Framework Integration
**Updated Files**:
- `~/.claude/PERSONAS.md` - Added github-actions-monitor persona
- `~/.claude/ORCHESTRATOR.md` - Added CI/CD routing patterns

## How to Use

### Basic Commands

```bash
# Quick status of recent runs
/sc:gh-ci status

# Analyze a specific failure
/sc:gh-ci analyze 72183291

# List recent failures only
/sc:gh-ci failures

# View logs for a run
/sc:gh-ci logs 72183291

# Monitor live workflow
/sc:gh-ci watch
```

### Command Actions

| Action | Purpose | Example |
|--------|---------|---------|
| `status` | Show recent workflow runs | `/sc:gh-ci status` |
| `check <run-id>` | Analyze specific run | `/sc:gh-ci check 72183291` |
| `analyze <run-id>` | Deep analysis + fixes | `/sc:gh-ci analyze 72183291` |
| `logs <run-id>` | View parsed logs | `/sc:gh-ci logs 72183291` |
| `failures` | Recent failures only | `/sc:gh-ci failures` |
| `watch` | Monitor current runs | `/sc:gh-ci watch` |

### Manual gh Commands

You can also use `gh` CLI directly:

```bash
# List runs
gh run list --limit 20

# View specific run
gh run view 72183291

# Get logs with grep
gh run view 72183291 --log | grep -E "Error|FAIL"

# Watch live run
gh run watch
```

## What the System Provides

### Intelligent Analysis

When you run `/sc:gh-ci analyze <run-id>`, you get:

```
## Workflow Run Analysis - #72183291

**Status**: ❌ Failed
**Workflow**: CI
**Branch**: fix-tests
**Triggered**: 2 hours ago by push
**Duration**: 3m 42s

### Failed Jobs
1. **test** (Node.js 18.x)
   - Exit Code: 1
   - Failed Step: Run npm test

### Error Analysis
[Specific error with stack trace and line numbers]

### Root Cause
[AI-identified cause with detailed explanation]

### Fix Recommendation
```code
[Exact code changes with before/after examples]
```

### Prevention
[Strategies to avoid this issue in future]
```

### Pattern Recognition

The agent recognizes:
- **Test Failures**: Identifies failing tests and suggests fixes
- **Build Errors**: Parses compilation errors and dependency issues
- **Timeout Issues**: Detects long-running jobs and suggests optimizations
- **Flaky Tests**: Identifies intermittent failures across multiple runs
- **Environment Issues**: Catches version mismatches and missing dependencies
- **Performance Issues**: Identifies slow steps and caching opportunities

### Actionable Outputs

Every analysis includes:
- ✅ **Specific errors** with file paths and line numbers
- 🔍 **Root cause** with evidence from logs
- 🛠️ **Fix code** ready to copy-paste
- 📚 **Prevention tips** to avoid recurrence
- ⚡ **Performance suggestions** when relevant

## Integration with Existing Workflow

### Typical Usage Flow

1. **GitHub CI fails** → Get notification
2. **Run** `/sc:gh-ci failures` → See which runs failed
3. **Run** `/sc:gh-ci analyze <run-id>` → Get diagnosis and fixes
4. **Apply fixes** → Use recommended code changes
5. **Test locally** → `npm test` to verify
6. **Push** → Workflow should pass

### Works With Other Commands

- `/sc:test` - Run tests locally after fixes
- `/sc:git` - Commit workflow improvements
- `/sc:troubleshoot` - Deep debugging if needed
- `/sc:build` - Verify builds before pushing

## Benefits

✅ **Time Saving**: Diagnose failures in seconds, not minutes
✅ **Actionable**: Get exact code fixes, not just error messages
✅ **Learning**: Understand WHY failures happen
✅ **Prevention**: Improve workflows over time
✅ **Efficiency**: No manual log parsing or searching

## Authentication

The agent uses `gh` CLI which requires authentication:

```bash
# Check auth status
gh auth status

# Login if needed
gh auth login

# Verify repo access
gh repo view
```

## Example Real-World Usage

Using this exact repo as an example:

```bash
# Check recent runs
/sc:gh-ci status
# Shows: Run #72183291 failed on fix-tests branch

# Analyze the failure
/sc:gh-ci analyze 72183291
# Output:
# - Error: Unable to find label "Email" in AccountMenu.test.jsx
# - Root cause: MUI TextField missing id props
# - Fix: Add id="email" and id="password" props
# - Prevention: Use regex matchers in tests

# Apply fix → Push → CI passes ✅
```

## Next Steps

1. Try it out: `/sc:gh-ci status`
2. Analyze a past failure: `/sc:gh-ci analyze <run-id>`
3. See the quick reference: `.claude/GH_CI_QUICKSTART.md`

The agent is now fully integrated into your SuperClaude framework and ready to use!
