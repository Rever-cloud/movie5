// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language?: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  popularity?: number;
  adult?: boolean;
  video?: boolean;
}

export interface TvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  origin_country: string[];
  original_language: string;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating?: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

// Normalize raw API movie object to our Movie type
function normalizeMovie(raw: Record<string, unknown>): Movie {
  return {
    id: raw.id as number,
    title: raw.title as string,
    overview: raw.overview as string,
    poster_path: (raw.poster_url || raw.poster_path || null) as string | null,
    backdrop_path: (raw.backdrop_url || raw.backdrop_path || null) as string | null,
    release_date: (raw.release_date as string) || "",
    vote_average: (raw.rating ?? raw.vote_average ?? 0) as number,
    vote_count: (raw.vote_count ?? 0) as number,
    original_language: (raw.original_language || "") as string,
    genre_ids: (raw.genre_ids || []) as number[],
    genres: raw.genres as Genre[] | undefined,
    runtime: raw.runtime as number | undefined,
    tagline: raw.tagline as string | undefined,
    status: raw.status as string | undefined,
    popularity: raw.popularity as number | undefined,
    adult: !!raw.adult,
  };
}

function normalizeCastMember(raw: Record<string, unknown>): CastMember {
  return {
    id: raw.id as number,
    name: raw.name as string,
    character: raw.character as string,
    profile_path: (raw.profile_url || raw.profile_path || null) as string | null,
  };
}

function normalizeVideo(raw: Record<string, unknown>): Video {
  return {
    id: (raw.id as string) || "",
    key: (raw.key || raw.youtube_key || "") as string,
    name: raw.name as string,
    site: (raw.site || "YouTube") as string,
    type: raw.type as string,
  };
}

// Wraps the actual fetch, unwraps { success, data } envelope, normalizes fields
async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();

  // Unwrap { success: true, data: ... } envelope
  const raw = json.data !== undefined ? json.data : json;

  return raw as T;
}

// ============ SWR FETCHER ============

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

// ============ LIST HELPERS ============

async function fetchMovieList<T = Movie>(url: string, normalizer?: (raw: Record<string, unknown>) => T): Promise<ApiResponse<T>> {
  const raw = await apiFetch<unknown[]>(url);
  const norm = normalizer || (normalizeMovie as unknown as (raw: Record<string, unknown>) => T);
  const results = (raw as Record<string, unknown>[]).map(norm);
  return { results, page: 1, total_pages: 1, total_results: results.length };
}

async function fetchSingleDetail<T = Movie>(url: string, normalizer: (raw: Record<string, unknown>) => T): Promise<T> {
  const raw = await apiFetch<Record<string, unknown>>(url);
  return normalizer(raw);
}

// ============ TRENDING ============

export async function getTrending(): Promise<ApiResponse<Movie | TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/trending`);
}

export async function getTrendingMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/trending/movies`);
}

export async function getTrendingTv(): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/trending/tv`);
}

// ============ SEARCH ============

export async function searchAll(query: string, page = 1): Promise<ApiResponse<Movie | TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&page=${page}`);
}

export async function searchMovies(query: string, page = 1): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/search/movies?q=${encodeURIComponent(query)}&page=${page}`);
}

export async function searchTv(query: string, page = 1): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/search/tv?q=${encodeURIComponent(query)}&page=${page}`);
}

// ============ GENRES ============

export async function getMovieGenres(): Promise<Genre[]> {
  return apiFetch<Genre[]>(`${API_BASE_URL}/api/genres/movies`);
}

export async function getTvGenres(): Promise<Genre[]> {
  return apiFetch<Genre[]>(`${API_BASE_URL}/api/genres/tv`);
}

// ============ MOVIES ============

export async function getPopularMovies(page = 1): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/popular?page=${page}`);
}

export async function getTopRatedMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/top-rated`);
}

export async function getNowPlayingMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/now-playing`);
}

export async function getUpcomingMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/upcoming`);
}

export async function getMovieById(id: number): Promise<Movie> {
  return fetchSingleDetail(`${API_BASE_URL}/api/movies/${id}`, normalizeMovie);
}

