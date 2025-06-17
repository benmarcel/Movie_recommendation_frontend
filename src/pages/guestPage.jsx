import React from "react";
import { Link } from "react-router-dom";

const GuestPage = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-4 py-12 dark:bg-black dark:text-white transition-colors duration-300">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6">
          Welcome to CineMate 🎬
        </h1>
        <p className="text-zinc-700 mb-8 text-lg dark:text-zinc-300">
          Discover movies you'll love. Create watchlists, follow friends, rate films, and get personalized recommendations.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-red-600 hover:bg-red-600 hover:text-white text-red-600 px-6 py-3 rounded-lg font-semibold transition duration-300 dark:text-white dark:hover:text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestPage;