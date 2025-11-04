# Error Handling Skill

## Purpose
Error handling patterns for Firebase, async operations, and user feedback.

## Try-Catch Pattern
```javascript
async function addFavorite(userId, tuneId) {
  try {
    await setDoc(doc(db, 'favorites', userId), data);
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error; // Re-throw for caller to handle
  }
}
```

## Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## User-Friendly Messages
```javascript
function handleError(error) {
  let message = 'An error occurred';

  if (error.code === 'auth/popup-blocked') {
    message = 'Please allow popups to sign in';
  } else if (error.code === 'permission-denied') {
    message = 'You do not have permission';
  }

  setErrorMessage(message);
}
```

## Loading States
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

try {
  setLoading(true);
  await operation();
  setError(null);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

## Best Practices
✅ Always catch errors
✅ Provide user-friendly messages
✅ Log errors for debugging
✅ Show loading states
❌ Don't show technical errors to users
❌ Don't silently fail
