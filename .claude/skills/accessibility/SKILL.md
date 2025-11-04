# Accessibility Skill

## Purpose
WCAG 2.1 AA compliance and accessibility best practices.

## Core Principles

### Semantic HTML
```javascript
// ✅ Semantic
<nav><Link to="/">Home</Link></nav>
<main><h1>Title</h1></main>
<button onClick={handleClick}>Submit</button>

// ❌ Non-semantic
<div onClick={() => navigate('/')}>Home</div>
<div><span>Title</span></div>
<div onClick={handleClick}>Submit</div>
```

### ARIA Labels
```javascript
<IconButton aria-label="Add to favorites">
  <Favorite />
</IconButton>

<TextField
  label="Search tunes"
  aria-label="Search tunes by title or genre"
/>
```

### Keyboard Navigation
```javascript
// Ensure all interactive elements are keyboard accessible
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}
```

### Color Contrast
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Use theme.palette for compliant colors

## Testing
- Tab through all interactive elements
- Test with screen reader (VoiceOver, NVDA)
- Use axe DevTools browser extension

## Best Practices
✅ Use semantic HTML
✅ Provide alt text for images
✅ Ensure keyboard navigation
✅ Maintain focus indicators
❌ Don't rely on color alone
❌ Don't remove focus outlines
