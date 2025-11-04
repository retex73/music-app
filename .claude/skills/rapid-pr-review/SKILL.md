# Rapid PR Review Skill

## Purpose

Fast, effective pull request reviews for small batches in trunk-based development. Optimized for PRs < 200 lines with < 2 hour review time target.

## Scope

- Small-batch PR review protocols
- Synchronous review practices
- Fast-track approval criteria
- Review time SLAs
- Automated check leverage

## Trunk-Based Review Principles

### Speed is Essential
- Target: < 2 hours from PR creation to merge
- Small PRs enable fast reviews
- Automated checks reduce manual work
- Focus on critical issues first
- Approve + comment for minor issues

### Quality Still Matters
- Fast ≠ Careless
- Leverage automation for routine checks
- Human review for logic, design, security
- Block only for critical issues
- Trust the process

## Review Time SLAs

| PR Size | Review Target | Expected Depth |
|---------|---------------|----------------|
| < 50 lines | 30 minutes | Quick scan |
| 50-100 lines | 1 hour | Standard review |
| 100-200 lines | 2 hours | Thorough review |
| > 200 lines | Split PR | Too large for trunk-based |

## Rapid Review Checklist

### Quick Validation (< 5 minutes)

**Automated Checks**:
- [ ] ✅ All tests pass (CI/CD)
- [ ] ✅ Build succeeds
- [ ] ✅ Linter passes
- [ ] ✅ No merge conflicts
- [ ] ✅ Branch up to date with main

**PR Metadata**:
- [ ] Clear, descriptive title
- [ ] Description explains what and why
- [ ] Single logical change
- [ ] Linked to issue (if applicable)
- [ ] Branch < 24 hours old
- [ ] PR size < 200 lines

**Fast-Track Criteria** (auto-approve if all true):
```
✅ All automated checks pass
✅ PR < 50 lines
✅ No security-sensitive changes
✅ No breaking changes
✅ Follows existing patterns
✅ Has tests for new code
✅ Created by trusted contributor

→ APPROVE immediately (< 15 minutes)
```

### Code Review (< 15 minutes)

**Focus Areas** (priority order):

**1. Security (5 minutes)**:
- [ ] No API keys or secrets in code
- [ ] User input validated
- [ ] Authentication checks present
- [ ] Firebase security rules implications
- [ ] No XSS vulnerabilities

**2. Correctness (5 minutes)**:
- [ ] Logic appears sound
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] No obvious bugs

**3. Tests (3 minutes)**:
- [ ] Tests present for new code
- [ ] Tests cover success and error paths
- [ ] Mocks properly configured
- [ ] Tests will actually catch bugs

**4. Performance (2 minutes)**:
- [ ] No obvious performance issues
- [ ] Expensive operations memoized
- [ ] No unnecessary re-renders

**Skip or defer** (use linters/auto-formatters):
- Code style (linter handles this)
- Formatting (prettier handles this)
- Minor refactoring opportunities

### Decision Making (< 5 minutes)

**✅ Approve** (merge when ready):
```
All critical checks pass
No security issues
Tests present and passing
Follows project patterns

Minor suggestions OK (use comments, don't block)
```

**⚠️ Approve with Comments** (non-blocking):
```
Code works correctly
Tests pass
Minor improvements suggested
Not critical for merge

Examples:
- "Consider extracting this logic to a helper"
- "Could use useCallback here for performance"
- "Might want to add test for edge case X"
```

**❌ Request Changes** (blocking):
```
Critical issues only:
- Security vulnerabilities
- Obvious bugs
- Missing authentication checks
- Memory leaks
- No tests for new features
- Breaking changes without migration

Provide specific, actionable feedback
Include code examples
Link to documentation
```

## Review Templates

### Fast-Track Approval (< 50 lines)
```markdown
## Quick Review: [Feature Name]

**Auto-Checks**: ✅ Tests pass | ✅ Build OK | ✅ Lint clean
**Security**: ✅ No issues
**Tests**: ✅ Present and comprehensive
**Code Quality**: ✅ Follows patterns

**Decision**: ✅ **Approved**
**Review Time**: 12 minutes
**Next**: Merge when ready
```