export async function getMovieCast(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  const raw = await apiFetch<{ cast: Record<string, unknown>[]; crew: Record<string, unknown>[] }>(
    `${API_BASE_URL}/api/movies/${id}/cast`
  );
  return {
    cast: (raw.cast || []).map(normalizeCastMember),
    crew: (raw.crew || []).map((c: Record<string, unknown>) => ({
      id: c.id as number,
      name: c.name as string,
      job: c.job as string,
      profile_path: (c.profile_url || c.profile_path || null) as string | null,
    })),
  };
}

export async function getMovieVideos(id: number): Promise<{ results: Video[] }> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${API_BASE_URL}/api/movies/${id}/videos`);
  return { results: (raw || []).map(normalizeVideo) };
}

export async function getMovieReviews(id: number): Promise<ApiResponse<Review>> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${API_BASE_URL}/api/movies/${id}/reviews`);
  const results: Review[] = (raw || []).map((r: Record<string, unknown>) => ({
    id: (r.id as string) || "",
    author: r.author as string,
    content: r.content as string,
    created_at: r.created_at as string,
    rating: r.rating as number | undefined,
  }));
  return { results, page: 1, total_pages: 1, total_results: results.length };
}

export async function getSimilarMovies(id: number): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/${id}/similar`);
}

export async function getMovieRecommendations(id: number): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/${id}/recommendations`);
}

export async function getMoviesByGenre(genreId: number): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/genre/${genreId}`);
}

export async function getComingSoonMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/coming-soon`);
}

export async function getNewHotMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/new-hot`);
}

export async function getAwardWinners(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/award-winners`);
}

export async function getDocumentaries(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/documentaries`);
}

export async function getFamilyMovies(): Promise<ApiResponse<Movie>> {
  return fetchMovieList(`${API_BASE_URL}/api/movies/family`);
}

// ============ TV SHOWS ============

export async function getPopularTv(page = 1): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/popular?page=${page}`);
}

export async function getTopRatedTv(): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/top-rated`);
}

export async function getOnAirTv(): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/on-air`);
}

export async function getTvById(id: number): Promise<TvShow> {
  return fetchSingleDetail(`${API_BASE_URL}/api/tv/${id}`, normalizeMovie as unknown as (raw: Record<string, unknown>) => TvShow);
}

export async function getTvCast(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  const raw = await apiFetch<{ cast: Record<string, unknown>[]; crew: Record<string, unknown>[] }>(
    `${API_BASE_URL}/api/tv/${id}/cast`
  );
  return {
    cast: (raw.cast || []).map(normalizeCastMember),
    crew: (raw.crew || []).map((c: Record<string, unknown>) => ({
      id: c.id as number,
      name: c.name as string,
      job: c.job as string,
      profile_path: (c.profile_url || c.profile_path || null) as string | null,
    })),
  };
}

export async function getTvVideos(id: number): Promise<{ results: Video[] }> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${API_BASE_URL}/api/tv/${id}/videos`);
  return { results: (raw || []).map(normalizeVideo) };
}

export async function getTvReviews(id: number): Promise<ApiResponse<Review>> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${API_BASE_URL}/api/tv/${id}/reviews`);
  const results: Review[] = (raw || []).map((r: Record<string, unknown>) => ({
    id: (r.id as string) || "",
    author: r.author as string,
    content: r.content as string,
    created_at: r.created_at as string,
    rating: r.rating as number | undefined,
  }));
  return { results, page: 1, total_pages: 1, total_results: results.length };
}

export async function getSimilarTv(id: number): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/${id}/similar`);
}

export async function getTvRecommendations(id: number): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/${id}/recommendations`);
}

export async function getTvSeason(id: number, seasonNumber: number): Promise<Season> {
  return apiFetch<Season>(`${API_BASE_URL}/api/tv/${id}/season/${seasonNumber}`);
}

export async function getTvByGenre(genreId: number): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/genre/${genreId}`);
}

export async function getAnime(): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/anime`);
}

export async function getKoreanDramas(): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/korean`);
}

export async function getSpanishShows(): Promise<ApiResponse<TvShow>> {
  return fetchMovieList(`${API_BASE_URL}/api/tv/spanish`);
}

// ============ IMAGE HELPER ============

export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) {
    return `https://placehold.co/${size === 'original' ? '1920x1080' : size.replace('w', '') + 'x' + Math.round(parseInt(size.replace('w', '')) * 1.5)}/1a1a2e/e94560?text=No+Image`;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `https://image.tmdb.org/t/p/${size}${path}`;
}
