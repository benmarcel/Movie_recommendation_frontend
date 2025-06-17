// src/pages/Movie/HomePage.jsx
import React, { useEffect } from 'react';
import useMovieData from '../hooks/useMovieData'; // Custom hook for main movie list
import useAlert from '../hooks/useAlert';       // Custom hook for alert messages
import useRecommendations from '../hooks/useRecommendation'; // Custom hook for recommendations
import Alert from '../components/Alert';         // Component to display alert messages
import MovieCard from '../components/MovieCard'; // Reusable Movie Card component
import Carousel from '../components/Carousel';   // Reusable Carousel component

const HomePage = () => {
  // Main movie list logic
  const { displayedMovies: movies, filters, loading: moviesLoading, error: moviesError, handleChange } = useMovieData();
  // Recommendations logic
  const { recommendations, loadingRecommendations, errorRecommendations } = useRecommendations();
  // Alert logic
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();

  // Effect to show alert messages based on movie fetching errors
  useEffect(() => {
    if (moviesError) {
      showAlert(moviesError.message || 'Failed to load movies.', 'error');
    } else {
      clearAlert(); // Clear main movie list error if it resolves
    }
  }, [moviesError, showAlert, clearAlert]);

  // Optionally show alerts for recommendation errors
  useEffect(() => {
    if (errorRecommendations) {
      // You might want a different alert state or combine them for multiple errors
      console.error("Recommendation Error:", errorRecommendations);
      // showAlert(`Failed to load recommendations: ${errorRecommendations.message}`, 'error');
    }
  }, [errorRecommendations]);

  // --- Adaptive Tailwind CSS Classes ---
  const containerClasses = `
    min-h-screen
    bg-white text-zinc-900
    dark:bg-zinc-900 dark:text-white
    p-4 transition-colors duration-300
  `;

  const inputClasses = `
    w-full p-2 rounded
    bg-zinc-100 text-zinc-900 border border-zinc-300 placeholder-zinc-500
    dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder-zinc-400
    focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400
    transition-colors duration-300
  `;

  return (
    <div className={containerClasses}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">🎬 Discover Movies</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <input
          name="query"
          onChange={handleChange}
          value={filters.query}
          placeholder="Search by title..."
          className={`${inputClasses} lg:col-span-2`} // Make search input wider on larger screens
        />
        <input
          name="year"
          type="number"
          onChange={handleChange}
          value={filters.year}
          placeholder="Year (e.g., 2023)"
          className={inputClasses}
          // Disable other filters when a query is active to avoid confusing behavior
          disabled={!!filters.query}
          title={filters.query ? "Disabled during search" : "Filter by year"}
        />
        <select
          name="genre"
          onChange={handleChange}
          value={filters.genre}
          className={inputClasses}
          disabled={!!filters.query}
          title={filters.query ? "Disabled during search" : "Filter by genre"}
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="12">Adventure</option>
          <option value="16">Animation</option>
          <option value="35">Comedy</option>
          <option value="80">Crime</option>
          <option value="99">Documentary</option>
          <option value="18">Drama</option>
          <option value="10751">Family</option>
          <option value="14">Fantasy</option>
          <option value="36">History</option>
          <option value="27">Horror</option>
          <option value="10402">Music</option>
          <option value="9648">Mystery</option>
          <option value="10749">Romance</option>
          <option value="878">Science Fiction</option>
          <option value="10770">TV Movie</option>
          <option value="53">Thriller</option>
          <option value="10752">War</option>
          <option value="37">Western</option>
        </select>
        <select
          name="rating"
          onChange={handleChange}
          value={filters.rating}
          className={inputClasses}
          disabled={!!filters.query}
          title={filters.query ? "Disabled during search" : "Filter by minimum average rating"}
        >
          <option value="">All Ratings</option>
          <option value="9">9+ Stars</option>
          <option value="8">8+ Stars</option>
          <option value="7">7+ Stars</option>
          <option value="6">6+ Stars</option>
          <option value="5">5+ Stars</option>
        </select>
        <select
          name="sortBy"
          onChange={handleChange}
          value={filters.sortBy}
          className={inputClasses}
          disabled={!!filters.query}
          title={filters.query ? "Sorting is disabled while searching" : "Sort results"}
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest</option>
          <option value="release_date.asc">Oldest</option>
          <option value="title.asc">Title (A-Z)</option>
          <option value="title.desc">Title (Z-A)</option>
        </select>
      </div>
 {/* Recommendations Section (only displays if data is available) */}
      {!loadingRecommendations && recommendations.length > 0 && (
        <Carousel
          title="Recommended For You"
          items={recommendations}
          renderItem={(movie) => <MovieCard key={movie.id} movie={movie} />}
        />
      )}
      {loadingRecommendations && <p className="text-center text-lg">Loading recommendations...</p>}
      {errorRecommendations && !loadingRecommendations && (
        <p className="text-red-500 text-center">Could not load recommendations. {errorRecommendations.message}</p>
      )}
      
      {/* Alert component for main movie list errors */}
      <Alert message={alertMessage} type={alertType} onClose={clearAlert} />

      <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">All Movies</h2>
      {moviesLoading && <p className="text-center text-lg">Loading movies...</p>}
      {!moviesLoading && !moviesError && movies.length === 0 && (
        <p className="text-center text-zinc-500 dark:text-zinc-400">No movies found matching your criteria.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} /> // MovieCard component
        ))}
      </div>
    </div>
  );
};

export default HomePage;
