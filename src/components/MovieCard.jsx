import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation

/**
 * MovieCard Component
 * Displays a single movie's information and is clickable to navigate to movie details.
 *
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie object containing details like id, title, poster_path, etc.
 */
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Tailwind CSS classes for consistent styling
  const movieCardClasses = `
    p-3 rounded-lg shadow-md
    bg-gray-50 dark:bg-zinc-800
    flex flex-col h-full
    cursor-pointer transition-transform duration-200 hover:scale-105
  `;

  const noImageClasses = `
    w-full h-64 flex items-center justify-center text-center rounded mb-2
    bg-gray-200 text-gray-500
    dark:bg-zinc-700 dark:text-zinc-400
  `;

  const handleCardClick = () => {
    // Navigate to the movie details page using the movie's ID
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className={movieCardClasses} onClick={handleCardClick}>
      {/* Flex-grow ensures content fills available space, pushing footer elements down */}
      <div className="flex-grow">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto object-cover rounded mb-2 aspect-[2/3]" // Maintain aspect ratio for posters
          />
        ) : (
          <div className={noImageClasses}>
            No Image Available
          </div>
        )}
        <h3 className="text-md font-semibold mt-2 truncate text-zinc-900 dark:text-white" title={movie.title}>
          {movie.title}
        </h3>
        {movie.release_date && (
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
      </div>
      <p className="text-sm text-yellow-500 dark:text-yellow-400 mt-2">
        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        {movie.vote_count ? ` (${movie.vote_count} votes)` : ''}
      </p>
    </div>
  );
};

export default MovieCard;
