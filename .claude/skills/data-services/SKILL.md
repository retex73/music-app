# Data Services Skill

## Purpose
Service layer patterns for data management in the music-app project.

## Service Pattern
```javascript
// src/services/tunesService.js
let tunesData = [];
let initialized = false;

export const initializeTunesData = async () => {
  if (initialized) return tunesData;

  const response = await fetch('/data/tunes_data.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        tunesData = results.data;
        initialized = true;
        resolve(tunesData);
      },
      error: reject
    });
  });
};

export const getAllTunes = () => tunesData;

export const getTuneById = (id) => {
  return tunesData.find(tune => tune['Tune No.'] === id);
};
```

## Best Practices
✅ Cache data in module scope
✅ Initialize once, reuse
✅ Handle errors properly
✅ Export functions, not data
❌ Don't expose internal state
❌ Don't initialize on import
