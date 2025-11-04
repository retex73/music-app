# Git Hygiene Skill

## Purpose

Branch cleanup automation, commit quality maintenance, and repository health practices for trunk-based development.

## Scope

- Automated branch cleanup
- Stale branch detection
- Commit squashing techniques
- Git hooks setup
- Repository maintenance

## Branch Cleanup Automation

### Delete Merged Branches
```bash
# Delete local merged branches
git branch --merged main | grep -v "main" | xargs git branch -d

# Delete remote merged branches
git remote prune origin

# Comprehensive cleanup script
#!/bin/bash
echo "🧹 Cleaning up branches..."

# Local merged branches
MERGED=$(git branch --merged main | grep -v "main")
if [ -n "$MERGED" ]; then
  echo "Deleting merged local branches:"
  echo "$MERGED"
  git branch --merged main | grep -v "main" | xargs git branch -d
fi

# Remote merged branches
git remote prune origin

# Show remaining branches
echo "Remaining branches:"
git branch -a | grep -v "main"
echo "✅ Cleanup complete"
```

### Stale Branch Detection
```bash
# Find branches older than 24 hours
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short)|%(committerdate:relative)|%(authorname)' | \
  grep -E '[0-9]+ (day|week|month)s? ago'

# Delete stale branches (with confirmation)
#!/bin/bash
echo "Detecting stale branches (>24h)..."

git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short)|%(committerdate:relative)' | \
  while IFS='|' read -r branch age; do
    if [ "$branch" != "main" ]; then
      if [[ "$age" == *"day"* ]] || [[ "$age" == *"week"* ]] || [[ "$age" == *"month"* ]]; then
        echo "⚠️ Stale: $branch ($age)"
        echo "Delete? (y/n)"
        read -r response
        if [ "$response" = "y" ]; then
          git branch -D "$branch"
          git push origin --delete "$branch" 2>/dev/null
        fi
      fi
    fi
  done
```

### Branch Count Monitoring
```bash
# Check branch count (should be ≤3)
check_branch_limit() {
  COUNT=$(git branch | grep -v "main" | wc -l | tr -d ' ')

  if [ $COUNT -gt 3 ]; then
    echo "❌ Too many branches ($COUNT/3)"
    echo "Active branches:"
    git branch | grep -v "main"
    echo ""
    echo "Action required: Merge or delete branches to continue"
    return 1
  elif [ $COUNT -eq 3 ]; then
    echo "⚠️ At branch limit ($COUNT/3). Merge before creating new branches."
    return 0
  else
    echo "✅ Branch count OK ($COUNT/3)"
    return 0
  fi
}
```

## Commit Quality

### Commit Squashing
```bash
# Interactive rebase to squash commits
git rebase -i main

# In editor, change 'pick' to 'squash' (or 's'):
pick abc1234 feat: add playlist model
squash def5678 WIP - fix typo
squash ghi9012 WIP - update styling
squash jkl3456 add tests

# Save and close editor
# Edit combined commit message
# Result: One clean commit

# Force push (be careful!)
git push --force-with-lease origin feature/add-playlist
```

### Amending Commits
```bash
# Fix last commit (before pushing)
git add forgotten-file.js
git commit --amend --no-edit

# Or update commit message
git commit --amend -m "feat: add playlist feature with tests"

# If already pushed
git push --force-with-lease origin feature/add-playlist
```

### Commit Message Validation
```bash
#!/bin/bash
# .git/hooks/commit-msg

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check format: <type>: <description>
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|refactor|test|docs|style|perf|chore): .{10,}"; then
  echo "❌ Invalid commit message format"
  echo ""
  echo "Format: <type>: <description>"
  echo ""
  echo "Types: feat, fix, refactor, test, docs, style, perf, chore"
  echo "Description: At least 10 characters"
  echo ""
  echo "Examples:"
  echo "  feat: add playlist creation feature"
  echo "  fix: resolve audio player crash"
  echo "  test: add unit tests for favorites service"
  exit 1
fi

# Check for forbidden words
if echo "$COMMIT_MSG" | grep -qiE "^(WIP|temp|fix stuff|updates)"; then
  echo "❌ Commit message too vague: $COMMIT_MSG"
  echo "Be more descriptive about what changed and why"
  exit 1
fi

echo "✅ Commit message format valid"
```

