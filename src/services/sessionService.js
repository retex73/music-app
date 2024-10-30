import { getCachedData, setCachedData } from "../utils/cacheUtils";

const BASE_URL = "https://thesession.org";

export const getSessionTuneById = async (tuneId) => {
  const cacheKey = `tune_${tuneId}`;
  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`${BASE_URL}/tunes/${tuneId}?format=json`);
    if (!response.ok) {
      throw new Error("Failed to fetch tune details");
    }
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching session tune details:", error);
    throw error;
  }
};

export const searchSessionTunes = async (searchTerm) => {
  const cacheKey = `search_${searchTerm.toLowerCase().trim()}`;
  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/tunes/search?q=${searchTerm}&format=json`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tunes");
    }
    const data = await response.json();
    const tunes = data.tunes || [];
    setCachedData(cacheKey, tunes);
    return tunes;
  } catch (error) {
    console.error("Error searching session tunes:", error);
    throw error;
  }
};
