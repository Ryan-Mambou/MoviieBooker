import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, createReservation } from "../services/api";
import { Movie } from "../types";
import axios, { AxiosError } from "axios";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);
  const [reservationLoading, setReservationLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          if (axiosError.response?.status === 401) {
            setError(
              "You are unauthorized. Please log in to view movie details."
            );
          } else if (axiosError.response?.data) {
            const backendError = axiosError.response.data as Record<
              string,
              unknown
            >;
            if (typeof backendError === "string") {
              setError(backendError);
            } else if (backendError.message) {
              setError(
                Array.isArray(backendError.message)
                  ? (backendError.message as string[]).join(", ")
                  : (backendError.message as string)
              );
            } else if (backendError.error) {
              setError(backendError.error as string);
            } else {
              setError(
                "Failed to fetch movie details. Please try again later."
              );
            }
          } else {
            setError("Failed to fetch movie details. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleReservation = async () => {
    if (!movie) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are unauthorized. Please log in to book this movie.");
      return;
    }

    setReservationLoading(true);
    try {
      // For demo purposes, we're using a dummy user ID
      // In a real app, you would get this from the authenticated user
      await createReservation({
        movieName: movie.title,
        userId: 1, // This should come from authenticated user context
      });
      setReservationSuccess(true);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError("You are unauthorized. Please log in to book this movie.");
          localStorage.removeItem("token"); // Clear invalid token
        } else if (axiosError.response?.data) {
          const backendError = axiosError.response.data as Record<
            string,
            unknown
          >;
          if (typeof backendError === "string") {
            setError(backendError);
          } else if (backendError.message) {
            setError(
              Array.isArray(backendError.message)
                ? (backendError.message as string[]).join(", ")
                : (backendError.message as string)
            );
          } else if (backendError.error) {
            setError(backendError.error as string);
          } else {
            setError("Failed to create reservation. Please try again.");
          }
        } else {
          setError("Failed to create reservation. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error creating reservation:", err);
    } finally {
      setReservationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded-md">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-white text-center">Movie not found</div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1280x720?text=No+Backdrop";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Movie Backdrop */}
      <div
        className="relative w-full h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 py-8 flex items-end h-full relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-48 h-72 rounded-lg shadow-lg object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <p className="text-gray-300 mt-2">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "Unknown release date"}
              </p>
              <div className="flex items-center mt-2">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">{movie.vote_average.toFixed(1)}/10</span>
                <span className="ml-2">({movie.vote_count} votes)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300">{movie.overview}</p>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">
                    Original Title
                  </h3>
                  <p>{movie.original_title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">
                    Original Language
                  </h3>
                  <p>{movie.original_language.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">
                    Popularity
                  </h3>
                  <p>{movie.popularity}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">
                    Adult Content
                  </h3>
                  <p>{movie.adult ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Book This Movie</h2>

              {reservationSuccess ? (
                <div className="bg-green-500 text-white p-4 rounded-md mb-4">
                  Reservation successful! Your booking has been confirmed.
                </div>
              ) : (
                <>
                  <p className="text-gray-300 mb-4">
                    Reserve your seat for {movie.title} now!
                  </p>
                  <button
                    onClick={handleReservation}
                    disabled={reservationLoading}
                    className="w-full bg-purple-600 text-white py-3 rounded-md font-medium hover:bg-purple-700 transition duration-300 disabled:bg-purple-400 disabled:cursor-not-allowed"
                  >
                    {reservationLoading ? "Processing..." : "Book Now"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
