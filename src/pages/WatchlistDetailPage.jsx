import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import { StarIcon } from '@heroicons/react/24/solid'; // Filled star
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'; // Outlined star

const WatchlistDetailPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useFetch();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();

  const [watchlistDetails, setWatchlistDetails] = useState(null);
  const [ratingLoading, setRatingLoading] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentText, setCommentText] = useState({});
  const [movieRatings, setMovieRatings] = useState({});

  const fetchWatchlistMovies = useCallback(async () => {
    clearAlert();
    const data = await request(`/watchlistMovies/${name}`, 'GET');

    if (data && data.watchlist) {
      setWatchlistDetails(data.watchlist);
      const initialComments = {};
      const initialRatings = {};

      data.watchlist.movies.forEach((movie) => {
        initialComments[movie._id] = '';
        initialRatings[movie._id] = movie.userRating || 0; // default to 0 if no rating
      });

      setCommentText(initialComments);
      setMovieRatings(initialRatings);
    } else {
      showAlert(`Failed to fetch movies for ${name}.`, 'error');
    }
  }, [name, request, clearAlert, showAlert]);

  useEffect(() => {
    if (name) {
      fetchWatchlistMovies();
    }
  }, [name, fetchWatchlistMovies]);

  const handleRateMovie = async (movieId, rating) => {
    setRatingLoading((prev) => ({ ...prev, [movieId]: true }));
    const response = await request(`/movie/${movieId}/rate`, 'POST', { rating });

    if (response && response.success !== false) {
      showAlert(`Rated movie with ${rating} stars!`, 'success');
      setMovieRatings((prev) => ({ ...prev, [movieId]: rating }));
    } else {
      showAlert(`Failed to rate movie.`, 'error');
    }

    setRatingLoading((prev) => ({ ...prev, [movieId]: false }));
  };

  const handleCommentChange = (movieId, text) => {
    setCommentText((prev) => ({ ...prev, [movieId]: text }));
  };

  const handleSubmitComment = async (movieId) => {
    const comment = commentText[movieId];
    if (!comment.trim()) {
      showAlert('Comment cannot be empty.', 'warning');
      return;
    }

    setCommentLoading((prev) => ({ ...prev, [movieId]: true }));
    const response = await request(`/movie/${movieId}/comment`, 'POST', { comment });

    if (response) {
      showAlert(`Comment added for movie!`, 'success');
      setCommentText((prev) => ({ ...prev, [movieId]: '' }));
      fetchWatchlistMovies();
    } else {
      showAlert(`Failed to add comment.`, 'error');
    }

    setCommentLoading((prev) => ({ ...prev, [movieId]: false }));
  };

  const containerClasses = `
    min-h-screen flex flex-col items-center p-4
    bg-gray-100 text-gray-900
    dark:bg-zinc-900 dark:text-white
    transition-colors duration-300
  `;

  const pageContentClasses = `
    w-full max-w-4xl space-y-6 p-8
    bg-white dark:bg-zinc-800
    rounded-lg shadow-xl
    mt-8 mb-8
  `;

  const movieCardClasses = `
    flex flex-col md:flex-row items-center md:items-start p-4
    border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm
    bg-gray-50 dark:bg-zinc-700
  `;

  const movieImageClasses = `
    w-32 h-auto rounded-lg mr-4 mb-4 md:mb-0 object-cover
  `;

  const movieDetailsClasses = `flex-1`;

  const movieTitleClasses = `
    text-2xl font-bold text-red-600 dark:text-red-500 mb-2
  `;

  const starIconClasses = `h-6 w-6 cursor-pointer`;

  const inputClasses = `
    w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md
    bg-gray-50 dark:bg-zinc-600 text-gray-900 dark:text-white
    focus:ring-red-500 focus:border-red-500 focus:outline-none
  `;

  const buttonClasses = `
    px-4 py-2 rounded-md font-semibold text-sm
    transition duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    dark:focus:ring-offset-zinc-700
  `;

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className={pageContentClasses}>
          <p className="text-center text-lg text-gray-700 dark:text-zinc-300">
            Loading watchlist details...
          </p>
        </div>
      </div>
    );
  }

  if (!watchlistDetails) {
    return (
      <div className={containerClasses}>
        <div className={pageContentClasses}>
          <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-4">
            Watchlist Not Found
          </h1>
          <p className="text-center text-lg text-gray-700 dark:text-zinc-300">
            The watchlist '{name}' could not be found or has no movies.
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/watchlists')}
              className={`${buttonClasses} bg-gray-500 hover:bg-gray-600 text-white`}
            >
              Back to Watchlists
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={pageContentClasses}>
        {alertMessage && (
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
            Watchlist: {watchlistDetails.name}
          </h1>
          <button
            onClick={() => navigate('/watchlists')}
            className={`${buttonClasses} bg-gray-500 hover:bg-gray-600 text-white`}
          >
            Back to All Watchlists
          </button>
        </div>

        {watchlistDetails.movies.length === 0 ? (
          <p className="text-center text-lg text-gray-700 dark:text-zinc-300">
            This watchlist has no movies yet.
          </p>
        ) : (
          <div className="space-y-6">
            {watchlistDetails.movies.map((movie) => (
              <div key={movie._id} className={movieCardClasses}>
                <img
                  src={movie.poster_path || `https://placehold.co/128x192/333/EEE?text=${movie.title.substring(0, 10)}`}
                  alt={movie.title}
                  className={movieImageClasses}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/128x192/333/EEE?text=No+Image`;
                  }}
                />
                <div className={movieDetailsClasses}>
                  <h3 className={movieTitleClasses}>{movie.title}</h3>
                  <p className="text-gray-700 dark:text-zinc-300 text-sm mb-2">
                    {movie.overview ? movie.overview.substring(0, 150) + '...' : 'No overview available.'}
                  </p>

                  {/* --- Star Rating Section --- */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-700 dark:text-zinc-300">Rate this movie:</span>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = movieRatings[movie._id] >= star;
                      const Icon = isFilled ? StarIcon : StarIconOutline;

                      return (
                        <Icon
                          key={star}
                          className={`${starIconClasses} ${isFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
                          onClick={() =>
                            !ratingLoading[movie._id] && handleRateMovie(movie._id, star)
                          }
                        />
                      );
                    })}
                    {ratingLoading[movie._id] && (
                      <span className="ml-2 text-sm text-red-500">Submitting rating...</span>
                    )}
                  </div>

                  {/* --- Comment Section --- */}
                  <div className="mt-4">
                    <textarea
                      className={inputClasses}
                      rows="3"
                      placeholder="Add your comment here..."
                      value={commentText[movie._id]}
                      onChange={(e) => handleCommentChange(movie._id, e.target.value)}
                      disabled={commentLoading[movie._id]}
                    ></textarea>
                    <button
                      onClick={() => handleSubmitComment(movie._id)}
                      disabled={commentLoading[movie._id] || !commentText[movie._id].trim()}
                      className={`${buttonClasses} bg-red-600 hover:bg-red-700 text-white mt-2`}
                    >
                      {commentLoading[movie._id] ? 'Submitting...' : 'Submit Comment'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistDetailPage;
