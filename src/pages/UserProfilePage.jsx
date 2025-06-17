import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Alert from '../components/Alert';
import useAlert from '../hooks/useAlert';
import { UserIcon } from '@heroicons/react/24/outline';
import EditProfileModal from '../components/EditProfileModal';
import useFetch from '../hooks/useFetch';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();
  const { logout } = useAuth();
  const { request, loading, error } = useFetch();

  const fetchUserProfile = async () => {
    const data = await request('/user/profile', 'GET');

    if (data) {
      setCurrentUser(data);
    } else if (error) {
      showAlert(error.message || 'Unable to fetch profile.', 'error');

      if (error.message?.includes('Authentication')) {
        navigate('/login', { replace: true });
      } else {
        navigate('/home', { replace: true }); // Optional fallback
      }
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    const data = await request('/user/profile/update', 'PUT', updatedData);
    if (data) {
      setCurrentUser(data);
      showAlert('Profile updated!', 'success');
      setShowEditModal(false);
    } else if (error) {
      showAlert(error.message || 'Failed to update profile.', 'error');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    showAlert('Logged out successfully.', 'success');
    navigate('/login', { replace: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const containerClasses = `min-h-screen flex items-center justify-center p-4
    bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-white transition-colors duration-300`;

  const profileCardClasses = `w-full max-w-md space-y-6 p-8
    bg-white dark:bg-zinc-800 rounded-lg shadow-xl text-center`;

  const buttonClasses = `w-full bg-red-600 hover:bg-red-700 text-white
    py-2 rounded font-semibold text-md transition duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    dark:focus:ring-offset-zinc-800`;

  const statItemClasses = `flex flex-col items-center text-sm font-medium text-gray-600 dark:text-zinc-400`;
  const statNumberClasses = `text-lg font-bold text-red-600 dark:text-red-500`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">
        Loading profile...
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className={containerClasses}>
        <div className={profileCardClasses}>
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-500">
            Error Loading Profile
          </h2>
          <p className="text-gray-700 dark:text-zinc-300">
            {error.message || 'Please try again later.'}
          </p>
          <button onClick={fetchUserProfile} className={buttonClasses}>
            Retry Loading Profile
          </button>
          <button
            onClick={() => navigate('/home')}
            className={`${buttonClasses} bg-gray-500 hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-600`}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className={containerClasses}>
      <div className={profileCardClasses}>
        {alertMessage && (
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />
        )}

        <div className="mb-4">
          <UserIcon className="h-24 w-24 mx-auto text-red-600 dark:text-red-500" />
        </div>

        <h2 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-2">
          {currentUser.username}
        </h2>

        <div className="flex justify-around items-center mb-6 border-t border-b py-3 border-gray-200 dark:border-zinc-700">
          <div className={statItemClasses}>
            <span className={statNumberClasses}>{currentUser.followers?.length || 0}</span>
            <span>Followers</span>
          </div>
          <div className={statItemClasses}>
            <span className={statNumberClasses}>{currentUser.following?.length || 0}</span>
            <span>Following</span>
          </div>
          <div className={statItemClasses}>
            <span className={statNumberClasses}>{currentUser.favorites?.length || 0}</span>
            <span>Favorites</span>
          </div>
        </div>

        <div className="text-left space-y-3 mb-6">
          <p className="text-gray-700 dark:text-zinc-300">
            <span className="font-semibold">Email:</span> {currentUser.email}
          </p>
          <p className="text-gray-700 dark:text-zinc-300">
            <span className="font-semibold">Age:</span> {currentUser.age || 'N/A'}
          </p>
          <p className="text-gray-700 dark:text-zinc-300">
            <span className="font-semibold">Member Since:</span> {formatDate(currentUser.createdAt)}
          </p>
        </div>

        <div className="space-y-3">
          <button onClick={() => setShowEditModal(true)} className={buttonClasses}>
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className={`${buttonClasses} bg-gray-500 hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-600`}
          >
            Logout
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
