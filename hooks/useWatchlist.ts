"use client";

import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/lib/api";

const WATCHLIST_KEY = "reverse-movie-hub-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((movies: Movie[]) => {
    setWatchlist(movies);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(movies));
  }, []);

  const addToWatchlist = useCallback(
    (movie: Movie) => {
      if (!watchlist.find((m) => m.id === movie.id)) {
        persist([...watchlist, movie]);
      }
    },
    [watchlist, persist]
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) => {
      persist(watchlist.filter((m) => m.id !== movieId));
    },
    [watchlist, persist]
  );

  const isInWatchlist = useCallback(
    (movieId: number) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