## Git Hooks Setup

### Installing Hooks
```bash
# Create hooks directory if needed
mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Running pre-commit checks..."

# Run tests
npm test || {
  echo "❌ Tests failed"
  exit 1
}

# Run linter
npm run lint || {
  echo "❌ Lint errors found"
  exit 1
}

echo "✅ Pre-commit checks passed"
EOF

chmod +x .git/hooks/pre-commit

# Pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
echo "🔍 Running pre-push checks..."

# Check branch count
COUNT=$(git branch | grep -v "main" | wc -l | tr -d ' ')
if [ $COUNT -gt 3 ]; then
  echo "❌ Too many branches ($COUNT). Max is 3."
  exit 1
fi

# Check tests
npm test || {
  echo "❌ Tests failed"
  exit 1
}

echo "✅ Pre-push checks passed"
EOF

chmod +x .git/hooks/pre-push
```

### Using Husky (Modern Approach)
```bash
# Install Husky
npm install --save-dev husky

# Initialize
npx husky init

# Create pre-commit hook
npx husky add .husky/pre-commit "npm test"
npx husky add .husky/pre-commit "npm run lint"

# Create pre-push hook
npx husky add .husky/pre-push "npm test"

# Hooks now version-controlled and shared with team
```

## Repository Maintenance

### Regular Health Checks
```bash
#!/bin/bash
# repo-health-check.sh

echo "🏥 Repository Health Check"
echo "=========================="

# Branch count
COUNT=$(git branch | grep -v "main" | wc -l)
echo "Active branches: $COUNT/3"
if [ $COUNT -gt 3 ]; then
  echo "❌ OVER LIMIT"
else
  echo "✅ OK"
fi

# Stale branches
echo ""
echo "Branch ages:"
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short) | %(committerdate:relative)'

# Main branch status
echo ""
echo "Main branch status:"
git checkout main -q
git pull origin main -q
npm test > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Main is green (tests pass)"
else
  echo "❌ Main is broken (tests fail)"
fi

# Last merge time
echo ""
echo "Last merge to main:"
git log --merges -1 --format="%cr - %s"

# Unmerged work
echo ""
git checkout - -q
AHEAD=$(git rev-list --count HEAD..main)
BEHIND=$(git rev-list --count main..HEAD)
echo "Current branch vs main: $BEHIND ahead, $AHEAD behind"
```

## Automation Scripts

### Daily Cleanup Cron Job
```bash
# crontab -e
# Add this line to run cleanup daily at 6 PM:
0 18 * * * cd /path/to/music-app && ./scripts/daily-cleanup.sh

# scripts/daily-cleanup.sh
#!/bin/bash
git fetch origin
git checkout main
git pull origin main

# Delete merged branches
git branch --merged main | grep -v "main" | xargs git branch -d
git remote prune origin

# Alert about stale branches
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short)|%(committerdate:relative)' | \
  grep -E '[0-9]+ (day|week)s? ago' | \
  mail -s "Stale branches detected" team@example.com
```

## Best Practices

### ✅ Do

1. **Clean up daily** - Delete merged branches
2. **Automate checks** - Use git hooks
3. **Monitor health** - Run regular health checks
4. **Squash WIP commits** - Clean history before merge
5. **Validate messages** - Use commit-msg hook
6. **Prune remotes** - Remove stale remote tracking branches

### ❌ Don't

1. **Leave merged branches** - Delete immediately
2. **Skip hooks** - Hooks ensure quality
3. **Force push to main** - Never!
4. **Ignore stale branches** - Clean up or merge
5. **Commit without message** - Always explain changes

## Common Issues

**Issue**: Git hooks not running
**Solution**: Ensure hooks are executable: `chmod +x .git/hooks/*`

**Issue**: Branch deletion fails (has unmerged commits)
**Solution**: Use `git branch -D` to force delete (be careful!)

**Issue**: Commit message hook too strict
**Solution**: Review and adjust regex pattern in commit-msg hook

## Resources

- **Git Hooks Documentation**: https://git-scm.com/docs/githooks
- **Husky**: https://typicode.github.io/husky/
- **Conventional Commits**: https://www.conventionalcommits.org/
