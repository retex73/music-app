# Trunk-Based Git Skill

## Purpose

Master trunk-based git workflow patterns, branch management strategies, and merge practices for continuous integration and deployment.

## Scope

- Trunk-based development workflow
- Branch management (≤3 active branches)
- Daily merge requirements
- Small, frequent commits
- Main branch protection
- Merge strategies
- Git commands for trunk-based workflow

## Core Principles

### Principle 1: Main Branch is Sacred
- Always deployment-ready ("green")
- All tests pass at all times
- No direct commits allowed
- Protected by automation

### Principle 2: Short-Lived Branches
- Maximum lifespan: 24 hours
- Maximum active branches: 3
- Delete immediately after merge
- Named clearly and consistently

### Principle 3: Small, Frequent Integration
- Merge to main at least daily
- Small commits (< 200 lines)
- Continuous integration mindset
- Reduce merge conflicts

## Branch Management

### Creating Branches
```bash
# Check current branch count first
BRANCH_COUNT=$(git branch | grep -v "main" | wc -l)
if [ $BRANCH_COUNT -ge 3 ]; then
  echo "❌ Max branches reached. Merge or delete first."
  exit 1
fi

# Create properly named branch
git checkout main
git pull origin main
git checkout -b feature/add-playlist

# Naming conventions:
# feature/  - New features
# fix/      - Bug fixes
# hotfix/   - Critical production fixes
# refactor/ - Code refactoring
```

### Checking Branch Status
```bash
# List all branches with ages
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short) | %(committerdate:relative) | %(authorname)'

# Count active branches
git branch | grep -v "main" | wc -l

# Find stale branches (>24h)
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short) %(committerdate:relative)' | \
  grep -E '[0-9]+ (day|week|month)s? ago'

# Check if branch is behind main
git fetch origin main
git log HEAD..origin/main --oneline
```

### Daily Merge Workflow
```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Update your feature branch
git checkout feature/add-playlist
git rebase main  # Or merge main into feature branch

# 3. Resolve any conflicts
# Edit conflicted files
git add .
git rebase --continue  # If rebasing
# or
git commit            # If merging

# 4. Run tests
npm test

# 5. Push changes
git push origin feature/add-playlist

# 6. Create/update PR
gh pr create --title "Add playlist feature" --body "..."

# 7. After approval, merge
git checkout main
git pull origin main
git merge --no-ff feature/add-playlist  # Or use GitHub merge button
git push origin main

# 8. Delete branch immediately
git branch -d feature/add-playlist
git push origin --delete feature/add-playlist
```

### Branch Cleanup
```bash
# Delete merged local branches
git branch --merged main | grep -v "main" | xargs git branch -d

# Delete merged remote branches
git remote prune origin

# Force delete unmerged branch (use with caution!)
git branch -D feature/abandoned
git push origin --delete feature/abandoned
```

## Commit Practices

### Small, Frequent Commits
```bash
# Good: Multiple small commits
git add src/services/playlistService.js
git commit -m "feat: add playlist data model"

git add src/components/PlaylistCard.jsx
git commit -m "feat: add playlist card component"

git add src/pages/PlaylistsPage.jsx
git commit -m "feat: add playlists page"

# Bad: One massive commit
git add .
git commit -m "add playlist feature"  # 500+ lines changed
```

### Commit Message Standards
```bash
# Format: <type>: <description>
#
# Types:
#   feat:     New feature
#   fix:      Bug fix
#   refactor: Code refactoring
#   test:     Adding tests
#   docs:     Documentation
#   style:    Formatting
#   perf:     Performance
#   chore:    Build/dependencies

# Good examples:
git commit -m "feat: add playlist creation modal"
git commit -m "fix: resolve audio player crash on iOS Safari"
git commit -m "refactor: extract tune search to custom hook"
git commit -m "test: add unit tests for favorites service"
git commit -m "perf: memoize expensive filter operation"

# Bad examples:
git commit -m "WIP"                    # Not descriptive
git commit -m "fix stuff"               # Vague
git commit -m "updates"                 # No context
git commit -m "final version"           # Not helpful
```

### Checking Commit Size
```bash
# Check size of last commit
git diff --stat HEAD~1

# Check size of all commits in branch
git diff --stat main..HEAD

# Lines changed in last commit
git show --stat HEAD

# If commit is too large, split it:
git reset HEAD~1  # Undo last commit, keep changes
# Then make multiple smaller commits
```

