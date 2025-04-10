import { useState, useEffect } from "react";
import MoviesList from "../components/movies/MoviesList";
import { sampleMovies } from "../components/movies/sampleData";
import { Movie } from "../types";

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real implementation, you would fetch from an API
        // const response = await fetch('/api/movies');
        // const data = await response.json();
        // setMovies(data.results);

        // Using sample data for now
        setMovies(sampleMovies);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Popular Movies</h1>
      <MoviesList movies={movies} isLoading={isLoading} error={error} />
    </div>
  );
};

export default MoviesPage;
