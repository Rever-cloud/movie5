"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useSWR from "swr";
import { searchMovies, type Movie, type ApiResponse } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { SkeletonGrid } from "@/components/LoadingSkeleton";

const RECENT_SEARCHES_KEY = "reverse-movie-hub-recent-searches";
const MAX_RECENT = 8;

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const recent = getRecentSearches().filter((s) => s !== query);
    recent.unshift(query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch {
    // ignore
  }
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const hasInit = useRef(false);

  useEffect(() => {
    if (!hasInit.current) {
      setRecentSearches(getRecentSearches());
      hasInit.current = true;
    }
  }, []);

  const { data, error, isValidating } = useSWR<ApiResponse<Movie>>(
    query.trim() ? `search-${query}` : null,
    () => searchMovies(query),
    { revalidateOnFocus: false, revalidateIfStale: false }
  );

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim()) {
      saveRecentSearch(q.trim());
      setRecentSearches(getRecentSearches());
    }
  }, []);

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const movies = data?.results || [];
  const showRecent = !query.trim() && recentSearches.length > 0;
  const showNoResults = query.trim() && !isValidating && !error && movies.length === 0;
  const showEmpty = !query.trim() && !showRecent;

  return (
    <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">Search Movies</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Recent Searches */}
      {showRecent && (
        <section className="mb-10" aria-label="Recent searches">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Searches</h2>
            <button
              onClick={handleClearRecent}
              className="text-sm text-gray-400 hover:text-accent-500 transition-colors"
              type="button"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-4 py-2 rounded-full glass bg-dark-800/60 border border-white/5 text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-all"
                type="button"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-20 h-20 text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">Search for your favorite movies</h3>
          <p className="text-gray-400">Find movies by title, genre, or keywords.</p>
        </div>
      )}

      {/* Loading */}
      {isValidating && query.trim() && (
        <SkeletonGrid count={12} />
      )}

      {/* Results */}
      {!isValidating && movies.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-6">
            Found {data?.total_results || movies.length} results for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {/* No results */}
      {showNoResults && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">
            No movies found for &ldquo;{query}&rdquo;
          </h3>
          <p className="text-gray-400">Try adjusting your search terms or browse our categories.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-400">Failed to search. Please try again.</p>
        </div>
      )}
    </div>
  );
}
