import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../types";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";

interface MovieCardProps {
  movie: Movie;
  onReservationSuccess?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-poster.jpg";

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <Link to={`/movies/${movie.id}`} className="relative">
        <div className="relative w-full h-64">
          <img
            src={imageUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded-md">
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </Link>

      <CardContent className="flex-grow pt-4">
        <CardTitle className="text-lg line-clamp-1">{movie.title}</CardTitle>
        <CardDescription className="mt-2">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </CardDescription>
      </CardContent>

      <CardFooter>
        <Button variant="primary" size="sm" asChild className="w-full">
          <Link to={`/movies/${movie.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
