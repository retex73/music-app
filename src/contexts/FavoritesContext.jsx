import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { favouritesService } from "../services/favouritesService";

const FavoritesContext = createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
  const { currentUser } = useAuth();
  const [hataoFavorites, setHataoFavorites] = useState([]);
  const [sessionFavorites, setSessionFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (currentUser) {
        const [hataoData, sessionData] = await Promise.all([
          favouritesService.getFavorites(currentUser.uid, "hatao"),
          favouritesService.getFavorites(currentUser.uid, "session"),
        ]);

        setHataoFavorites(hataoData);
        setSessionFavorites(sessionData);
      } else {
        // If not logged in, try to get from localStorage for backwards compatibility
        const hataoData = JSON.parse(localStorage.getItem("favorites")) || [];
        const sessionData =
          JSON.parse(localStorage.getItem("sessionfavourites")) || [];
        setHataoFavorites(hataoData);
        setSessionFavorites(sessionData);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [currentUser]);

  const toggleFavorite = async (tuneId, type = "hatao") => {
    const favorites = type === "hatao" ? hataoFavorites : sessionFavorites;
    const setFavorites =
      type === "hatao" ? setHataoFavorites : setSessionFavorites;
    const storageKey = type === "hatao" ? "favorites" : "sessionfavourites";

    const isFavorite = favorites.includes(tuneId);

    if (currentUser) {
      const success = isFavorite
        ? await favouritesService.removeFavorite(currentUser.uid, tuneId, type)
        : await favouritesService.addFavorite(currentUser.uid, tuneId, type);

      if (success) {
        setFavorites((prev) =>
          isFavorite ? prev.filter((id) => id !== tuneId) : [...prev, tuneId]
        );
      }
    } else {
      // Fallback to localStorage if not logged in
      const newFavorites = isFavorite
        ? favorites.filter((id) => id !== tuneId)
        : [...favorites, tuneId];

      setFavorites(newFavorites);
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
    }
  };

  const value = {
    hataoFavorites,
    sessionFavorites,
    toggleFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
