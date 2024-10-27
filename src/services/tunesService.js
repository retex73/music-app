import Papa from "papaparse";
import Fuse from "fuse.js";

let tunesData = null;
let fuseInstance = null;

const fuseOptions = {
  keys: ["Tune Title", "Genre", "Rhythm", "Key", "Mode"],
  threshold: 0.3,
  includeScore: true,
};

export const initializeTunesData = async () => {
  try {
    const response = await fetch("/data/tunes_data.csv");
    const csvText = await response.text();

    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    tunesData = results.data;
    fuseInstance = new Fuse(tunesData, fuseOptions);
    return tunesData;
  } catch (error) {
    console.error("Error loading tunes data:", error);
    return [];
  }
};

export const searchTunes = (query) => {
  if (!query) return [];

  if (!fuseInstance) return [];

  const results = fuseInstance.search(query);

  const mappedResults = results.map((result) => result.item);

  return mappedResults;
};

export const getTuneById = async (tuneId) => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${tuneId}`
    );
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error("Error fetching tune details:", error);
    throw error;
  }
};
