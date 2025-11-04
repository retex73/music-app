# Mock Patterns Skill

## Purpose
Mocking strategies for testing Firebase, Context API, and services.

## Context Mocking
```javascript
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user', email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn()
  })
}));
```

## Firebase Mocking
```javascript
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({ hatao: ['tune1'] })
  }),
  setDoc: jest.fn(),
  updateDoc: jest.fn()
}));
```

## Service Mocking
```javascript
jest.mock('../../services/tunesService', () => ({
  getTunes: jest.fn().mockResolvedValue([mockTune1, mockTune2]),
  searchTunes: jest.fn().mockReturnValue([mockTune1])
}));
```

## Best Practices
✅ Clear mocks between tests
✅ Mock external dependencies only
✅ Use mockResolvedValue for async
❌ Don't mock internal components
❌ Don't forget to reset mocks
