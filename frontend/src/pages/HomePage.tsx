import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to MovieBooker</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Find and book tickets for your favorite movies
        </p>
        <Link
          to="/movies"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Browse Movies
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Latest Releases</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Check out the newest movies in theaters
          </p>
          <Link
            to="/movies"
            className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium"
          >
            View Latest →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Book Tickets</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Reserve seats for upcoming showings
          </p>
          <Link
            to="/movies"
            className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium"
          >
            Book Now →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">My Bookings</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            View and manage your reservations
          </p>
          <Link
            to="/profile"
            className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium"
          >
            View Bookings →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
