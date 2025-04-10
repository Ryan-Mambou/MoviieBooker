import { useQuery } from "@tanstack/react-query";
import { moviesApi } from "../../services/api";
import MovieCard from "./MovieCard";
import { useSearchParams } from "react-router-dom";

const MoviesList = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const sortBy = searchParams.get("sort_by") || "popularity.desc";
  const query = searchParams.get("query") || "";

  const fetchMovies = () => {
    if (query) {
      return moviesApi.searchMovies(query);
    }
    return moviesApi.getMovies(page, sortBy);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["movies", page, sortBy, query],
    queryFn: fetchMovies,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error loading movies</p>
          <p>
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No movies found
          </h2>
          <p className="text-gray-500 mt-2">
            {query
              ? "Try a different search term"
              : "Try a different page or sorting option"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.results.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onReservationSuccess={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviesList;
