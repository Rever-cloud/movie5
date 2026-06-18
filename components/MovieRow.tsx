"use client";

import type { Movie } from "@/lib/api";
import MovieCard from "./MovieCard";
import Link from "next/link";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  linkHref?: string;
}

export default function MovieRow({
  title,
  movies,
  isLoading = false,
  linkHref,
}: MovieRowProps) {
  if (!isLoading && (!movies || movies.length === 0)) return null;

  return (
    <section className="relative group" aria-label={title}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          <div className="h-0.5 bg-gradient-to-r from-accent-500 to-accent-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left mt-1" />
        </div>
        {linkHref && (
          <Link
            href={linkHref}
            className="text-sm text-accent-500 hover:text-accent-400 font-medium transition-colors flex items-center gap-1"
            aria-label={`View all ${title}`}
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Scrollable row */}
      <div className="overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px]"
              >
                <div className="aspect-[2/3] rounded-xl bg-dark-800 animate-pulse shimmer" />
                <div className="mt-2 h-4 bg-dark-800 rounded animate-pulse shimmer w-3/4" />
                <div className="mt-1 h-3 bg-dark-800 rounded animate-pulse shimmer w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px]"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}