import React, { useState } from "react";

interface MoviesSearchPaginationProps {
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onResultsPerPageChange: (resultsPerPage: number) => void;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  totalResults: number;
}

const MoviesSearchPagination: React.FC<MoviesSearchPaginationProps> = ({
  onSearch,
  onPageChange,
  onResultsPerPageChange,
  currentPage,
  totalPages,
  isLoading,
  totalResults,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const resultsPerPageOptions = [5, 10, 20];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex space-x-2">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search for movies..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
          Showing{" "}
          {totalResults > 0
            ? (currentPage - 1) * resultsPerPageOptions[0] + 1
            : 0}{" "}
          to {Math.min(currentPage * resultsPerPageOptions[0], totalResults)} of{" "}
          {totalResults} results
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={resultsPerPageOptions[0]}
              onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
              disabled={isLoading}
            >
              {resultsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <button
              className="px-2 py-1 border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isLoading}
            >
              &laquo;
            </button>
            <button
              className="px-2 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              &lsaquo;
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border-t border-b border-gray-300 ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
              >
                {page}
              </button>
            ))}

            <button
              className="px-2 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              &rsaquo;
            </button>
            <button
              className="px-2 py-1 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesSearchPagination;
