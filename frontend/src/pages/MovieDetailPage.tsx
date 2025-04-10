import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { sampleMovies } from "../components/movies/sampleData";
import { Movie } from "../types";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // In a real implementation, you would fetch from an API
        // const response = await fetch(`/api/movies/${id}`);
        // const data = await response.json();
        // setMovie(data);

        // Using sample data for now
        const foundMovie = sampleMovies.find((m) => m.id === parseInt(id));

        if (foundMovie) {
          setMovie(foundMovie);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || "Movie not found"}</span>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder-backdrop.jpg";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-backdrop.jpg";
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 -mt-24 relative z-20">
          {/* Poster */}
          <div className="w-[200px] h-[300px] mx-auto md:mx-0 shadow-xl rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-movie.jpg";
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>

            <div className="flex items-center gap-4 mt-2">
              <span className="bg-indigo-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-500">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "Unknown"}
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Overview
              </h2>
              <p className="text-gray-600">
                {movie.overview || "No overview available"}
              </p>
            </div>

            <div className="mt-8">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
