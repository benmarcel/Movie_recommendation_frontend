import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import { UsersIcon, UserIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import useAuth from '../hooks/useAuth';

const UsersPage = () => {
  const navigate = useNavigate();
  const { request, loading, error } = useFetch();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();
  const { user: currentUser } = useAuth(); // Assuming useAuth provides current user info
  const [users, setUsers] = useState([]);
  

  // Fetch users
  const fetchUsers = useCallback(async () => {
    const res = await request('/users');
    if (res?.success) {
      setUsers(res.users);
      // console.log(res.users);
      
    } else {
      showAlert(res?.message || 'Could not fetch users.', 'error');
    }
  }, [request, showAlert]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

 const handleFollowToggle = async (userId, isFollowing) => {
  const endpoint = isFollowing ? 'unfollow' : 'follow';
  const res = await request(`/user/${endpoint}/${userId}`, 'POST');

  if (res?.message) {
    showAlert(res.message, 'success');

    // Optimistically update local user list
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user._id !== userId) return user;

        let updatedFollowers;
        if (isFollowing) {
          // Remove current user from followers
          updatedFollowers = user.followers.filter(f => f._id !== currentUser._id);
        } else {
          // Add current user to followers
          updatedFollowers = [...user.followers, { _id: currentUser._id, username: currentUser.username }];
        }

        return { ...user, followers: updatedFollowers };
      })
    );
  } else {
    showAlert(res?.message || 'Something went wrong.', 'error');
  }
};


  const handleUserClick = id => navigate(`/user/${id}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white">
        {alertMessage && <Alert message={alertMessage} type={alertType} onClose={clearAlert} />}
        <div className="max-w-lg mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="mb-4">{error.message || 'Failed to load users.'}</p>
          <button onClick={fetchUsers} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center text-red-600 dark:text-red-400">
          <UsersIcon className="h-7 w-7 mr-2" />
          Browse Users
        </h1>

        {alertMessage && <Alert message={alertMessage} type={alertType} onClose={clearAlert} />}

        {users.length === 0 ? (
          <p className="text-center text-lg">No other users found.</p>
        ) : (
          <div className="grid gap-6">
            {users.map(user => {
              const isFollowing = user.followers?.some(f => f.username === currentUser?.username);
              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3" onClick={() => handleUserClick(user._id)}>
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <UserIcon className="h-6 w-6" />
                      </div>
                    )}
                    <span className="font-semibold text-lg">{user.username}</span>
                  </div>

                  {currentUser?._id !== user._id && (
                    <button
                      onClick={() => handleFollowToggle(user._id, isFollowing)}
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        isFollowing
                          ? 'bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 text-black dark:text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