### Standard Approval (50-200 lines)
```markdown
## Review: [Feature Name]

### Auto-Checks
✅ All automated checks passed

### Code Quality
✅ Follows project patterns
✅ Proper error handling
✅ Well-structured code

### Testing
✅ Unit tests present
✅ Coverage adequate
⚠️ Suggestion: Add test for edge case when `data` is empty

### Performance
✅ No obvious issues
⚠️ Consider: Memoize `filteredTunes` calculation (line 42) for better performance

### Security
✅ No security concerns

**Decision**: ✅ **Approved with suggestions**
**Review Time**: 45 minutes
**Action**: Merge now, address suggestions in follow-up if desired
```

### Request Changes (Critical Issues)
```markdown
## Review: [Feature Name]

### Critical Issues

❌ **Security**: Line 23 - User input not validated before Firestore write
```javascript
// Current (unsafe):
await setDoc(doc(db, 'playlists', playlistId), userInput);

// Fix (safe):
const validated = validatePlaylistData(userInput);
await setDoc(doc(db, 'playlists', playlistId), validated);
```

❌ **Bug**: Line 67 - Memory leak, listener not cleaned up
```javascript
// Add cleanup:
useEffect(() => {
  const unsubscribe = onSnapshot(...);
  return () => unsubscribe(); // Missing!
}, []);
```

❌ **Missing Tests**: No tests for new `createPlaylist` function

**Decision**: ❌ **Request Changes**
**Review Time**: 35 minutes
**Action**: Fix critical issues above, then re-request review
```

## Synchronous Review Protocol

### Timeline

**0:00** - PR created
**0:00-0:30** - Automated checks run
**0:30-0:45** - Reviewer notified and starts review
**0:45-1:30** - Code review completed
**1:30-1:45** - Feedback provided
**1:45-2:00** - Developer addresses feedback (if any)
**2:00** - Merge approved

**Total: < 2 hours from creation to merge**

### Review Stages

**Stage 1: Triage (2 minutes)**
- Check PR size
- Read description
- Verify automated checks passed
- Assess complexity

**Stage 2: Quick Scan (5 minutes)**
- Scan all changed files
- Identify critical areas
- Check for obvious issues
- Note areas needing deeper review

**Stage 3: Deep Review (10-15 minutes)**
- Review security-sensitive code
- Verify logic correctness
- Check test coverage
- Assess performance implications

**Stage 4: Decision (3 minutes)**
- Approve, approve with comments, or request changes
- Write feedback
- Submit review

**Stage 5: Follow-up (if needed)**
- Answer questions
- Clarify feedback
- Re-review if changes requested

## Automated Check Leverage

### What Automation Handles
✅ Tests pass
✅ Build succeeds
✅ Linter passes
✅ Code formatting
✅ Type checking (if using TypeScript)
✅ Dependency vulnerabilities

### What Humans Review
🔍 Business logic correctness
🔍 Security implications
🔍 Architecture fit
🔍 Test quality (not just presence)
🔍 Edge case handling
🔍 User experience

**Key Insight**: Automation handles 70% of checks, humans focus on 30% that matters most.

## Feedback Best Practices

### Constructive Feedback Formula

**Format**:
```
[Severity] [Issue]: [Explanation]

[Code example or suggestion]

[Reasoning]
```

**Example**:
```
⚠️ Performance: Lines 42-45 could be optimized

Consider memoizing this expensive filter operation:

const filtered = useMemo(
  () => tunes.filter(t => t.genre === genre),
  [tunes, genre]
);

Reasoning: This filter runs on every render with 500+ tunes,
causing unnecessary work. Memoization would improve responsiveness.
```

### Severity Levels

**🚨 Critical** (blocking):
- Security vulnerabilities
- Data loss risks
- Breaking changes
- Authentication bypasses

**❌ Required** (blocking):
- Bugs
- Missing error handling
- No tests for new features
- Memory leaks

