# Feature Flags Skill

## Purpose

Implement feature flags (feature toggles) to enable merging incomplete work to main branch while maintaining deployment-ready code, essential for trunk-based development.

## Scope

- Environment-based feature flags
- React component wrapping patterns
- Feature flag management
- Flag cleanup strategies
- Testing with flags

## Why Feature Flags for Trunk-Based Development

Feature flags allow you to:
- ✅ Merge incomplete features to main daily
- ✅ Keep main branch deployment-ready
- ✅ Avoid long-lived feature branches
- ✅ Deploy code that's not user-visible yet
- ✅ Test features in production before release
- ✅ Gradually roll out features

## Implementation Patterns

### Simple Environment-Based Flags

**Configuration File**:
```javascript
// src/config/featureFlags.js
export const FEATURE_FLAGS = {
  // New features
  PLAYLISTS: process.env.REACT_APP_FEATURE_PLAYLISTS === 'true',
  SOCIAL_SHARING: process.env.REACT_APP_FEATURE_SOCIAL === 'true',
  COLLABORATIVE_SESSIONS: process.env.REACT_APP_FEATURE_COLLAB === 'true',

  // Improvements
  NEW_AUDIO_PLAYER: process.env.REACT_APP_FEATURE_NEW_PLAYER === 'true',
  ADVANCED_SEARCH: process.env.REACT_APP_FEATURE_ADVANCED_SEARCH === 'true',

  // Experiments
  AI_RECOMMENDATIONS: process.env.REACT_APP_FEATURE_AI_RECS === 'true',
};

// Helper function
export function isFeatureEnabled(featureName) {
  return FEATURE_FLAGS[featureName] === true;
}
```

**Environment Files**:
```bash
# .env.development (flags ON for testing)
REACT_APP_FEATURE_PLAYLISTS=true
REACT_APP_FEATURE_SOCIAL=true
REACT_APP_FEATURE_COLLAB=false

# .env.production (flags OFF until ready)
REACT_APP_FEATURE_PLAYLISTS=false
REACT_APP_FEATURE_SOCIAL=false
REACT_APP_FEATURE_COLLAB=false

# .env.staging (gradual rollout)
REACT_APP_FEATURE_PLAYLISTS=true  # Testing in staging
REACT_APP_FEATURE_SOCIAL=false
```

### Component Wrapping

**Basic Conditional Rendering**:
```javascript
import { FEATURE_FLAGS } from '../config/featureFlags';

function TuneDetailsPage() {
  return (
    <div>
      <TuneInfo />
      <AudioPlayer />

      {/* New incomplete feature wrapped in flag */}
      {FEATURE_FLAGS.PLAYLISTS && (
        <AddToPlaylistButton tuneId={tuneId} />
      )}

      {/* Old component shown when flag disabled */}
      {!FEATURE_FLAGS.NEW_AUDIO_PLAYER && <OldAudioPlayer />}

      {/* New component shown when flag enabled */}
      {FEATURE_FLAGS.NEW_AUDIO_PLAYER && <NewAudioPlayer />}
    </div>
  );
}
```

