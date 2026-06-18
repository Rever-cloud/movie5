"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">My Watchlist</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-20 h-20 text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
          <p className="text-gray-400 mb-6">Start building your collection by adding movies you want to watch.</p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold transition-all duration-200 shadow-lg shadow-accent-500/25"
          >
            Browse Movies
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white">My Watchlist</h1>
        <button
          onClick={() => {
            watchlist.forEach((m) => removeFromWatchlist(m.id));
          }}
          className="px-4 py-2 rounded-lg glass border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-glass-hover transition-all"
          type="button"
          aria-label="Clear all watchlist items"
        >
          Clear All
        </button>
      </div>

      {/* Stats */}
      <p className="text-sm text-gray-400 mb-6">
        {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchlist.map((movie) => (
          <div key={movie.id} className="relative group">
            <MovieCard movie={movie} />
            <button
              onClick={() => removeFromWatchlist(movie.id)}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-dark-950/80 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-accent-500 hover:border-accent-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label={`Remove ${movie.title} from watchlist`}
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
