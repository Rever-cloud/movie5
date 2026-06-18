"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import type { Movie } from "@/lib/api";

interface WatchlistButtonProps {
  movie: Movie;
}

export function WatchlistButton({ movie }: WatchlistButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  return (
    <button
      onClick={() => (inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie))}
      aria-pressed={inList}
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
      className={`group relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
        inList
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
          : "glass text-white hover:bg-glass-hover border border-white/10"
      }`}
    >
      <span className="flex items-center gap-2">
        {inList ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            In Watchlist
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Watchlist
          </>
        )}
      </span>
    </button>
  );
}