**⚠️ Suggested** (non-blocking):
- Performance improvements
- Code quality enhancements
- Additional test cases
- Refactoring opportunities

**💡 Nice to have** (non-blocking):
- Style preferences
- Alternative approaches
- Documentation improvements

## Small-Batch Advantages

### Why < 200 Lines Works

**Faster Review**:
- Can review in one sitting
- Less context switching
- Easier to understand
- Fewer edge cases to consider

**Higher Quality**:
- Reviewer stays focused
- Less fatigue = better attention
- Easier to spot bugs
- More thorough feedback

**Lower Risk**:
- Smaller changes = less can go wrong
- Easier to revert if needed
- Simpler to test
- Reduced merge conflicts

**Better Collaboration**:
- Faster feedback cycles
- Less blocking
- Continuous progress
- Easier handoffs

## Common Scenarios

### Scenario 1: Quick Win PR (< 50 lines)
```markdown
PR: "fix: resolve audio player crash on iOS"
Size: 23 lines
Time: 15 minutes

Review:
✅ Auto-checks passed
✅ Bug fix is clean
✅ Test added for regression
✅ No security issues

Decision: Approve ✅
Merge immediately
```

### Scenario 2: Standard Feature PR (100-150 lines)
```markdown
PR: "feat: add playlist card component"
Size: 142 lines
Time: 1 hour

Review:
✅ Auto-checks passed
✅ Component follows MUI patterns
✅ Tests comprehensive
⚠️ Could improve: Add keyboard navigation

Decision: Approve with suggestions ✅
Merge now, keyboard nav can be follow-up PR
```

### Scenario 3: Needs Changes (Security Issue)
```markdown
PR: "feat: add playlist sharing"
Size: 87 lines
Time: 30 minutes

Review:
❌ Security: User input not validated
❌ Missing: Authentication check on share endpoint

Decision: Request changes ❌
Fix security issues, then re-review (will take 15 min)
```

## Integration with Music-App

### Project-Specific Quick Checks

**React/MUI**:
- Uses `useAuth()` and `useFavorites()` hooks (not direct context)
- Styles use `sx` prop with theme.palette colors
- Components properly memoized if passed to many children

**Firebase**:
- All operations have try-catch error handling
- Real-time listeners cleaned up in useEffect return
- User authentication verified before Firestore writes

**Testing**:
- Tests in `__tests__/` directory
- Mocks for AuthContext and FavoritesContext
- Both success and error paths tested

**Music Domain**:
- ABC notation validated before rendering
- Audio player cleanup on unmount
- Tune data structures respected (Hatao vs Session)

## Best Practices

### ✅ Do

1. **Review within 2 hours** - Don't delay
2. **Focus on critical issues** - Security, bugs, logic
3. **Leverage automation** - Don't re-check what CI checks
4. **Be specific** - Point to exact lines, provide examples
5. **Approve + comment** - Don't block for minor issues
6. **Fast-track small PRs** - < 50 lines can be very quick
7. **Trust tests** - If tests comprehensive, trust the code

### ❌ Don't

1. **Block for style** - Use linters and formatters
2. **Request rewrites** - Small PRs shouldn't need major changes
3. **Delay reviews** - Breaks trunk-based flow
4. **Nitpick** - Focus on what matters
5. **Expand scope** - Review what's there, not what could be
6. **Perfect is enemy of good** - Good enough + fast > perfect + slow

## Success Criteria

- ✅ Average review time < 2 hours
- ✅ 90% of PRs < 200 lines
- ✅ Fast-track PRs < 50 lines reviewed in < 30 min
- ✅ Automated checks trusted (no redundant manual checking)
- ✅ Only critical issues block merges
- ✅ Feedback is specific and actionable
- ✅ Reviews don't bottleneck development

## Resources

- **Google Code Review Guide**: https://google.github.io/eng-practices/review/
- **Trunk-Based Development**: https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development
- **Conventional Comments**: https://conventionalcomments.org/
