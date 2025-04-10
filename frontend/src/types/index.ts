export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  video: boolean;
  adult: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface Reservation {
  id: number;
  movieName: string;
  userId: number;
  reservationDate: string;
}

export interface ReservationForm {
  movieName: string;
  userId: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
  sort_by?: string;
}
