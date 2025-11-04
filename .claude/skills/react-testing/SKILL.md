# React Testing Skill

## Purpose
Master React Testing Library patterns for testing components, hooks, and user interactions in the music-app project.

## Core Testing Patterns

### Component Test Template
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from '../../theme/darkTheme';
import TuneSummaryCard from '../TuneSummaryCard';

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('TuneSummaryCard', () => {
  const mockTune = {
    id: '1',
    'Tune Title': 'The Butterfly',
    'Rhythm': 'Slip Jig',
    'Key': 'Em'
  };

  test('renders tune information', () => {
    renderWithProviders(<TuneSummaryCard tune={mockTune} />);

    expect(screen.getByText('The Butterfly')).toBeInTheDocument();
    expect(screen.getByText(/Slip Jig/i)).toBeInTheDocument();
  });

  test('handles favorite button click', async () => {
    const user = userEvent.setup();
    const handleFavorite = jest.fn();

    renderWithProviders(
      <TuneSummaryCard tune={mockTune} onFavorite={handleFavorite} />
    );

    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    await user.click(favoriteButton);

    expect(handleFavorite).toHaveBeenCalledWith('1');
  });
});
```

### Async Testing
```javascript
test('loads data and displays it', async () => {
  renderWithProviders(<DataComponent />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  // Verify data displayed
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});

// Or use findBy queries (combines getBy + waitFor)
test('finds async element', async () => {
  renderWithProviders(<AsyncComponent />);

  const element = await screen.findByText('Async content');
  expect(element).toBeInTheDocument();
});
```

### Mocking Context
```javascript
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user', email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
    loading: false
  })
}));

jest.mock('../../contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    favorites: ['tune1', 'tune2'],
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: (id) => ['tune1', 'tune2'].includes(id)
  })
}));
```

### Testing Hooks
```javascript
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../AuthContext';
import { AuthProvider } from '../AuthContext';

test('useAuth provides user data', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });

  await waitFor(() => {
    expect(result.current.user).toBeDefined();
  });

  expect(result.current.login).toBeDefined();
  expect(result.current.logout).toBeDefined();
});
```

## Query Priorities

1. **getByRole** (Preferred) - Most accessible
2. **getByLabelText** - Forms
3. **getByPlaceholderText** - Inputs
4. **getByText** - Content
5. **getByTestId** - Last resort

```javascript
// Preferred
screen.getByRole('button', { name: /submit/i })

// Forms
screen.getByLabelText(/email/i)

// Content
screen.getByText(/welcome/i)

// Last resort
screen.getByTestId('custom-element')
```

## Best Practices

✅ **Do:**
- Test user behavior, not implementation
- Use userEvent over fireEvent
- Wait for async operations
- Mock external dependencies
- Clean up after tests

❌ **Don't:**
- Test implementation details
- Query by className or id
- Skip async waiting
- Leave test.only or test.skip
- Forget to clear mocks

## Common Patterns

### Testing Forms
```javascript
test('submits form with user input', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();

  renderWithProviders(<LoginForm onSubmit={handleSubmit} />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### Testing Navigation
```javascript
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

test('navigates to tune details', async () => {
  const router = createMemoryRouter([
    { path: '/', element: <HomePage /> },
    { path: '/tune/:id', element: <TuneDetailsPage /> }
  ]);

  render(<RouterProvider router={router} />);

  const user = userEvent.setup();
  await user.click(screen.getByText('The Butterfly'));

  expect(screen.getByText('Tune Details')).toBeInTheDocument();
});
```

## Test Organization

```
src/
├── components/
│   ├── NavBar.jsx
│   └── __tests__/
│       └── NavBar.test.jsx
└── services/
    ├── tunesService.js
    └── __tests__/
        └── tunesService.test.js
```

## Coverage Commands

```bash
# Run tests with coverage
npm test -- --coverage

# Run specific test
npm test -- NavBar.test.jsx

# Watch mode
npm test -- --watch
```
