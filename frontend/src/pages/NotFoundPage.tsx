import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
        404
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Page not found
      </p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
