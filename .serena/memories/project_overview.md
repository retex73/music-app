# Music App - Project Overview

## Project Type
React-based web application for music enthusiasts with Firebase backend

## Tech Stack
- **Frontend**: React 18.3.1, Material-UI v6, Emotion
- **Music Notation**: ABC.js (abcjs ^6.4.3)
- **Video**: React YouTube integration
- **UI/UX**: Material-UI, FontAwesome icons
- **Routing**: React Router v6
- **Search**: Fuse.js (fuzzy search)
- **Drag & Drop**: DND Kit (@dnd-kit/core, sortable, utilities)
- **Backend**: Firebase 11.0.2 (authentication, database)
- **Build**: Create React App (react-scripts 5.0.1)

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── HomePage/       # Home page specific components
│   ├── TheSessionTuneDetailsPage/  # Tune details components
│   └── shared/         # Shared components
├── contexts/           # React contexts (Auth, Favorites)
├── pages/              # Page components (routing)
├── services/           # Business logic & API services
├── config/             # Firebase configuration
└── theme/              # Material-UI theme configuration
```

## Key Features
1. Music notation display/editing (ABC.js)
2. YouTube video integration
3. Drag-and-drop playlist management
4. Search functionality (Fuse.js)
5. Firebase authentication & data storage
6. Material-UI modern interface
7. Favorites management system

## Current Branch
feature/fix-player-styling (clean working directory)

## Main Branch
main

## Recent Work
- Fixed unused variables (PR #27)
- Select favourite version feature (PR #25)
- Player styling fixes (current branch)