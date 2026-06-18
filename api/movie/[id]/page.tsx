"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import {
  getMovieById,
  getMovieCast,
  getMovieVideos,
  getMovieReviews,
  getSimilarMovies,
  getMovieRecommendations,
  getImageUrl,
  type Movie,
  type CastMember,
  type Video,
  type Review,
  type ApiResponse,
} from "@/lib/api";
import MovieRow from "@/components/MovieRow";
import { WatchlistButton } from "@/components/WatchlistButton";
import { SkeletonRow } from "@/components/LoadingSkeleton";

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movieId = parseInt(id, 10);

  const { data: movie, error: movieError, isValidating: movieLoading } = useSWR(
    `movie-${movieId}`,
    () => getMovieById(movieId),
    { revalidateOnFocus: false }
  );

  const { data: castData } = useSWR(
    movie ? `cast-${movieId}` : null,
    () => getMovieCast(movieId),
    { revalidateOnFocus: false }
  );

  const { data: videosData } = useSWR(
    movie ? `videos-${movieId}` : null,
    () => getMovieVideos(movieId),
    { revalidateOnFocus: false }
  );

  const { data: similar } = useSWR(
    movie ? `similar-${movieId}` : null,
    () => getSimilarMovies(movieId),
    { revalidateOnFocus: false }
  );

  const { data: recommendations } = useSWR(
    movie ? `recommend-${movieId}` : null,
    () => getMovieRecommendations(movieId),
    { revalidateOnFocus: false }
  );

  if (movieLoading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="w-full h-[60vh] shimmer" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          <div className="h-10 shimmer rounded w-96" />
          <div className="h-4 shimmer rounded w-2/3" />
          <div className="h-4 shimmer rounded w-1/2" />
        </div>
        <div className="mt-12 px-4 md:px-8 lg:px-16">
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold transition-all">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const trailer = videosData?.results?.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube"
  );
  const cast = castData?.cast?.slice(0, 12) || [];
  const similarMovies = similar?.results?.slice(0, 10) || [];
  const recommendedMovies = recommendations?.results?.slice(0, 10) || [];

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop Banner */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <img src={backdropUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-dark-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-40 sm:-mt-48 lg:-mt-56 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 gradient-border">
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg text-gray-400 italic mb-4">{movie.tagline}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {movie.vote_average > 0 && (
                <span className="rating-badge px-2.5 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.release_date && (
                <span className="text-sm text-gray-400">{formatDate(movie.release_date)}</span>
              )}
              {movie.runtime != null && movie.runtime > 0 && (
                <span className="text-sm text-gray-400">{formatRuntime(movie.runtime)}</span>
              )}
              {movie.vote_count > 0 && (
                <span className="text-sm text-gray-500">({movie.vote_count} votes)</span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/movies?genre=${genre.id}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-glass border border-glass-border text-gray-300 hover:bg-glass-hover hover:text-white transition-all"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 max-w-3xl">
              {movie.overview}
            </p>

            {/* Watchlist Button */}
            <WatchlistButton movie={movie} />
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mt-12" aria-label="Cast">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {cast.map((member: CastMember) => (
                <div key={member.id} className="flex-shrink-0 w-[120px] text-center">
                  <div className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden bg-dark-800 mb-2">
                    <img
                      src={getImageUrl(member.profile_path, "w200")}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-medium text-white truncate">{member.name}</p>
                  <p className="text-xs text-gray-400 truncate">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer */}
        {trailer && (
          <section className="mt-12" aria-label="Trailer">
            <h2 className="text-2xl font-bold text-white mb-6">Trailer</h2>
            <div className="aspect-video rounded-2xl overflow-hidden bg-dark-800">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Similar Movies" movies={similarMovies} />
          </div>
        )}

        {/* Recommended Movies */}
        {recommendedMovies.length > 0 && (
          <div className="mt-10">
            <MovieRow title="You Might Also Like" movies={recommendedMovies} />
          </div>
        )}
      </div>
    </div>
  );
}
