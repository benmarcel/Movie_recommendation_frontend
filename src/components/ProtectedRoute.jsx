// components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();
  // The `useAuth` hook provides access to the user state and loading state from the AuthContext.
  // If the user is authenticated, it returns the user object; otherwise, it returns null.
  // The loading state indicates whether the authentication check is still in progress.
  // If loading is true, it means the authentication check is still in progress, so we show a loading state.
  // If the user is not authenticated, we redirect to the login page.
  // If the user is authenticated, we render the children components.

  if (initialLoading) {
   return (<div className="flex justify-center items-center h-screen bg-zinc-900 text-white">loading...</div>);

  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
