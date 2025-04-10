import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";
import { moviesApi, reservationApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await moviesApi.getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/movies/${id}` } });
      return;
    }

    if (!movie || !user) return;

    setIsBooking(true);
    setBookingError(null);

    try {
      await reservationApi.createReservation({
        movieName: movie.title,
        userId: user.id,
      });

      setBookingSuccess(true);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "An error occurred during booking"
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error || "Movie not found"}</p>
        <Button onClick={() => navigate("/movies")} variant="primary">
          Back to Movies
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder-poster.jpg"
            }
            alt={`${movie.title} poster`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>

          <div className="flex items-center mb-4">
            <span className="bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded-md mr-3">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"}
            </span>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-gray-700 dark:text-gray-300">
                {movie.overview}
              </p>
            </CardContent>
          </Card>

          {bookingSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Booking successful! You have reserved a ticket for {movie.title}.
            </div>
          ) : bookingError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {bookingError}
            </div>
          ) : null}

          <Button
            onClick={handleBooking}
            disabled={isBooking || bookingSuccess}
            variant={bookingSuccess ? "secondary" : "primary"}
            size="lg"
            className={bookingSuccess ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {bookingSuccess
              ? "Booked Successfully"
              : isBooking
              ? "Booking..."
              : "Book Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
