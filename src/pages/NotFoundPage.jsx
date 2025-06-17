import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#141414] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved. 
        Maybe try going back to the homepage or browsing popular movies.
      </p>
      <Link
        to="/home"
        className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition"
      >
        Back to Home
      </Link>

      <div className="mt-10">
        <img 
          src="https://media.giphy.com/media/f9k1tV7HyORcngKF8v/giphy.gif" 
          alt="Lost in Netflix" 
          className="w-80 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default NotFoundPage;
// This NotFoundPage component provides a user-friendly 404 error page.