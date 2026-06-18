"use client";

import useSWR from "swr";
import { getMovieGenres, type Genre } from "@/lib/api";

interface GenreFilterProps {
  selectedGenre: number | null;
  onSelect: (genreId: number | null) => void;
}

export default function GenreFilter({ selectedGenre, onSelect }: GenreFilterProps) {
  const { data: genresData, error, isLoading } = useSWR<Genre[]>(
    "movie-genres",
    () => getMovieGenres()
  );

  const genres = genresData || [];

  if (error) {
    return null;
  }

  return (
    <div className="w-full" role="group" aria-label="Filter by genre">
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex items-center gap-2 pb-2">
          {/* All option */}
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedGenre === null
                ? "bg-accent-500 text-white shadow-lg shadow-accent-500/25"
                : "glass bg-[#1a1a2e]/60 text-gray-300 hover:bg-dark-700 border border-white/10"
            }`}
            aria-pressed={selectedGenre === null}
            aria-label="Show all genres"
          >
            All
          </button>

          {/* Genre chips */}
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-dark-800 animate-pulse shimmer w-20 h-9"
                />
              ))
            : genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => onSelect(genre.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedGenre === genre.id
                      ? "bg-accent-500 text-white shadow-lg shadow-accent-500/25"
                      : "glass bg-[#1a1a2e]/60 text-gray-300 hover:bg-dark-700 border border-white/10"
                  }`}
                  aria-pressed={selectedGenre === genre.id}
                  aria-label={`Filter by ${genre.name}`}
                >
                  {genre.name}
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}
