# Firebase Authentication Skill

## Purpose
Master Firebase Authentication implementation for Google Sign-In, user session management, and auth state handling in the music-app project.

## Key Patterns

### Authentication Context Pattern
```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

### Using Auth in Components
```javascript
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <Button onClick={login}>Sign In with Google</Button>;
  }

  return (
    <Box>
      <Avatar src={user.photoURL} />
      <Typography>{user.displayName}</Typography>
      <Button onClick={logout}>Logout</Button>
    </Box>
  );
}
```

### Protected Route Pattern
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <CircularProgress />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Usage
<Route
  path="/favorites"
  element={
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  }
/>
```

## Best Practices

✅ **Do:**
- Use `onAuthStateChanged` to persist auth state
- Handle loading states during auth checks
- Clean up auth listeners in useEffect
- Show user-friendly error messages
- Use `useAuth()` hook, never direct context access

❌ **Don't:**
- Store passwords or sensitive data
- Forget to handle auth errors
- Use auth.currentUser without null check
- Skip loading states

## Common Issues

**Issue:** User state not persisting on refresh
**Solution:** `onAuthStateChanged` in useEffect handles this automatically

**Issue:** "auth/popup-blocked" error
**Solution:** Allow popups or use `signInWithRedirect`

## Integration Points
- All components use `useAuth()` hook
- App.jsx wraps app in AuthProvider
- Firebase config in src/config/firebase.js
