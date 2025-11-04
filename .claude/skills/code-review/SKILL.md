# Code Review Skill

## Purpose
Code review checklist and best practices for maintaining quality.

## Review Checklist

### Code Quality
- [ ] Descriptive naming
- [ ] No commented-out code
- [ ] No console.log in production
- [ ] Proper error handling

### React Patterns
- [ ] Hooks used correctly (useAuth, useFavorites)
- [ ] No prop drilling (use Context)
- [ ] Theme-aware styling (no hardcoded colors)
- [ ] Memoization where appropriate

### Testing
- [ ] Tests present for new features
- [ ] Coverage >80%
- [ ] Both success and error cases tested

### Performance
- [ ] No unnecessary re-renders
- [ ] Expensive computations memoized
- [ ] Search debounced

### Security
- [ ] No API keys in code
- [ ] User input validated
- [ ] Auth checks present

## Feedback Format
```
⚠️ Consider using useCallback for handleClick to prevent
unnecessary re-renders. Since this function is passed to
50+ child components, memoization would improve performance.

Example:
const handleClick = useCallback(() => {...}, [deps]);
```

## Best Practices
✅ Be specific and constructive
✅ Suggest solutions, not just problems
✅ Acknowledge good work
❌ Don't be vague or dismissive
❌ Don't focus on style over substance
