import { useState } from "react";
import { Movie } from "../../types";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  return (
    <Link to={`/movies/${movie.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <div className="aspect-w-2 aspect-h-3 relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-movie.jpg";
            }}
          />
          <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-sm font-medium">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-500">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