**Route Wrapping**:
```javascript
import { Routes, Route } from 'react-router-dom';
import { FEATURE_FLAGS } from '../config/featureFlags';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Conditional routes */}
      {FEATURE_FLAGS.PLAYLISTS && (
        <>
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailsPage />} />
        </>
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

**Navigation Wrapping**:
```javascript
function NavBar() {
  return (
    <AppBar>
      <Toolbar>
        <Link to="/">Home</Link>
        <Link to="/favorites">Favorites</Link>

        {/* Show link only when feature is ready */}
        {FEATURE_FLAGS.PLAYLISTS && (
          <Link to="/playlists">Playlists</Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
```

### Context-Based Flags (Advanced)

**Feature Flag Provider**:
```javascript
// src/contexts/FeatureFlagsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const FeatureFlagsContext = createContext();

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
}

export function FeatureFlagsProvider({ children }) {
  const [flags, setFlags] = useState({
    playlists: process.env.REACT_APP_FEATURE_PLAYLISTS === 'true',
    socialSharing: process.env.REACT_APP_FEATURE_SOCIAL === 'true',
    collaborativeSessions: process.env.REACT_APP_FEATURE_COLLAB === 'true',
  });

  // Optional: Load from Firebase Remote Config
  useEffect(() => {
    // Load remote flags from Firestore or Remote Config
    // This allows changing flags without redeployment
  }, []);

  const isEnabled = (featureName) => flags[featureName] === true;

  return (
    <FeatureFlagsContext.Provider value={{ flags, isEnabled, setFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
```

**Usage with Context**:
```javascript
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

function Component() {
  const { isEnabled } = useFeatureFlags();

  return (
    <div>
      {isEnabled('playlists') && <PlaylistFeature />}
    </div>
  );
}
```

### Firebase Remote Config (Production-Grade)

```javascript
import { getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';

const remoteConfig = getRemoteConfig();
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

// Fetch flags from Firebase
export async function loadRemoteFeatureFlags() {
  try {
    await fetchAndActivate(remoteConfig);

    return {
      playlists: getValue(remoteConfig, 'feature_playlists').asBoolean(),
      socialSharing: getValue(remoteConfig, 'feature_social').asBoolean(),
    };
  } catch (error) {
    console.error('Error loading remote config:', error);
    // Fallback to environment variables
    return {
      playlists: process.env.REACT_APP_FEATURE_PLAYLISTS === 'true',
      socialSharing: process.env.REACT_APP_FEATURE_SOCIAL === 'true',
    };
  }
}
```

## Testing with Feature Flags

### Test Both States
```javascript
describe('TuneDetailsPage', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('with playlists feature enabled', () => {
    beforeEach(() => {
      process.env.REACT_APP_FEATURE_PLAYLISTS = 'true';
    });

    test('shows add to playlist button', () => {
      render(<TuneDetailsPage />);
      expect(screen.getByText(/add to playlist/i)).toBeInTheDocument();
    });
  });

  describe('with playlists feature disabled', () => {
    beforeEach(() => {
      process.env.REACT_APP_FEATURE_PLAYLISTS = 'false';
    });

    test('hides add to playlist button', () => {
      render(<TuneDetailsPage />);
      expect(screen.queryByText(/add to playlist/i)).not.toBeInTheDocument();
    });
  });
});
```

## Flag Lifecycle Management

### Adding a New Flag
```javascript
// 1. Add to featureFlags.js
export const FEATURE_FLAGS = {
  NEW_FEATURE: process.env.REACT_APP_FEATURE_NEW === 'true',
};

// 2. Add to .env files
// .env.development
REACT_APP_FEATURE_NEW=true

// .env.production
REACT_APP_FEATURE_NEW=false

// 3. Wrap code in flag
{FEATURE_FLAGS.NEW_FEATURE && <NewComponent />}

// 4. Document flag
// Add comment with removal date
// NEW_FEATURE: Remove after 2024-12-01 when fully launched
```

### Removing a Flag (Feature Complete)
```javascript
// 1. Enable flag in all environments
REACT_APP_FEATURE_PLAYLISTS=true  // In all .env files

// 2. Deploy and verify
// 3. Remove flag checks from code
// Before:
{FEATURE_FLAGS.PLAYLISTS && <PlaylistButton />}

// After:
<PlaylistButton />

// 4. Remove from featureFlags.js
// 5. Remove from .env files

// 6. Commit cleanup
git commit -m "chore: remove PLAYLISTS feature flag (fully launched)"
```

## Best Practices

### ✅ Do

1. **Document flags** - Add comment with purpose and removal date
2. **Test both states** - Flag on and flag off
3. **Clean up flags** - Remove when feature complete
4. **Use for incomplete work** - Enable trunk-based merging
5. **Default to disabled** - Safety first in production
6. **Simple conditions** - Easy to understand and maintain

### ❌ Don't

1. **Accumulate dead flags** - Remove completed flags
2. **Complex flag logic** - Avoid nested flag conditions
3. **Use for A/B testing** - Different purpose (use analytics tools)
4. **Forget to document** - Always explain flag purpose
5. **Skip testing** - Test with flag on AND off
6. **Leave flags forever** - They're temporary by design

## Flag Naming Conventions

```
✅ Good names:
FEATURE_PLAYLISTS
FEATURE_NEW_AUDIO_PLAYER
FEATURE_SOCIAL_SHARING
ENABLE_ADVANCED_SEARCH
ENABLE_AI_RECOMMENDATIONS

❌ Bad names:
NEW_STUFF
TEMP_FIX
JOHNS_FEATURE
BETA
EXPERIMENTAL
```

## Common Patterns

### Gradual Rollout
```javascript
// Start: Flag off in production
REACT_APP_FEATURE_PLAYLISTS=false

// Phase 1: Enable for internal testing
// Enable in staging/dev

// Phase 2: Enable for subset of users (10%)
if (FEATURE_FLAGS.PLAYLISTS && Math.random() < 0.1) {
  return <NewFeature />;
}

// Phase 3: Enable for all users
REACT_APP_FEATURE_PLAYLISTS=true

// Phase 4: Remove flag completely
```

### Kill Switch
```javascript
// Emergency disable mechanism
const KILL_SWITCHES = {
  PLAYLISTS: process.env.REACT_APP_KILL_PLAYLISTS === 'true',
};

// Override feature flag if kill switch active
const isPlaylistsEnabled =
  FEATURE_FLAGS.PLAYLISTS && !KILL_SWITCHES.PLAYLISTS;
```

## Integration with Music-App

### Example: Adding Playlists Feature

**Day 1** (Start development):
```javascript
// Add flag
export const FEATURE_FLAGS = {
  PLAYLISTS: process.env.REACT_APP_FEATURE_PLAYLISTS === 'true',
};

// Create data model (incomplete, but mergeable)
// Wrap in flag
if (FEATURE_FLAGS.PLAYLISTS) {
  // Incomplete playlist logic
}

// Merge to main (flag disabled in production)
```

**Day 2** (Continue development):
```javascript
// Add UI components (still incomplete)
{FEATURE_FLAGS.PLAYLISTS && <PlaylistButton />}

// Merge to main again (flag still disabled)
```

**Day 3** (Complete feature):
```javascript
// Add final tests and polish
// Enable flag in staging
REACT_APP_FEATURE_PLAYLISTS=true  // .env.staging

// Test thoroughly
// Enable in production
REACT_APP_FEATURE_PLAYLISTS=true  // .env.production

// Deploy
```

**Day 7** (Cleanup):
```javascript
// Remove flag completely
// Feature proven stable
git commit -m "chore: remove PLAYLISTS feature flag"
```

## Resources

- **Martin Fowler on Feature Toggles**: https://martinfowler.com/articles/feature-toggles.html
- **Firebase Remote Config**: https://firebase.google.com/docs/remote-config
- **LaunchDarkly Guide**: https://launchdarkly.com/blog/what-are-feature-flags/
