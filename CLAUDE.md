# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm start

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/services/__tests__/tunePreferencesService.test.js

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## Architecture Overview

### Context-Based State Management

The app uses React Context API for global state, with two primary contexts that wrap the entire application:

- **AuthContext** (`src/contexts/AuthContext.jsx`): Firebase authentication state, provides `useAuth()` hook
- **FavoritesContext** (`src/contexts/FavoritesContext.jsx`): User favorites management, provides `useFavorites()` hook

Both contexts are initialized in `App.jsx` and wrap all routes. Always use the provided hooks (`useAuth()`, `useFavorites()`) rather than accessing contexts directly.

### Dual Data Source Pattern

The app manages two distinct tune catalogs with different data structures:

1. **Hatao Tunes** (`/data/tunes_data.csv`):
   - Fields: Set No., Tune No., Tune Title, Learning Video, Genre, Added, Rhythm, Key, Mode, Part
   - Service: `src/services/tunesService.js`
   - Search: Fuse.js fuzzy search with `fuseInstance`
   - Routes: `/`, `/hatao`, `/tune/:tuneId`

2. **The Session Tunes** (`/data/session_tunes_data.csv`):
   - Fields: tune_id, setting_id, name, type, meter, mode, abc, date, username
   - Service: `src/services/sessionService.js`
   - ABC notation support via `abcjs` library
   - Routes: `/thesession`, `/thesession/tune/:tuneId`

Both services follow the same initialization pattern:
- CSV data loaded via `fetch()` from `/public/data/`
- Parsed with PapaParse library
- Stored in module-level `tunesData` variable
- Must call `initializeTunesData()` or `initializeSessionData()` before use

### Firebase Integration

Three Firestore collections with distinct purposes:

1. **favorites** collection (document per user):
   ```javascript
   {
     userId: {
       hatao: [tuneId1, tuneId2, ...],      // Hatao favorites
       thesession: [tuneId1, tuneId2, ...]  // Session favorites
     }
   }
   ```
   Managed by `src/services/favouritesService.js`

2. **tunePreferences** collection (document per user-tune combination):
   ```javascript
   {
     "${userId}_${tuneId}": {
       userId: string,
       tuneId: string,
       versionOrder: [settingId1, settingId2, ...],
       updatedAt: ISO timestamp
     }
   }
   ```
   Managed by `src/services/tunePreferencesService.js`
   Stores user's preferred ordering of tune versions/settings

Firebase config uses environment variables (see `.env` for required `REACT_APP_FIREBASE_*` values).

### Routing Structure

React Router v6 with nested layout pattern:

```
/ (HomePage - Hatao catalog)
/hatao (HataoPage - same catalog, different view)
/tune/:tuneId (TuneDetailsPage - Hatao tune details)
/catalogue (CataloguePage - Hatao browse view)
/thesession (TheSessionPage - Session catalog)
/thesession/tune/:tuneId (TheSessionTuneDetailsPage - Session tune with ABC notation)
```

All routes wrapped in persistent layout: `NavBar` + main content area (flexbox column).

### Material-UI Theming

Dark theme configured in `src/theme/darkTheme.js`, applied globally via `ThemeProvider` in `App.jsx`. All components use MUI v6 with Emotion styling. Shared styled components in `src/components/shared/`.

### ABC Notation Rendering

The Session tunes support ABC music notation via `abcjs` library:
- ABC string stored in CSV `abc` column
- Rendered as sheet music using abcjs
- Interactive playback available via `TuneAudioPlayer` component
- Sheet music modal component: `SheetMusicModal.jsx`

### Component Organization

```
components/
├── HomePage/              # Home page sections (Hero, FavoritesSection, RandomTunes, Footer)
├── TheSessionTuneDetailsPage/  # Session tune components (TuneSetting, TuneSettingsList, SheetMusicModal)
├── shared/                # Reusable components (StyledPaper)
└── [root components]      # NavBar, SearchBar, TuneAudioPlayer, etc.
```

Page components in `src/pages/` map 1:1 with routes.

## Key Implementation Notes

### Search Implementation

Hatao tunes use Fuse.js with these search-optimized fields:
```javascript
keys: ["Tune Title", "Genre", "Rhythm", "Key", "Mode"]
```

Session tunes use simpler array filtering (no Fuse.js).

### Testing Approach

Tests located in `__tests__/` directories adjacent to source files:
- `src/services/__tests__/` for service layer tests
- `src/pages/__tests__/` for page component tests
- Use React Testing Library for component tests

### Firebase Environment Setup

Required environment variables in `.env`:
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

### Drag and Drop

DND Kit library used for playlist/tune reordering:
- `@dnd-kit/core` for core functionality
- `@dnd-kit/sortable` for sortable lists
- Used in tune version ordering feature (tunePreferences)
