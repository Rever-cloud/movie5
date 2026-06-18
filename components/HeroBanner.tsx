"use client";

import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/lib/api";
import { getImageUrl } from "@/lib/api";
import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlist";

interface HeroBannerProps {
  movies: Movie[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const movie = movies[currentIndex];
  const { addToWatchlist, isInWatchlist } = useWatchlist();

  const goToNext = useCallback(() => {
    if (movies.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setIsTransitioning(false);
    }, 300);
  }, [movies.length]);

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext, movies.length]);

  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const rating = movie.vote_average?.toFixed(1);
  const overview =
    movie.overview?.length > 200
      ? movie.overview.slice(0, 200) + "..."
      : movie.overview;

  const handleAddToWatchlist = () => {
    if (!isInWatchlist(movie.id)) {
      addToWatchlist(movie);
    }
  };

  return (
    <section
      aria-label="Featured movie hero"
      className="relative w-full h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-500">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div
            className={`max-w-2xl transition-all duration-500 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {rating && (
                <span
                  className="rating-badge px-2.5 py-1 rounded-md text-sm font-bold flex items-center gap-1"
                  aria-label={`Rating: ${rating} out of 10`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {rating}
                </span>
              )}
              {releaseYear && (
                <span className="text-sm text-gray-400 font-medium">
                  {releaseYear}
                </span>
              )}
              {movie.genres &&
                movie.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="text-xs px-3 py-1 rounded-full bg-glass text-gray-300 border border-glass-border"
                  >
                    {genre.name}
                  </span>
                ))}
            </div>

            {/* Overview */}
            <p className="text-base sm:text-lg text-gray-300 line-clamp-2 mb-6 leading-relaxed">
              {overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={`/movie/${movie.id}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40"
                aria-label={`Watch ${movie.title} now`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Watch Now
              </Link>
              <button
                type="button"
                onClick={handleAddToWatchlist}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl glass hover:bg-glass-hover text-white font-semibold text-sm sm:text-base transition-all duration-200 border border-glass-border"
                aria-label={
                  isInWatchlist(movie.id)
                    ? "Remove from watchlist"
                    : "Add to watchlist"
                }
              >
                <svg
                  className="w-5 h-5"
                  fill={isInWatchlist(movie.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isInWatchlist(movie.id)
                  ? "In Watchlist"
                  : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(idx);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-accent-500"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent z-10" />
    </section>
  );
}