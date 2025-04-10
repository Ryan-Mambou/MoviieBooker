import axios from "axios";
import {
  AuthResponse,
  LoginCredentials,
  MovieResponse,
  RegisterCredentials,
  Reservation,
  Movie,
  Genre,
} from "../types";

const API_URL = "https://moviiebooker-qqi3.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

// Movies
export const getMovies = async (
  page: number = 1,
  sortBy: string = "popularity.desc"
): Promise<MovieResponse> => {
  const response = await api.get<MovieResponse>("/movies", {
    params: { page, sort_by: sortBy },
  });
  return response.data;
};

export const getNowPlayingMovies = async (): Promise<MovieResponse> => {
  const response = await api.get<MovieResponse>("/movie/now_playing");
  return response.data;
};

export const searchMovies = async (query: string): Promise<MovieResponse> => {
  const response = await api.get<MovieResponse>("/search/movie", {
    params: { query },
  });
  return response.data;
};

export const getMovieById = async (movieId: string): Promise<Movie> => {
  const response = await api.get<Movie>(`/movie/${movieId}`);
  return response.data;
};

export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get<Genre[]>("/genre/movie/list");
  return response.data;
};

// Reservations
export const createReservation = async (
  movieName: string,
  userId: number
): Promise<Reservation> => {
  const response = await api.post<Reservation>("/reservation", {
    movieName,
    userId,
  });
  return response.data;
};

export const getUserReservations = async (
  userId: string
): Promise<Reservation[]> => {
  const response = await api.get<Reservation[]>(`/reservation/${userId}`);
  return response.data;
};

export const deleteReservation = async (id: string): Promise<Reservation> => {
  const response = await api.delete<Reservation>(`/reservation/${id}`);
  return response.data;
};

export default api;
