import axios from "axios";
import {
  MovieResponse,
  Movie,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  Reservation,
  ReservationRequest,
  Genre,
  User,
} from "../types";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: "https://moviiebooker-qqi3.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Movies services
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

export const getMovieById = async (id: string): Promise<Movie> => {
  const response = await api.get<Movie>(`/movie/${id}`);
  return response.data;
};

export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get<Genre[]>("/genre/movie/list");
  return response.data;
};

// Auth services
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
};

// Reservation services
export const createReservation = async (
  reservationData: ReservationRequest
): Promise<Reservation> => {
  const response = await api.post<Reservation>("/reservation", reservationData);
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
