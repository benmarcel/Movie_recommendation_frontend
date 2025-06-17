// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ToggleBtn from './ToggleBtn';
import {
  HomeIcon, UserIcon, BookmarkIcon, UsersIcon, ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout, fetchLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const headerClasses = `
    bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg p-4
    flex justify-between items-center fixed top-0 left-0 w-full z-40
  `;

  const navLinkClasses = `
    px-3 py-2 rounded-md text-sm font-medium transition duration-200
    hover:bg-red-700 hover:text-white flex items-center gap-1
  `;

  return (
    <header className={headerClasses}>
      {/* Logo / Brand */}
      <Link to="/" className="flex items-center text-2xl font-bold">
       
        CineMate
      </Link>

      {/* Navigation */}
     <nav className="flex items-center space-x-2 sm:space-x-4">
  {user ? (
    <>
      <Link to="/home" className={navLinkClasses}>
        <HomeIcon className="h-5 w-5" /> <span className="hidden sm:inline">Home</span>
      </Link>
      <Link to="/profile" className={navLinkClasses}>
        <UserIcon className="h-5 w-5" /> <span className="hidden sm:inline">Profile</span>
      </Link>
      <Link to="/watchlist" className={navLinkClasses}>
        <BookmarkIcon className="h-5 w-5" /> <span className="hidden sm:inline">Watchlist</span>
      </Link>
      <Link to="/users" className={navLinkClasses}>
        <UsersIcon className="h-5 w-5" /> <span className="hidden sm:inline">Users</span>
      </Link>
      <button
        onClick={handleLogout}
        disabled={fetchLoading}
        className={`${navLinkClasses} bg-red-700 hover:bg-red-800`}
      >
        <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
        <span className="hidden sm:inline">{fetchLoading ? 'Logging out...' : 'Logout'}</span>
        <span className="inline sm:hidden">🚪</span>
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className={navLinkClasses}>Login</Link>
      <Link to="/register" className={navLinkClasses}>Register</Link>
    </>
  )}
</nav>
      {/* Dark Mode Toggle */}
      <div className="ml-4">
        <ToggleBtn />
      </div>
    </header>
  );
};

export default Header;
