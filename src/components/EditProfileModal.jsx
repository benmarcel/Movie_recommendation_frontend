import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // For close icon

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [editingUsername, setEditingUsername] = useState('');
  const [editingAge, setEditingAge] = useState('');
  const [saveLoading, setSaveLoading] = useState(false); // State for save button loading

  useEffect(() => {
    // Pre-fill form fields with current user data when modal opens
    if (user) {
      setEditingUsername(user.username || '');
      setEditingAge(user.age || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true); // Start loading

    const updatedData = {
      username: editingUsername,
      age: parseInt(editingAge), // Ensure age is an integer
    };

    // Call the onSave prop, which is handleUpdateProfile from ProfilePage
    await onSave(updatedData);
    setSaveLoading(false); // End loading
  };

  // --- Tailwind CSS Classes ---
  const modalOverlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4
  `;

  const modalContentClasses = `
    bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md
    relative transform transition-all scale-100 opacity-100
    text-gray-900 dark:text-white
  `;

  const inputClasses = `
    w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-md
    bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white
    focus:ring-red-500 focus:border-red-500 focus:outline-none
    transition duration-200
  `;

  const buttonClasses = `
    w-full py-2 rounded font-semibold text-md
    transition duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    dark:focus:ring-offset-zinc-800
  `;

  return (
    <div className={modalOverlayClasses}>
      <div className={modalContentClasses}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-6 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={editingUsername}
              onChange={(e) => setEditingUsername(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={editingAge}
              onChange={(e) => setEditingAge(e.target.value)}
              className={inputClasses}
              min="0"
              max="120" // Sensible max age
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`${buttonClasses} bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className={`${buttonClasses} bg-red-600 hover:bg-red-700 text-white`}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
