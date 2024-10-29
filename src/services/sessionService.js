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
