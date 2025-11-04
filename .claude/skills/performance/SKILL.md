# Performance Skill

## Purpose
Performance optimization techniques for React and the music-app.

## Core Optimizations

### React.memo
```javascript
const TuneCard = React.memo(({ tune, onFavorite }) => {
  return <Card>...</Card>;
}, (prev, next) => prev.tune.id === next.tune.id);
```

### useMemo
```javascript
const filtered = useMemo(() =>
  tunes.filter(t => t.genre === genre),
  [tunes, genre]
);
```

### useCallback
```javascript
const handleClick = useCallback((id) => {
  addFavorite(id);
}, [addFavorite]);
```

### Lazy Loading
```javascript
const TuneDetails = lazy(() => import('./pages/TuneDetailsPage'));

<Suspense fallback={<Loading />}>
  <TuneDetails />
</Suspense>
```

## Metrics
- LCP < 2.5s
- FID < 100ms
- Bundle < 200KB gzipped

## Tools
```bash
# Bundle analysis
npx source-map-explorer build/static/js/*.js

# Lighthouse
npx lighthouse http://localhost:3000
```

## Best Practices
✅ Measure before optimizing
✅ Use React DevTools Profiler
✅ Debounce search (300ms)
✅ Lazy load routes
❌ Don't premature optimize
❌ Don't memo everything
