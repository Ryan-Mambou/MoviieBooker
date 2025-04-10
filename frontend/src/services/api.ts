import axios from "axios";
import {
  AuthResponse,
  MovieResponse,
  Movie,
  Reservation,
  User,
} from "../types";

const API_URL = "https://moviiebooker-qqi3.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
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

// Movies API
export const moviesApi = {
  getMovies: async (
    page: number = 1,
    sortBy: string = "popularity.desc"
  ): Promise<MovieResponse> => {
    const response = await api.get<MovieResponse>("/api/movies", {
      params: { page, sort_by: sortBy },
    });
    return response.data;
  },

  getMovieById: async (movieId: string): Promise<Movie> => {
    const response = await api.get<Movie>(`/api/movies/${movieId}`);
    return response.data;
  },

  searchMovies: async (query: string): Promise<MovieResponse> => {
    const response = await api.get<MovieResponse>("/api/movies/search", {
      params: { query },
    });
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    const response = await api.post<User>("/api/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  verifyToken: async (): Promise<User> => {
    const response = await api.get<User>("/api/auth/verify");
    return response.data;
  },
};

// Reservation API
export const reservationApi = {
  createReservation: async (data: {
    movieName: string;
    userId: string;
  }): Promise<Reservation> => {
    const response = await api.post<Reservation>("/api/reservations", data);
    return response.data;
  },

  getUserReservations: async (userId: string): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>(
      `/api/reservations/user/${userId}`
    );
    return response.data;
  },
};

export default api;
