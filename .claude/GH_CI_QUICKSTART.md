# GitHub Actions CI Monitor - Quick Start Guide

## Overview

The `/sc:gh-ci` command provides intelligent monitoring and troubleshooting for GitHub Actions workflows. It uses the `gh` CLI to fetch workflow data and provides AI-powered analysis of failures.

## Prerequisites

Ensure GitHub CLI is authenticated:
```bash
gh auth status
# If not authenticated:
gh auth login
```

## Usage Examples

### 1. Quick Status Check
```
/sc:gh-ci status
```
Shows recent workflow runs with their status.

### 2. List Recent Failures
```
/sc:gh-ci failures
```
Shows only failed runs from the last 24 hours.

### 3. Analyze Specific Failure
```
/sc:gh-ci analyze 72183291
```
Provides deep analysis with:
- Error extraction from logs
- Root cause identification
- Code fixes with examples
- Prevention recommendations

### 4. View Logs
```
/sc:gh-ci logs 72183291
```
Retrieves and parses complete workflow logs.

### 5. Monitor Live Run
```
/sc:gh-ci watch
```
Monitors currently running workflows in real-time.

### 6. Performance Analysis
```
/sc:gh-ci analyze <run-id> --focus performance
```
Identifies slow jobs and caching opportunities.

## Manual gh Commands

You can also use `gh` CLI directly:

```bash
# List recent runs
gh run list --limit 10

# View specific run
gh run view 72183291

# Get logs with error filtering
gh run view 72183291 --log | grep -E "Error|FAIL|✗"

# Check run status in JSON
gh run list --json status,conclusion,name,createdAt --limit 5
```

## What the Agent Does

The `github-actions-monitor` agent:

1. **Fetches Data**: Uses `gh` CLI to retrieve workflow runs and logs
2. **Parses Logs**: Intelligently extracts errors, warnings, and relevant context
3. **Identifies Patterns**: Recognizes common failure types (tests, builds, timeouts)
4. **Provides Fixes**: Generates code snippets and configuration changes
5. **Suggests Prevention**: Recommends improvements to avoid recurrence

## Example Output

When you run `/sc:gh-ci analyze 72183291`, you get:

```
## Workflow Run Analysis - #72183291

**Status**: ❌ Failed
**Workflow**: CI
**Branch**: fix-tests
**Duration**: 3m 42s

### Failed Jobs
1. **test** (Node.js 18.x)
   - Exit Code: 1
   - Step: Run npm test

### Error Analysis
[Specific error with context]

### Root Cause
[AI-identified cause with explanation]

### Fix Recommendation
```code
[Exact code changes needed]
```

### Prevention
[How to avoid this in future]
```

## Benefits

✅ **Fast Diagnosis**: Get root cause in seconds instead of manual log parsing
✅ **Actionable Fixes**: Copy-paste ready code solutions
✅ **Pattern Recognition**: Identifies flaky tests and recurring issues
✅ **Learning**: Each failure includes prevention advice
✅ **Time Saving**: Reduces debugging time from hours to minutes

## Tips

- Always run `/sc:gh-ci status` first to see recent runs
- Use `analyze` for deep investigation of failures
- Check `--focus performance` for optimization opportunities
- The agent learns from your workflow patterns over time

## Integration

Works seamlessly with:
- `/sc:test` - Fix tests after identifying failures
- `/sc:git` - Commit workflow fixes
- `/sc:troubleshoot` - Deep debugging of complex issues
