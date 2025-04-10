import React, { useState, useEffect } from "react";
import { Movie } from "../types";
import MovieCard from "../components/movies/MovieCard";
import { moviesApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await moviesApi.getMovies(page);

        if (data.results) {
          if (page === 1) {
            setMovies(data.results);
          } else {
            setMovies((prev) => [...prev, ...data.results]);
          }
          setHasMore(data.page < data.total_pages);
        } else {
          setMovies([]);
          setHasMore(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (!isSearching) {
      fetchMovies();
    }
  }, [page, isSearching]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setPage(1);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

      // Use the search API endpoint
      const data = await moviesApi.searchMovies(searchQuery);

      if (data.results) {
        setMovies(data.results);
        setHasMore(false);
      } else {
        setMovies([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore && !isSearching) {
      setPage((prev) => prev + 1);
    }
  };

  if (error && movies.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
            {isSearching && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {isSearching && movies.length === 0 && !loading ? (
        <div className="text-center p-8">
          <p className="text-gray-500">
            No movies found matching "{searchQuery}"
          </p>
          <Button onClick={clearSearch} variant="outline" className="mt-4">
            Show All Movies
          </Button>
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {hasMore && !isSearching && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    className="mx-auto"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-64">
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <p className="text-center text-gray-500 my-12">
                  No movies available at the moment
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;