### Squashing Commits
```bash
# Interactive rebase to squash WIP commits
git rebase -i main

# In editor, mark commits to squash:
pick abc1234 feat: add playlist model
squash def5678 WIP
squash ghi9012 WIP
squash jkl3456 fix typo

# Result: One clean commit
# "feat: add playlist model"

# Force push (your branch only!)
git push --force-with-lease origin feature/add-playlist
```

## Merge Strategies

### Fast-Forward Merge (Simple Cases)
```bash
# When no conflicts and linear history
git checkout main
git merge feature/simple-fix
# Results in clean, linear history
```

### No-Fast-Forward Merge (Preserves Context)
```bash
# Preserves branch context with merge commit
git checkout main
git merge --no-ff feature/add-playlist
# Creates merge commit even if fast-forward possible

# Good for:
- Important features
- Multiple related commits
- Preserving PR context
```

### Squash Merge (Clean History)
```bash
# Squashes all commits into one
git checkout main
git merge --squash feature/add-playlist
git commit -m "feat: add playlist feature"

# Good for:
- Many WIP commits
- Clean main history
- Simple feature additions

# Bad for:
- Losing commit context
- Complex features needing history
```

### Rebase Before Merge
```bash
# Update feature branch with main changes
git checkout feature/add-playlist
git fetch origin main
git rebase origin/main

# Resolve conflicts
# Edit files
git add .
git rebase --continue

# Force push
git push --force-with-lease origin feature/add-playlist

# Then merge (will be fast-forward)
git checkout main
git merge feature/add-playlist
```

## Main Branch Protection

### Pre-Merge Checks
```bash
#!/bin/bash
# pre-merge-check.sh

echo "🔍 Running pre-merge checks..."

# 1. Ensure on feature branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" == "main" ]; then
  echo "❌ Cannot run from main branch"
  exit 1
fi

# 2. Update main
git fetch origin main

# 3. Check if behind main
BEHIND=$(git rev-list --count HEAD..origin/main)
if [ $BEHIND -gt 0 ]; then
  echo "❌ Branch is $BEHIND commits behind main. Rebase first."
  exit 1
fi

# 4. Run tests
echo "Running tests..."
npm test || {
  echo "❌ Tests failed"
  exit 1
}

# 5. Run build
echo "Building..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}

# 6. Run linter
echo "Linting..."
npm run lint || {
  echo "⚠️ Lint errors found"
  exit 1
}

# 7. Check PR size
LINES=$(git diff --stat origin/main..HEAD | tail -1 | awk '{print $4}')
if [ "$LINES" -gt 200 ]; then
  echo "⚠️ PR is large ($LINES lines). Consider splitting."
fi

echo "✅ All pre-merge checks passed!"
echo "Ready to create/update PR"
```

### Post-Merge Verification
```bash
#!/bin/bash
# post-merge-verify.sh

echo "🔍 Verifying main branch health..."

# 1. Switch to main
git checkout main
git pull origin main

# 2. Run tests
npm test || {
  echo "🚨 MAIN BRANCH BROKEN! Tests failing!"
  echo "Immediate action required:"
  echo "1. Identify breaking commit: git log -1"
  echo "2. Revert: git revert HEAD"
  echo "3. Push: git push origin main"
  exit 1
}

# 3. Run build
npm run build || {
  echo "🚨 MAIN BRANCH BROKEN! Build failing!"
  exit 1
}

echo "✅ Main branch healthy"
```

## GitHub/GitLab Integration

### Creating Pull Requests
```bash
# Using GitHub CLI
gh pr create \
  --title "feat: add playlist feature" \
  --body "Implements playlist creation and management

- Adds playlist data model
- Creates playlist UI components
- Adds tests

Closes #123" \
  --base main \
  --head feature/add-playlist

# Check PR status
gh pr status

# List PRs
gh pr list

# Merge PR
gh pr merge --squash --delete-branch
```

### Branch Protection Rules
```yaml
# GitHub branch protection for 'main':
- Require pull request reviews (1 minimum)
- Require status checks to pass:
  - tests
  - build
  - lint
- Require branches to be up to date before merge
- No force pushes
- No deletions
- Require linear history (optional)
```

## Common Scenarios

