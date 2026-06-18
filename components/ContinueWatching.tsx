"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/lib/api";
import MovieCard from "./MovieCard";

export default function ContinueWatching() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("reverse-movie-hub-watchlist");
      if (stored) {
        const parsed: Movie[] = JSON.parse(stored);
        setMovies(parsed.slice(0, 6));
      }
    } catch {
      // ignore
    }
  }, []);

  if (movies.length === 0) return null;

  return (
    <section className="px-4 md:px-8 lg:px-16 mb-12" aria-label="Continue watching">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <svg className="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        Continue Watching
      </h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-[180px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
