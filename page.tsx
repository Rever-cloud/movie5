"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getAwardWinners,
  getDocumentaries,
  getFamilyMovies,
  getImageUrl,
  type Movie,
  type ApiResponse,
} from "@/lib/api";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { SkeletonHero, SkeletonRow } from "@/components/LoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";
import ContinueWatching from "@/components/ContinueWatching";
import Link from "next/link";

function useMovieData<T>(fetcherFn: () => Promise<T>, key: string) {
  return useSWR<T>(key, fetcherFn, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-accent-500 hover:text-accent-400 font-medium transition-colors flex items-center gap-1"
    >
      {label}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function HomePage() {
  const { data: trending, error: trendingError, isValidating: trendingLoading } = useMovieData(getTrendingMovies, "trending-movies");
  const { data: popular, error: popularError, isValidating: popularLoading } = useMovieData(() => getPopularMovies(1), "popular-movies");
  const { data: topRated, error: topRatedError, isValidating: topRatedLoading } = useMovieData(getTopRatedMovies, "top-rated-movies");
  const { data: upcoming, error: upcomingError, isValidating: upcomingLoading } = useMovieData(getUpcomingMovies, "upcoming-movies");
  const { data: awards, error: awardsError, isValidating: awardsLoading } = useMovieData(getAwardWinners, "award-winners");
  const { data: docs, error: docsError, isValidating: docsLoading } = useMovieData(getDocumentaries, "documentaries");
  const { data: family, error: familyError, isValidating: familyLoading } = useMovieData(getFamilyMovies, "family-movies");

  const hasError = trendingError || popularError || topRatedError || upcomingError;
  const reset = useCallback(() => window.location.reload(), []);

  if (hasError) {
    return <ErrorFallback error={hasError as Error} reset={reset} />;
  }

  const trendingMovies = trending?.results?.slice(0, 10) || [];
  const popularMovies = popular?.results?.slice(0, 10) || [];
  const topRatedMovies = topRated?.results?.slice(0, 10) || [];
  const upcomingMovies = upcoming?.results?.slice(0, 10) || [];
  const awardMovies = awards?.results?.slice(0, 6) || [];
  const docMovies = docs?.results?.slice(0, 6) || [];
  const familyMovies = family?.results?.slice(0, 6) || [];

  const collections = [
    { title: "Award Winners", movies: awardMovies, bg: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/30", loading: awardsLoading },
    { title: "Documentaries", movies: docMovies, bg: "from-blue-500/20 to-cyan-600/20", border: "border-blue-500/30", loading: docsLoading },
    { title: "Family Movies", movies: familyMovies, bg: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/30", loading: familyLoading },
  ];

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      {trendingLoading ? <SkeletonHero /> : <HeroBanner movies={trendingMovies.slice(0, 5)} />}

      {/* Continue Watching */}
      <div className="mt-8">
        <ContinueWatching />
      </div>

      {/* Movie Rows */}
      <div className="px-4 md:px-8 lg:px-16 space-y-10 mt-8">
        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          isLoading={trendingLoading}
          linkHref="/movies"
        />
        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
          isLoading={popularLoading}
        />
        <MovieRow
          title="Top Rated"
          movies={topRatedMovies}
          isLoading={topRatedLoading}
        />
        <MovieRow
          title="Upcoming Releases"
          movies={upcomingMovies}
          isLoading={upcomingLoading}
        />
      </div>

      {/* Featured Collections */}
      <section className="px-4 md:px-8 lg:px-16 mt-16" aria-label="Featured collections">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.title}
              href="/movies"
              className={`relative overflow-hidden rounded-2xl p-6 min-h-[200px] bg-gradient-to-br ${col.bg} border ${col.border} card-hover group`}
              aria-label={`Browse ${col.title}`}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">{col.title}</h3>
                {col.loading ? (
                  <div className="h-4 shimmer rounded w-24" />
                ) : (
                  <p className="text-sm text-gray-300">
                    {col.movies.length} movies
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  Browse Collection
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              {/* Decorative gradient blob */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
