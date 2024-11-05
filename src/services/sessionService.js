import Papa from "papaparse";

let tunesData = null;

export const initializeSessionData = async () => {
  try {
    const response = await fetch("/data/session_tunes_data.csv");
    const csvText = await response.text();

    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    tunesData = results.data;
    return tunesData;
  } catch (error) {
    console.error("Error loading session tunes data:", error);
    return [];
  }
};

export const searchSessionTunes = async (query) => {
  if (!tunesData) {
    await initializeSessionData();
  }

  if (!query) return [];

  // Case insensitive search on name field
  const results = tunesData.filter((tune) =>
    tune.name.toLowerCase().includes(query.toLowerCase())
  );

  // Group by tune_id and take first setting
  const uniqueTunes = results.reduce((acc, tune) => {
    if (!acc[tune.tune_id]) {
      acc[tune.tune_id] = tune;
    }
    return acc;
  }, {});

  return Object.values(uniqueTunes);
};

export const getSessionTuneById = async (tuneId) => {
  if (!tunesData) {
    await initializeSessionData();
  }

  // Find all settings for this tune_id
  const settings = tunesData.filter(
    (tune) => tune.tune_id === tuneId.toString()
  );

  if (!settings.length) {
    throw new Error(`Tune with ID ${tuneId} not found`);
  }

  return settings;
};

export const getRandomTunes = async (count = 3) => {
  if (!tunesData) {
    await initializeSessionData();
  }

  // Create a map to store unique tunes by tune_id
  const uniqueTunes = new Map();

  // First pass to group by tune_id and take first setting
  tunesData.forEach((tune) => {
    if (!uniqueTunes.has(tune.tune_id)) {
      uniqueTunes.set(tune.tune_id, tune);
    }
  });

  // Convert to array and shuffle
  const allTunes = Array.from(uniqueTunes.values());
  const shuffled = allTunes.sort(() => 0.5 - Math.random());

  // Return requested number of tunes
  return shuffled.slice(0, count);
};
