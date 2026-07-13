import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState({ teams: [], matches: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites({ teams: [], matches: [] });
      setLoading(false);
      return;
    }

    let active = true;

    const loadFavorites = async () => {
      try {
        setLoading(true);
        const response = await api.get("/favorites");
        if (active) setFavorites(response.data);
      } catch (error) {
        console.error(error);
        if (active) setFavorites({ teams: [], matches: [] });
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFavorites();
    return () => { active = false; };
  }, [isAuthenticated]);

  const favoriteIds = useMemo(
    () => ({
      team: new Set(favorites.teams.map((favorite) => favorite.externalId)),
      match: new Set(favorites.matches.map((favorite) => favorite.externalId)),
    }),
    [favorites]
  );

  const isFavorite = useCallback(
    (type, externalId) => favoriteIds[type]?.has(Number(externalId)) || false,
    [favoriteIds]
  );

  const toggleFavorite = useCallback(async (type, item) => {
    if (!isAuthenticated) {
      throw new Error("É necessário iniciar sessão.");
    }

    const externalId = Number(item.id);
    const collection = type === "team" ? "teams" : "matches";
    const exists = isFavorite(type, externalId);

    if (exists) {
      await api.delete(`/favorites/${type}/${externalId}`);
      setFavorites((current) => ({
        ...current,
        [collection]: current[collection].filter(
          (favorite) => favorite.externalId !== externalId
        ),
      }));
      return false;
    }

    const response = await api.post("/favorites", {
      type,
      externalId,
      data: item,
    });
    setFavorites((current) => ({
      ...current,
      [collection]: [
        response.data.favorite,
        ...current[collection].filter(
          (favorite) => favorite.externalId !== externalId
        ),
      ],
    }));
    return true;
  }, [isAuthenticated, isFavorite]);

  const value = useMemo(
    () => ({ favorites, isFavorite, loading, toggleFavorite }),
    [favorites, isFavorite, loading, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider.");
  return context;
}