### Scenario 1: Working on Multiple Small Features
```bash
# DON'T create multiple branches
# DO use feature flags

# Create one branch
git checkout -b feature/playlists

# Add feature A with flag
# Commit and merge daily

# Add feature B with flag
# Commit and merge daily

# Enable flags when features complete
```

### Scenario 2: Urgent Hotfix Needed
```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-auth-bug

# 2. Make minimal fix
# Edit files
git add .
git commit -m "hotfix: fix authentication bypass vulnerability"

# 3. Fast-track merge
npm test  # Must pass
git checkout main
git merge hotfix/critical-auth-bug
git push origin main

# 4. Delete branch
git branch -d hotfix/critical-auth-bug

# 5. Verify fix in production
```

### Scenario 3: Resolving Merge Conflicts
```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Rebase feature branch
git checkout feature/add-playlist
git rebase main

# 3. Conflicts appear
# Edit conflicted files, resolve markers

# 4. Stage resolved files
git add .

# 5. Continue rebase
git rebase --continue

# 6. If more conflicts, repeat steps 3-5

# 7. Force push
git push --force-with-lease origin feature/add-playlist
```

### Scenario 4: Feature Not Complete at EOD
```bash
# Option 1: Use feature flag (preferred)
# Wrap incomplete code in flag
# Merge to main with flag disabled

# Option 2: Keep branch if near completion
# But merge first thing next morning
# Don't let branch age >24h

# Option 3: Stash and delete if very incomplete
git stash
git checkout main
git branch -D feature/incomplete
# Resume later with fresh branch
```

## Best Practices

### ✅ Do

1. **Merge daily** - At least once per day
2. **Small commits** - < 200 lines each
3. **Update often** - Pull main frequently
4. **Test before push** - Always run tests
5. **Delete branches** - Immediately after merge
6. **Use feature flags** - For incomplete work
7. **Descriptive messages** - Clear commit messages
8. **Rebase before PR** - Clean, linear history

### ❌ Don't

1. **Long-lived branches** - No branches >24h
2. **Many branches** - Keep ≤ 3 active
3. **Large commits** - Avoid massive changesets
4. **Direct to main** - Always use PRs
5. **Skip tests** - Never push failing tests
6. **Leave branches** - Clean up after merge
7. **Vague messages** - No "WIP" or "fix stuff"
8. **Batch work** - Don't hold changes for days

## Troubleshooting

### Issue: "Too many branches active"
```bash
# List branches
git branch

# Check which are merged
git branch --merged main

# Delete merged branches
git branch --merged main | grep -v "main" | xargs git branch -d

# Delete unneeded branches
git branch -D feature/abandoned
```

### Issue: "Branch behind main"
```bash
# Update main
git checkout main
git pull origin main

# Rebase feature branch
git checkout feature/your-branch
git rebase main

# Or merge main into feature
git merge main
```

### Issue: "Commit too large"
```bash
# Undo last commit, keep changes
git reset HEAD~1

# Stage changes selectively
git add file1.js file2.js
git commit -m "feat: part 1 - data model"

git add file3.jsx file4.jsx
git commit -m "feat: part 2 - UI components"
```

### Issue: "Main branch broken after merge"
```bash
# Immediate revert
git checkout main
git revert HEAD --no-edit
git push origin main

# Or reset if very recent (dangerous!)
git reset --hard HEAD~1
git push --force origin main  # Only if nobody pulled yet!
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
# .github/workflows/trunk-based-checks.yml
name: Trunk-Based Development Checks

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  validate-workflow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for branch checks

      - name: Check branch count
        run: |
          COUNT=$(git branch -r | grep -v "main" | wc -l)
          if [ $COUNT -gt 3 ]; then
            echo "❌ Too many branches ($COUNT). Max is 3."
            exit 1
          fi

      - name: Check PR size
        if: github.event_name == 'pull_request'
        run: |
          LINES=$(git diff --stat origin/main..HEAD | tail -1 | awk '{print $4}')
          if [ "$LINES" -gt 200 ]; then
            echo "⚠️ PR is large ($LINES lines). Consider splitting."
          fi

      - name: Run tests
        run: npm test

      - name: Build check
        run: npm run build

      - name: Lint check
        run: npm run lint
```

## Resources

- **Atlassian Guide**: https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development
- **Git Documentation**: https://git-scm.com/doc
- **GitHub CLI**: https://cli.github.com/
- **Conventional Commits**: https://www.conventionalcommits.org/
