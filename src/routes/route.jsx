import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import HomePage from '../pages/HomePage.jsx';
import GuestPage from "../pages/guestPage.jsx";
import LoginPage from '../pages/Auth/LoginPage.jsx';
import RegisterPage from '../pages/Auth/RegisterPage.jsx';
import MovieDetailsPage from "../pages/MovieDetails.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import UserProfilePage from '../pages/UserProfilePage';
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import UsersPage from "../pages/UsersPage.jsx";
import UserDetailPage from "../pages/UserdetailsPage.jsx";
import MainLayout from '../layout/mainlayout.jsx';
import WatchlistOverviewPage from "../pages/WatchlistOverviewPage.jsx";
import WatchlistDetailPage from "../pages/WatchlistDetailPage.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />} >
      <Route index element={<GuestPage />} />
      <Route path="home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="movies/:id" element={<MovieDetailsPage />} />
      <Route path="profile" element={<UserProfilePage />} />
      <Route path="users" element={
        <ProtectedRoute>
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="user/:id" element={
        <ProtectedRoute>
          <UserDetailPage />
        </ProtectedRoute>
      } />
      <Route path="watchlist" element={
        <ProtectedRoute>
          <WatchlistOverviewPage />
        </ProtectedRoute>
      } />
      <Route path="watchlists/:name" element={
        <ProtectedRoute>
          <WatchlistDetailPage />
        </ProtectedRoute>
      } />
      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  ), 
  {
    future: {
      v7_startTransition: true
    }
  }
);

export default router;
// This file sets up the main routing for the application using React Router.
// It defines routes for the home page, login, registration, movie details, and a catch-all for 404 errors.
// The routes are wrapped in a MainLayout component, which likely provides a consistent layout for all pages.
// The `createBrowserRouter` and `createRoutesFromElements` functions are used to create a router instance
// that can be used with the `RouterProvider` component in the main application file (e.g., App.jsx).