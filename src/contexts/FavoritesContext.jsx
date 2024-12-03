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
        // Reset favorites when user is not logged in
        setHataoFavorites([]);
        setSessionFavorites([]);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [currentUser]);

  const toggleFavorite = async (tuneId, type = "hatao") => {
    if (!currentUser) return; // Don't allow favoriting if not logged in

    const favorites = type === "hatao" ? hataoFavorites : sessionFavorites;
    const setFavorites =
      type === "hatao" ? setHataoFavorites : setSessionFavorites;
    const isFavorite = favorites.includes(tuneId);

    const success = isFavorite
      ? await favouritesService.removeFavorite(currentUser.uid, tuneId, type)
      : await favouritesService.addFavorite(currentUser.uid, tuneId, type);

    if (success) {
      setFavorites((prev) =>
        isFavorite ? prev.filter((id) => id !== tuneId) : [...prev, tuneId]
      );
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
