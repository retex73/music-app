# CSV Processing Skill

## Purpose
Master CSV data loading and parsing using PapaParse library for the music-app's tune catalogs.

## PapaParse Integration

### Basic CSV Loading
```javascript
import Papa from 'papaparse';

let tunesData = [];

export const initializeTunesData = async () => {
  if (tunesData.length > 0) return tunesData;

  const response = await fetch('/data/tunes_data.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        tunesData = results.data;
        resolve(tunesData);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
};

export const getAllTunes = () => tunesData;
```

### PapaParse Configuration
```javascript
Papa.parse(csvText, {
  header: true,           // First row as keys
  skipEmptyLines: true,   // Ignore blank lines
  dynamicTyping: true,    // Auto-convert numbers
  transformHeader: (h) => h.trim(), // Clean headers
  transform: (value) => value.trim(), // Clean values
  complete: (results) => {
    // results.data - parsed data array
    // results.errors - any parse errors
    // results.meta - metadata
  }
});
```

## Data Structures

### Hatao Tunes CSV
```csv
Set No.,Tune No.,Tune Title,Learning Video,Genre,Added,Rhythm,Key,Mode,Part
1,1,The Butterfly,https://youtube.com/...,Irish Traditional,2023-01-15,Slip Jig,Em,Minor,A
```

### The Session Tunes CSV
```csv
tune_id,setting_id,name,type,meter,mode,abc,date,username
1,12345,The Butterfly,slip jig,9/8,Emin,"X:1\nT:The Butterfly...",2023-01-15,user123
```

## Service Layer Pattern

### Tune Service
```javascript
// src/services/tunesService.js
import Papa from 'papaparse';

let tunesData = [];
let fuseInstance = null;

export const initializeTunesData = async () => {
  if (tunesData.length > 0) {
    return tunesData;
  }

  try {
    const response = await fetch('/data/tunes_data.csv');
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Validate data
          if (!results.data || results.data.length === 0) {
            reject(new Error('No data in CSV'));
            return;
          }

          tunesData = results.data;

          // Initialize search index
          fuseInstance = new Fuse(tunesData, {
            keys: ['Tune Title', 'Genre', 'Rhythm', 'Key'],
            threshold: 0.3
          });

          resolve(tunesData);
        },
        error: (error) => {
          console.error('CSV parse error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
};

export const getAllTunes = () => tunesData;

export const getTuneById = (id) => {
  return tunesData.find(tune => tune['Tune No.'] === id);
};
```

## Best Practices

✅ **Do:**
- Cache parsed data in module variable
- Validate CSV structure after parsing
- Handle parse errors gracefully
- Use header: true for object output
- Initialize data before use

❌ **Don't:**
- Parse CSV on every component render
- Forget error handling
- Assume CSV is well-formed
- Load large CSVs without progress feedback
- Parse synchronously (blocks UI)

## Data Validation

```javascript
function validateTuneData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid CSV data: empty or not an array');
  }

  const requiredFields = ['Tune Title', 'Tune No.'];
  const firstRow = data[0];

  for (const field of requiredFields) {
    if (!(field in firstRow)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return true;
}

// Usage
Papa.parse(csvText, {
  complete: (results) => {
    try {
      validateTuneData(results.data);
      tunesData = results.data;
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }
});
```

## Performance Optimization

### Lazy Loading
```javascript
// Load CSV only when needed
export const getTunes = async () => {
  if (tunesData.length === 0) {
    await initializeTunesData();
  }
  return tunesData;
};
```

### Web Worker (for large CSVs)
```javascript
// csv-worker.js
import Papa from 'papaparse';

self.onmessage = (e) => {
  const csvText = e.data;

  Papa.parse(csvText, {
    header: true,
    complete: (results) => {
      self.postMessage({ data: results.data });
    },
    error: (error) => {
      self.postMessage({ error: error.message });
    }
  });
};

// Usage
const worker = new Worker('csv-worker.js');
worker.postMessage(csvText);
worker.onmessage = (e) => {
  if (e.data.error) {
    console.error(e.data.error);
  } else {
    setTunes(e.data.data);
  }
};
```

## Common Issues

**Issue:** CSV not loading
**Solution:** Check file path (/data/ in public folder), verify fetch works

**Issue:** Headers not parsed correctly
**Solution:** Ensure `header: true`, check CSV has header row

**Issue:** Data types wrong (strings instead of numbers)
**Solution:** Use `dynamicTyping: true` option

**Issue:** Blank rows in data
**Solution:** Use `skipEmptyLines: true`

## Project Usage

- **Hatao Tunes**: `/data/tunes_data.csv` → `tunesService.js`
- **Session Tunes**: `/data/session_tunes_data.csv` → `sessionService.js`
- Both use same PapaParse pattern
- CSV files in `/public/data/` for static hosting
