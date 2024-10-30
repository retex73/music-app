const CACHE_PREFIX = "music_app_";

/**
 * Gets cached data for a specific key
 * @param {string} key - The cache key
 * @returns {any} The cached data or null if not found
 */
export const getCachedData = (key) => {
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error getting cached data:", error);
    return null;
  }
};

/**
 * Sets cached data for a specific key
 * @param {string} key - The cache key
 * @param {any} data - The data to cache
 */
export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    console.error("Error setting cached data:", error);
  }
};

/**
 * Removes an item from localStorage
 * @param {string} key - The cache key
 */
export const removeCacheItem = (key) => {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error("Error removing cache item:", error);
  }
};

/**
 * Clears all cached items with the app prefix
 */
export const clearCache = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};
