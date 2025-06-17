import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch'; // Your custom fetch hook
import useAlert from '../hooks/useAlert'; // Your alert hook
import Alert from '../components/Alert'; // Your Alert component

const WatchlistOverviewPage = () => {
  const { request, loading, error } = useFetch();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();
  const [watchlists, setWatchlists] = useState([]);

  // Function to fetch all watchlists
  const fetchWatchlists = async () => {
    // Clear any previous alerts before a new fetch operation
    clearAlert();
    // Assuming your backend endpoint for displayAllWatchlists is '/api/watchlists'
    const data = await request('/watchlists', 'GET');

    if (data && data.watchlists) {
      setWatchlists(data.watchlists);
    } else if (error) {
      // If useFetch returns an error, display it
      showAlert(error.message || 'Failed to fetch watchlists.', 'error');
    }
    // If data is null and no error, it means no watchlists were returned (empty array), which is handled by rendering below.
  };

  // Fetch watchlists on component mount
  useEffect(() => {
    fetchWatchlists();
  }, []); // Empty dependency array means this runs once on mount

  // Tailwind CSS Classes
  const containerClasses = `
    min-h-screen flex items-center justify-center p-4
    bg-gray-100 text-gray-900
    dark:bg-zinc-900 dark:text-white
    transition-colors duration-300
  `;

  const cardContainerClasses = `
    w-full max-w-2xl space-y-6 p-8
    bg-white
    dark:bg-zinc-800
    rounded-lg shadow-xl
  `;

  const watchlistCardClasses = `
    block p-5 border border-gray-200 dark:border-zinc-700 rounded-lg
    hover:bg-gray-50 dark:hover:bg-zinc-700
    transition-colors duration-200 ease-in-out
    cursor-pointer
  `;

  const watchlistNameClasses = `
    text-xl font-semibold text-red-600 dark:text-red-500 mb-2
  `;

  const movieCountClasses = `
    text-sm text-gray-600 dark:text-zinc-400
  `;

  return (
    <div className={containerClasses}>
      <div className={cardContainerClasses}>
        {alertMessage && (
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />
        )}

        <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-8">
          Your Watchlists
        </h1>

        {loading && (
          <p className="text-center text-lg text-gray-700 dark:text-zinc-300">Loading watchlists...</p>
        )}

        {error && !loading && (
          <p className="text-center text-lg text-red-600 dark:text-red-400">Error: {error.message || 'Failed to load watchlists.'}</p>
        )}

        {!loading && !error && watchlists.length === 0 && (
          <p className="text-center text-lg text-gray-700 dark:text-zinc-300">
            You don't have any watchlists yet.
          </p>
        )}

        {!loading && !error && watchlists.length > 0 && (
          <div className="space-y-4">
            {watchlists.map((watchlist) => (
              <Link to={`/watchlists/${watchlist.name}`} key={watchlist._id} className="no-underline">
                <div className={watchlistCardClasses}>
                  <h2 className={watchlistNameClasses}>{watchlist.name}</h2>
                  <p className={movieCountClasses}>
                    {watchlist.movies ? watchlist.movies.length : 0} Movies
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistOverviewPage;
