import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import useAuth from '../hooks/useAuth';
import WatchlistModal from '../components/WatchlistModal';

const MovieDetailsPage = () => {
  const { id: tmdbId } = useParams();
  const { user, initialLoading: authInitialLoading } = useAuth();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();

  // Use separate fetch instances
  const { request: movieRequest, loading: movieLoading, error: movieError } = useFetch();
  const { request: listRequest, loading: listLoading, error: listError } = useFetch();

  const [movie, setMovie] = useState(null);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [userWatchlists, setUserWatchlists] = useState([]);
  const [movieInWatchlists, setMovieInWatchlists] = useState([]);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  const pageLoading = movieLoading || listLoading || authInitialLoading;

  // Handle alerts
  useEffect(() => {
    if (movieError || listError) {
      showAlert((movieError || listError).message || 'Failed to perform action.', 'error');
    } else {
      clearAlert();
    }
  }, [movieError, listError, showAlert, clearAlert]);

  const fetchUserWatchlists = useCallback(async () => {
    if (!user) return setUserWatchlists([]);
    try {
      const data = await listRequest(`/watchlists`);
      if (Array.isArray(data?.watchlists)) {
        setUserWatchlists(data.watchlists);
      } else {
        showAlert(data?.message || "Could not retrieve user's watchlists.", 'error');
        setUserWatchlists([]);
      }
    } catch (err) {
      showAlert(err.message || "Error retrieving watchlists.", 'error');
      setUserWatchlists([]);
    }
  }, [user, listRequest, showAlert]);

  const fetchMovieDetailsAndListStatuses = useCallback(async () => {
    if (!tmdbId) return;
    try {
      const movieData = await movieRequest(`/movies/${tmdbId}`);
      if (movieData) {
        setMovie(movieData);
      } else {
        setMovie(null);
        showAlert('Movie not found.', 'error');
        return;
      }

      if (user) {
        const favoritesStatusData = await listRequest(`/favorites/status/${tmdbId}`);
        if (favoritesStatusData) {
          setIsInFavorites(favoritesStatusData.isInFavorites);
        }

        const watchlistStatusData = await listRequest(`/watchlist/status/${tmdbId}`);
        if (Array.isArray(watchlistStatusData?.watchlistIds)) {
          setMovieInWatchlists(watchlistStatusData.watchlistIds);
        }
      }
    } catch (err) {
      showAlert(err.message || 'Failed to load movie details or list status.', 'error');
      setMovie(null);
    }
  }, [tmdbId, user, movieRequest, listRequest, showAlert]);

  useEffect(() => {
    if (!authInitialLoading) {
      fetchUserWatchlists();
      fetchMovieDetailsAndListStatuses();
    }
  }, [authInitialLoading, fetchUserWatchlists, fetchMovieDetailsAndListStatuses]);

  const handleWatchlistButtonClick = () => {
    if (!user) {
      showAlert('Please log in to manage your watchlists.', 'info');
      return;
    }
    setShowWatchlistModal(true);
  };

  const handleFavoritesToggle = async () => {
    if (!user) {
      showAlert('Please log in to manage your favorites.', 'info');
      return;
    }

    const method = isInFavorites ? 'DELETE' : 'POST';
    const endpoint = isInFavorites ? `/favorites/delete/${tmdbId}` : `/favorites/add`;
    const body = isInFavorites ? null : { tmdbId };

    try {
      const data = await listRequest(endpoint, method, body);
      if (data?.success) {
        setIsInFavorites(!isInFavorites);
        showAlert(data.message, 'success');
      } else {
        showAlert(data?.message || 'Failed to update favorites.', 'error');
      }
    } catch (err) {
      showAlert(err.message || 'Error updating favorites.', 'error');
    }
  };

  const handleWatchlistModalUpdate = () => {
    fetchUserWatchlists();
    fetchMovieDetailsAndListStatuses();
  };

  if (pageLoading && !movie) {
    return <div className="text-center text-lg text-zinc-900 dark:text-white min-h-screen pt-20">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="text-center text-lg text-zinc-500 dark:text-zinc-400 min-h-screen pt-20">Movie not found or an error occurred.</div>;
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : `https://placehold.co/1280x720/000000/FFFFFF?text=No+Backdrop`;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://placehold.co/500x750/cccccc/333333?text=No+Poster`;

  const isInAnyWatchlist = movieInWatchlists.length > 0;

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      <div className="relative h-64 md:h-96 lg:h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </div>

      <div className="container mx-auto p-4 md:p-8 -mt-20 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center md:items-start">
            <img
              loading="lazy"
              src={posterUrl}
              alt={movie.title}
              className="w-48 h-auto rounded-lg shadow-xl mb-4 md:w-64 lg:w-80"
            />
            {user && (
              <div className="flex gap-4 w-full md:flex-col md:gap-2 mt-4 md:mt-0">
                <button
                  onClick={handleWatchlistButtonClick}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold text-sm transition-colors duration-200 w-full
                    ${isInAnyWatchlist
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-zinc-700 hover:bg-zinc-600 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600'}
                  `}
                  disabled={listLoading}
                >
                  <i className={`fa-solid ${isInAnyWatchlist ? 'fa-check' : 'fa-plus'}`}></i>
                  {isInAnyWatchlist ? 'Manage Watchlists' : 'Add to Watchlist'}
                </button>
                <button
                  onClick={handleFavoritesToggle}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold text-sm transition-colors duration-200 w-full
                    ${isInFavorites
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-zinc-700 hover:bg-zinc-600 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600'}
                  `}
                  disabled={listLoading}
                >
                  <i className={`fa-solid ${isInFavorites ? 'fa-heart' : 'fa-star'}`}></i>
                  {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            )}
          </div>

          <div className="md:w-2/3 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold mb-2 text-red-600 dark:text-red-500">{movie.title}</h1>
            {movie.tagline && <p className="text-zinc-600 dark:text-zinc-400 italic mb-4">{movie.tagline}</p>}

            <div className="flex items-center gap-4 mb-4 text-zinc-700 dark:text-zinc-300">
              <span className="text-lg font-semibold">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
              {movie.release_date && <span>| {new Date(movie.release_date).getFullYear()}</span>}
              {movie.runtime && <span>| {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
            </div>

            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-lg leading-relaxed mb-6 text-zinc-800 dark:text-zinc-200">{movie.overview}</p>

            {movie.credits?.crew?.find(c => c.job === 'Director') && (
              <p className="text-md mb-2">
                <span className="font-semibold">Director:</span> {movie.credits.crew.find(c => c.job === 'Director')?.name}
              </p>
            )}

            {Array.isArray(movie.credits?.cast) && (
              <p className="text-md mb-2">
                <span className="font-semibold">Cast:</span> {movie.credits.cast.slice(0, 5).map(c => c.name).join(', ')}
              </p>
            )}

            {Array.isArray(movie.production_companies) && movie.production_companies.length > 0 && (
              <p className="text-md mb-2">
                <span className="font-semibold">Production:</span> {movie.production_companies.map(pc => pc.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={clearAlert}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        />
      )}

      {/* Watchlist Modal */}

      {showWatchlistModal && (
        <WatchlistModal
          isOpen={showWatchlistModal}
          onClose={() => setShowWatchlistModal(false)}
          tmdbId={tmdbId}
          movieTitle={movie?.title || ''}
          userWatchlists={userWatchlists}
          movieInWatchlists={movieInWatchlists}
          onUpdateLists={handleWatchlistModalUpdate}
        />
      )}
    </div>
  );
};

export default MovieDetailsPage;
