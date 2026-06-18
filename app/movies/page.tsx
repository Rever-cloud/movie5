"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { useSearchParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import {
  getPopularMovies,
  getMoviesByGenre,
  getMovieGenres,
  type Movie,
  type Genre,
  type ApiResponse,
} from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { SkeletonGrid } from "@/components/LoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "release", label: "Release Date" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

function sortMovies(movies: Movie[], sort: SortOption): Movie[] {
  const sorted = [...movies];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.vote_average - a.vote_average);
    case "release":
      return sorted.sort(
        (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    default:
      return sorted;
  }
}

function MoviesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialGenre = searchParams.get("genre");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    initialGenre ? parseInt(initialGenre, 10) : null
  );
  const [sort, setSort] = useState<SortOption>("popularity");
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleGenreSelect = useCallback((genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
    setAllMovies([]);
    setHasMore(true);
    if (genreId) {
      router.push(`/movies?genre=${genreId}`, { scroll: false });
    } else {
      router.push("/movies", { scroll: false });
    }
  }, [router]);

  const key = selectedGenre
    ? `genre-${selectedGenre}-${page}`
    : `popular-${page}`;

  const { data, error, isValidating } = useSWR<ApiResponse<Movie>>(
    key,
    () =>
      selectedGenre
        ? getMoviesByGenre(selectedGenre)
        : getPopularMovies(page),
    { revalidateOnFocus: false, revalidateIfStale: false }
  );

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllMovies(data.results);
      } else {
        setAllMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMovies = data.results.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMovies];
        });
      }
      setHasMore(data.page < data.total_pages);
      setLoadingMore(false);
    }
  }, [data, page]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore && !isValidating) {
        setLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loadingMore, isValidating]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  const sortedMovies = sortMovies(allMovies, sort);

  if (error) {
    return (
      <div className="pt-24">
        <ErrorFallback error={error} reset={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">
          {selectedGenre ? "Browse Movies" : "All Movies"}
        </h1>
        <div className="mb-6">
          <GenreFilter selectedGenre={selectedGenre} onSelect={handleGenreSelect} />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-sm text-gray-400 font-medium">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-dark-800 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Sort movies"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isValidating && page === 1 ? (
        <SkeletonGrid count={18} />
      ) : sortedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
          <p className="text-gray-400">Try selecting a different genre.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div ref={loadMoreRef} className="h-10 mt-8">
            {loadingMore && (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!hasMore && allMovies.length > 0 && (
              <p className="text-center text-gray-500 text-sm">You've reached the end</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <SkeletonGrid count={18} />
      </div>
    }>
      <MoviesContent />
    </Suspense>
  );
}
