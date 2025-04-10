// Movie interface
export interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}

// API Response interface
export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

// Genre interface
export interface Genre {
  id: number;
  name: string;
}

// User interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

// Reservation interfaces
export interface Reservation {
  id: number;
  movieName: string;
  userId: number;
  reservationDate: string;
}

export interface ReservationRequest {
  movieName: string;
  userId: number;
}
