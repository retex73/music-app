const BASE_URL = "https://thesession.org";

export const getSessionTuneById = async (tuneId) => {
  try {
    const response = await fetch(`${BASE_URL}/tunes/${tuneId}?format=json`);
    if (!response.ok) {
      throw new Error("Failed to fetch tune details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session tune details:", error);
    throw error;
  }
};

export const searchSessionTunes = async (searchTerm) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tunes/search?q=${searchTerm}&format=json`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tunes");
    }
    const data = await response.json();
    return data.tunes || [];
  } catch (error) {
    console.error("Error searching session tunes:", error);
    throw error;
  }
};
