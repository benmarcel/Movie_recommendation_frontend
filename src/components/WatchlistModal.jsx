// components/WatchlistModal.jsx
import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import useAlert from '../hooks/useAlert';
import Alert from './Alert'; // Assuming Alert component is in the same directory
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Icons

/**
 * WatchlistModal Component
 * Allows users to add a movie to (or remove from) specific custom watchlists.
 * It also provides functionality to create new watchlists.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {string} props.tmdbId - The TMDB ID of the movie to manage.
 * @param {string} props.movieTitle - The title of the movie to manage.
 * @param {Array<object>} props.userWatchlists - Array of user's watchlists: [{ _id, name, movies: [] }]
 * @param {Array<object>} props.movieInWatchlists - Array of watchlists this movie is currently in: [{ _id, name }]
 * @param {Function} props.onUpdateLists - Callback to re-fetch user's lists and movie's status after an action.
 */
const WatchlistModal = ({
  isOpen,
  onClose,
  tmdbId,
  movieTitle,
  userWatchlists,
  movieInWatchlists,
  onUpdateLists,
}) => {
  const { request, loading } = useFetch();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();

  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(''); // For adding

  // Reset form states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      clearAlert();
      setNewWatchlistName('');
      setSelectedWatchlistId(''); // Reset selection
    }
  }, [isOpen, clearAlert]);


  // Determine if the movie is in a specific watchlist
  const isInSpecificWatchlist = (watchlistId) => {
    return movieInWatchlists.some(wl => String(wl._id) === String(watchlistId));
  };

  // Handle adding movie to selected watchlist
  const handleAddToWatchlist = async () => {
    if (!selectedWatchlistId) {
      showAlert('Please select a watchlist.', 'warning');
      return;
    }
    if (isInSpecificWatchlist(selectedWatchlistId)) {
      showAlert('Movie is already in the selected watchlist.', 'info');
      return;
    }

    try {
      const data = await request(`/watchlist/add`, 'POST', {
        tmdbId: tmdbId,
        watchlistId: selectedWatchlistId,
      });
      if (data && data.success) {
        showAlert(data.message, 'success');
        onUpdateLists(); // Trigger re-fetch in parent to update state
        setSelectedWatchlistId(''); // Clear selection after successful add
      } else {
        showAlert(data?.message || 'Failed to add movie to watchlist.', 'error');
      }
    } catch (err) {
      console.error('Error adding movie to watchlist:', err);
      showAlert(err.message || 'Error adding movie to watchlist.', 'error');
    }
  };

  // Handle removing movie from a specific watchlist
  const handleRemoveFromWatchlist = async (watchlistId, watchlistName) => {
    try {
      const data = await request(`/removefromwatchlist/${tmdbId}`, 'DELETE', {
        watchlistId: watchlistId, // Send watchlistId in body for DELETE
      });
      if (data && data.success) {
        showAlert(data.message, 'success');
        onUpdateLists(); // Trigger re-fetch in parent to update state
      } else {
        showAlert(data?.message || `Failed to remove movie from "${watchlistName}".`, 'error');
      }
    } catch (err) {
      console.error('Error removing movie from watchlist:', err);
      showAlert(err.message || 'Error removing movie from watchlist.', 'error');
    }
  };

  // Handle creating a new watchlist
  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      showAlert('Watchlist name cannot be empty.', 'warning');
      return;
    }
    if (userWatchlists.some(wl => wl.name.toLowerCase() === newWatchlistName.trim().toLowerCase())) {
        showAlert('A watchlist with this name already exists.', 'warning');
        return;
    }

    try {
      const data = await request('/watchlist/create', 'POST', { name: newWatchlistName.trim() });
      if (data && data.watchlist) {
        showAlert(data.message, 'success');
        setNewWatchlistName(''); // Clear input
        onUpdateLists(); // Trigger re-fetch to include new watchlist
      } else {
        showAlert(data?.message || 'Failed to create watchlist.', 'error');
      }
    } catch (err) {
      console.error('Error creating watchlist:', err);
      showAlert(err.message || 'Error creating watchlist.', 'error');
    }
  };

  // Handle deleting a watchlist
  // const handleDeleteWatchlist = async (watchlistId, watchlistName) => {
  //   if (!window.confirm(`Are you sure you want to delete the watchlist "${watchlistName}"? This action cannot be undone.`)) {
  //       return; // User cancelled
  //   }
  //   try {
  //       const data = await request(`/api/watchlists/${watchlistId}`, 'DELETE');
  //       if (data && data.message) {
  //           showAlert(data.message, 'success');
  //           onUpdateLists(); // Re-fetch watchlists
  //           if (selectedWatchlistId === watchlistId) setSelectedWatchlistId(''); // Clear selection if deleted
  //       } else {
  //           showAlert(data?.message || `Failed to delete watchlist "${watchlistName}".`, 'error');
  //       }
  //   } catch (err) {
  //       console.error('Error deleting watchlist:', err);
  //       showAlert(err.message || 'Error deleting watchlist.', 'error');
  //   }
  // };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Manage Watchlists for "{movieTitle}"</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />

          {/* Create New Watchlist Section */}
          <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Create New Watchlist</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Watchlist Name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                className="flex-grow p-2 rounded-md border border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white focus:ring-red-500 focus:border-red-500"
                disabled={loading}
              />
              <button
                onClick={handleCreateWatchlist}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-1"
                disabled={loading || !newWatchlistName.trim()}
              >
                <PlusIcon className="h-5 w-5" /> Create
              </button>
            </div>
          </div>

          {/* Add to Existing Watchlist Section */}
          <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Add to Existing Watchlist</h3>
            {userWatchlists.length > 0 ? (
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <select
                  value={selectedWatchlistId}
                  onChange={(e) => setSelectedWatchlistId(e.target.value)}
                  className="flex-grow p-2 rounded-md border border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                >
                  <option value="">Select a Watchlist</option>
                  {userWatchlists.map(wl => (
                    <option key={wl._id} value={wl._id}>
                      {wl.name}
                      {isInSpecificWatchlist(wl._id) && " (Already Added)"}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddToWatchlist}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1 sm:w-auto w-full"
                  disabled={loading || !selectedWatchlistId || isInSpecificWatchlist(selectedWatchlistId)}
                >
                  Add Movie
                </button>
              </div>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">No watchlists available. Create one above!</p>
            )}
          </div>

          {/* Current Watchlists & Removal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Movie is currently in:</h3>
            {movieInWatchlists.length > 0 ? (
              <ul className="space-y-2">
                {movieInWatchlists.map(wl => (
                  <li key={wl._id} className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-700 p-3 rounded-md shadow-sm">
                    <span className="text-zinc-900 dark:text-white font-medium">{wl.name}</span>
                    <button
                      onClick={() => handleRemoveFromWatchlist(wl._id, wl.name)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 font-semibold py-1 px-2 rounded-md transition-colors duration-200 flex items-center gap-1"
                      disabled={loading}
                    >
                      <XMarkIcon className="h-4 w-4" /> Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">This movie is not currently in any of your watchlists.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchlistModal;
// This component provides a modal interface for managing watchlists, allowing users to add or remove movies from their custom lists.
// It includes functionality to create new watchlists and delete existing ones, with appropriate alerts for user feedback.