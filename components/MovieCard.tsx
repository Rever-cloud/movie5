"use client";

import type { Movie } from "@/lib/api";
import { getImageUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const rating = movie.vote_average?.toFixed(1);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block w-full aspect-[2/3] rounded-xl overflow-hidden card-hover gradient-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      aria-label={`View details for ${movie.title}`}
    >
      {/* Poster image */}
      <Image
        src={posterUrl}
        alt={movie.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/95 via-dark-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          {rating && (
            <span className="rating-badge px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              <svg
                className="w-3 h-3"
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
            <span className="text-xs text-gray-300 font-medium">
              {releaseYear}
            </span>
          )}
        </div>

        {/* View details */}
        <span className="text-sm font-semibold text-white flex items-center gap-1">
          View Details
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
        </span>
      </div>

      {/* Bottom gradient always visible */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-950/80 to-transparent" />
    </Link>
  );
}