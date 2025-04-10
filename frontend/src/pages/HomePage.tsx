import React, { useEffect, useState } from "react";
import MoviesList from "../components/movies/MoviesList";
import MoviesSearchPagination from "../components/movies/MoviesSearchPagination";
import { api } from "../services/api";
import { Movie, MovieResponse } from "../types";
import { useAuth } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const fetchMovies = async (
    page: number,
    query: string = "",
    limit: number = resultsPerPage
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: MovieResponse;

      if (query) {
        response = await api.searchMovies(query, page, limit);
      } else {
        response = await api.getMovies(page, limit);
      }

      setMovies(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
      console.error("Error fetching movies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, searchQuery);
  }, [currentPage, resultsPerPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchMovies(1, query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResultsPerPageChange = (newResultsPerPage: number) => {
    setResultsPerPage(newResultsPerPage);
    setCurrentPage(1);
    fetchMovies(1, searchQuery, newResultsPerPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          Movies
        </h1>
        {user && (
          <div className="bg-indigo-100 px-4 py-2 rounded-md">
            <p className="text-indigo-800">
              Welcome, {user.name || user.email}!
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <MoviesSearchPagination
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onResultsPerPageChange={handleResultsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          totalResults={totalResults}
        />
      </div>

      <MoviesList movies={movies} isLoading={isLoading} error={error} />
    </div>
  );
};

export default HomePage;
