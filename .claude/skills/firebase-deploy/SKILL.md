# Firebase Deploy Skill

## Purpose
Firebase Hosting deployment and configuration for the music-app project.

## Deployment Process
```bash
# Build production bundle
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy with specific project
firebase use production
firebase deploy --only hosting
```

## firebase.json Configuration
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

## Environment Variables
```
# .env.production
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## Best Practices
✅ Always build before deploy
✅ Test locally with `npx serve -s build`
✅ Use project aliases for environments
✅ Deploy security rules separately
❌ Don't commit .env files
❌ Don't skip build step
