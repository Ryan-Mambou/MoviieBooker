import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types";
import { getMovies, searchMovies } from "../services/api";
import axios, { AxiosError } from "axios";

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await getMovies(currentPage);
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError("You are unauthorized. Please log in to view movies.");
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
            setError("Failed to fetch movies. Please try again later.");
          }
        } else {
          setError("Failed to fetch movies. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchMovies();
      return;
    }

    setLoading(true);
    try {
      const response = await searchMovies(searchQuery);
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError("You are unauthorized. Please log in to search movies.");
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
            setError("Failed to search movies. Please try again later.");
          }
        } else {
          setError("Failed to search movies. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error searching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const renderMovieCard = (movie: Movie) => {
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";

    return (
      <div
        key={movie.id}
        className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105"
      >
        <Link to={`/movie/${movie.id}`}>
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-white truncate">
              {movie.title}
            </h3>
            <div className="flex items-center mt-2">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-300 mt-2 text-sm">
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="flex-grow px-4 py-2 rounded-l-md border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.length > 0 ? (
              movies.map(renderMovieCard)
            ) : (
              <div className="col-span-full text-center text-gray-300 py-12">
                <p>No movies found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-800 text-white rounded">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
