# Routing Skill

## Purpose
React Router v6 navigation patterns for the music-app project.

## Route Structure
```javascript
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/hatao" element={<HataoPage />} />
  <Route path="/tune/:tuneId" element={<TuneDetailsPage />} />
  <Route path="/catalogue" element={<CataloguePage />} />
  <Route path="/thesession" element={<TheSessionPage />} />
  <Route path="/thesession/tune/:tuneId" element={<TheSessionTuneDetailsPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

## Navigation
```javascript
import { useNavigate, useParams, Link } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  const { tuneId } = useParams();

  // Programmatic navigation
  navigate('/tune/123');
  navigate(-1); // Go back

  // Link component
  return <Link to="/tune/123">View Tune</Link>;
}
```

## Best Practices
✅ Use Link for navigation, not <a>
✅ Handle 404 with catch-all route
✅ Use params for dynamic routes
❌ Don't use Switch (v6 uses Routes)
❌ Don't use exact prop (default in v6)
