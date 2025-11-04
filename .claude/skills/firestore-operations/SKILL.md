# Firestore Operations Skill

## Purpose
Master Firestore database operations including CRUD, real-time listeners, and data modeling for the music-app project.

## Collections Structure

```
favorites/{userId}
  └── { hatao: [ids...], thesession: [ids...] }

tunePreferences/{userId_tuneId}
  └── { userId, tuneId, versionOrder: [ids...], updatedAt }
```

## Core Patterns

### Read Operations
```javascript
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// Get single document
const docRef = doc(db, 'favorites', userId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const data = docSnap.data();
} else {
  // Document doesn't exist
}

// Query collection
const q = query(
  collection(db, 'tunePreferences'),
  where('userId', '==', userId)
);
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});
```

### Write Operations
```javascript
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Create/overwrite document
await setDoc(doc(db, 'favorites', userId), {
  hatao: [tuneId1, tuneId2],
  thesession: []
});

// Update specific fields
await updateDoc(doc(db, 'favorites', userId), {
  'hatao': arrayUnion(newTuneId) // Add to array
});

// Delete document
await deleteDoc(doc(db, 'favorites', userId));
```

### Real-Time Listeners
```javascript
import { onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(
    doc(db, 'favorites', userId),
    (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().hatao || []);
      }
    },
    (error) => {
      console.error('Listener error:', error);
    }
  );

  // Clean up listener
  return () => unsubscribe();
}, [userId]);
```

### Service Layer Pattern
```javascript
// src/services/favouritesService.js
export const getFavorites = async (userId, source = 'hatao') => {
  try {
    const docRef = doc(db, 'favorites', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data()[source] || []) : [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const addFavorite = async (userId, tuneId, source = 'hatao') => {
  try {
    const docRef = doc(db, 'favorites', userId);
    const docSnap = await getDoc(docRef);

    let data = docSnap.exists() ? docSnap.data() : {};
    if (!data[source]) data[source] = [];

    if (!data[source].includes(tuneId)) {
      data[source].push(tuneId);
      await setDoc(docRef, data);
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};
```

## Best Practices

✅ **Do:**
- Wrap operations in try-catch
- Validate data before writing
- Clean up onSnapshot listeners
- Use batch writes for multiple updates
- Check user authentication before operations

❌ **Don't:**
- Forget error handling
- Leave listeners running
- Write without validation
- Query without limits (for large datasets)
- Store sensitive data unencrypted

## Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Common Issues

**Issue:** Permission denied errors
**Solution:** Check security rules and user authentication

**Issue:** Data not syncing in real-time
**Solution:** Verify onSnapshot setup and cleanup

**Issue:** Writes failing silently
**Solution:** Add try-catch and log errors
