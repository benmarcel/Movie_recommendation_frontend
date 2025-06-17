import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import useAuth from '../hooks/useAuth';
import { UsersIcon } from '@heroicons/react/24/outline';

const UserDetailPage = () => {
  const { id } = useParams(); // Get user ID from URL
  const { request, loading, error } = useFetch();
  const { user: currentUser } = useAuth();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();

  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    const res = await request(`/user/${id}`);
    if (res && !res.message) {
      setUser(res);
    } else {
      showAlert(res?.message || 'Could not fetch user', 'error');
    }
  }, [id, request, showAlert]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isFollowing = user?.followers?.some(f => f._id === currentUser?._id);

  const handleFollowToggle = async () => {
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    const res = await request(`/user/${endpoint}/${user.id}`, 'POST');

    if (res?.message) {
      showAlert(res.message, 'success');

      // Optimistically update state
      setUser(prev => {
        let updatedFollowers;
        if (isFollowing) {
          updatedFollowers = prev.followers.filter(f => f._id !== currentUser._id);
        } else {
          updatedFollowers = [...prev.followers, { _id: currentUser._id, username: currentUser.username }];
        }
        return { ...prev, followers: updatedFollowers };
      });
    } else {
      showAlert(res?.message || 'Something went wrong.', 'error');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white">
        {alertMessage && <Alert message={alertMessage} type={alertType} onClose={clearAlert} />}
        <div className="max-w-lg mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="mb-4">{error.message || 'Failed to load user profile.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white">
      <div className="max-w-xl mx-auto py-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p><strong>Followers:</strong> {user.followers?.length || 0}</p>
            <p><strong>Following:</strong> {user.following?.length || 0}</p>
          </div>

          {currentUser?._id !== user.id && (
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2 rounded text-sm font-semibold ${
                isFollowing
                  ? 'bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 text-black dark:text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        {alertMessage && <Alert message={alertMessage} type={alertType} onClose={clearAlert} />}
      </div>
    </div>
  );
};

export default UserDetailPage;
