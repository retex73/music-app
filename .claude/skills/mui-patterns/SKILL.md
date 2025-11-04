# MUI Patterns Skill

## Purpose

Master Material-UI v6 component library usage, theming, and styling patterns specific to the music-app project. This skill covers dark theme implementation, responsive design, and Emotion-based styling.

## Scope

- MUI v6 component usage
- Dark theme configuration
- Emotion styling system (sx prop, styled components)
- Responsive design with breakpoints
- Icon integration
- Component composition patterns

## Key Concepts

### MUI v6 Features
- Emotion styling engine (replaces JSS)
- `sx` prop for inline styles (preferred)
- `styled()` function for custom components
- Theme-aware styling
- Responsive props and breakpoints

### Project Theme
- Dark theme by default
- Configured in `src/theme/darkTheme.js`
- Applied via `ThemeProvider` in App.jsx
- All components must respect theme colors

## Code Examples

### Basic Component with MUI
```javascript
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function ExampleComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // theme.spacing(2)
        p: 3,   // padding: theme.spacing(3)
        bgcolor: 'background.paper', // theme.palette.background.paper
        borderRadius: 1
      }}
    >
      <Typography variant="h4" color="text.primary">
        Title
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Box>
  );
}
```

### Responsive Design
```javascript
<Box
  sx={{
    // Mobile first approach
    display: 'flex',
    flexDirection: 'column',
    gap: 1,

    // Tablet (sm: 600px+)
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      gap: 2
    },

    // Desktop (md: 900px+)
    [theme.breakpoints.up('md')]: {
      gap: 3,
      p: 4
    }
  }}
>
  {/* Content */}
</Box>

// Or use responsive object syntax
<Typography
  variant="h4"
  sx={{
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    display: { xs: 'none', md: 'block' }
  }}
>
  Responsive Text
</Typography>
```

### Dark Theme Configuration
```javascript
// src/theme/darkTheme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue
    },
    secondary: {
      main: '#f48fb1', // Pink
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',   // Elevated surface
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase
        },
      },
    },
  },
});

export default darkTheme;
```

### Styled Components (Reusable)
```javascript
// src/components/shared/StyledPaper.jsx
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],

  // Hover effect
  '&:hover': {
    boxShadow: theme.shadows[6],
  },

  // Responsive padding
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export default StyledPaper;
```

### Icon Integration
```javascript
import {
  Favorite,
  FavoriteBorder,
  PlayArrow,
  Pause,
  Search,
  Menu,
  Close
} from '@mui/icons-material';

// Icon button
<IconButton
  onClick={handleClick}
  sx={{ color: 'primary.main' }}
>
  <Favorite />
</IconButton>

// Icon with text
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <PlayArrow />
  <Typography>Play Tune</Typography>
</Box>
```

### Grid Layout
```javascript
import { Grid, Box } from '@mui/material';

function TuneGrid({ tunes }) {
  return (
    <Grid container spacing={3}>
      {tunes.map(tune => (
        <Grid item xs={12} sm={6} md={4} key={tune.id}>
          <TuneCard tune={tune} />
        </Grid>
      ))}
    </Grid>
  );
}
```

### Forms and Input
```javascript
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function FilterForm() {
  const [genre, setGenre] = useState('');

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Genre</InputLabel>
        <Select
          value={genre}
          label="Genre"
          onChange={(e) => setGenre(e.target.value)}
        >
          <MenuItem value="irish">Irish Traditional</MenuItem>
          <MenuItem value="scottish">Scottish</MenuItem>
          <MenuItem value="bluegrass">Bluegrass</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
```

### Modal Pattern
```javascript
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CustomModal({ open, onClose, title, children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" mb={2}>{title}</Typography>
        {children}
      </Box>
    </Modal>
  );
}
```

## Best Practices

### ✅ Do

1. **Use `sx` prop for inline styles**
```javascript
<Box sx={{ p: 2, bgcolor: 'background.paper' }} />
```

2. **Use theme palette colors**
```javascript
<Typography sx={{ color: 'text.primary' }} />
```

3. **Use spacing function**
```javascript
sx={{ gap: 2 }}  // theme.spacing(2) = 16px
```

4. **Responsive design**
```javascript
sx={{ display: { xs: 'none', md: 'block' } }}
```

5. **Extract reusable styled components**
```javascript
const StyledCard = styled(Card)(({ theme }) => ({ ... }));
```

### ❌ Don't

1. **Don't use inline styles**
```javascript
<Box style={{ padding: '16px' }} /> // Wrong!
```

2. **Don't hardcode colors**
```javascript
<Box sx={{ color: '#fff' }} /> // Wrong!
```

3. **Don't mix styling approaches**
```javascript
// Pick one: sx prop OR styled component, not both
```

4. **Don't forget responsive design**
```javascript
<Box sx={{ width: '800px' }} /> // Wrong! Not responsive
```

5. **Don't ignore theme**
```javascript
<Box sx={{ padding: '20px' }} /> // Wrong! Use spacing units
```

## Common Patterns from Project

### NavBar Pattern
```javascript
<AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Music App
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

### Card Pattern
```javascript
<Card
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3
    }
  }}
>
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography variant="h6">{tune.title}</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">View</Button>
  </CardActions>
</Card>
```

## Integration Points

- **React Components**: All UI components use MUI
- **Theme Provider**: App.jsx wraps everything in ThemeProvider
- **Responsive Design**: Mobile-first breakpoints throughout
- **Icons**: @mui/icons-material for all icons

## Common Issues

### Issue: Colors not updating with theme
**Solution**: Use theme palette paths, not hardcoded colors
```javascript
// Wrong
sx={{ color: '#fff' }}

// Right
sx={{ color: 'text.primary' }}
```

### Issue: Spacing inconsistent
**Solution**: Use theme.spacing (via numeric sx values)
```javascript
// Wrong
sx={{ padding: '16px' }}

// Right
sx={{ p: 2 }} // = theme.spacing(2) = 16px
```

### Issue: Components not responsive
**Solution**: Use breakpoint syntax
```javascript
sx={{
  width: { xs: '100%', md: '50%' },
  display: { xs: 'block', sm: 'flex' }
}}
```

## Version Notes

- **MUI v6**: Uses Emotion (not JSS)
- **Breaking changes from v5**: Minimal, mostly internal
- **sx prop**: Preferred over makeStyles (deprecated)
- **styled()**: For complex, reusable components

## Resources

- MUI v6 Documentation: https://mui.com/
- Theme configuration: src/theme/darkTheme.js
- Shared components: src/components/shared/
- Project examples: src/components/*, src/pages/*
