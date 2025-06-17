import { useState, useEffect, useCallback, useMemo } from "react";
import useFetch from "../hooks/useFetch.jsx"; // Ensure correct path
import { AuthContext } from "./authContext.js";


const AuthProvider = ({ children }) => {
  // useFetch hook provides request function, loading and error states for API calls
  const { request, loading: fetchLoading, error: fetchError } = useFetch();

  const [user, setUser] = useState(null); // Stores the authenticated user object
  const [resMsg, setResMsg] = useState(null); // Stores messages from auth operations (e.g., login success, session expired)
  const [initialLoading, setInitialLoading] = useState(true); // True while checking session on app startup

  /**
   * `checkUserStatus` attempts to retrieve user data from the server using the JWT.
   * This is typically used on app load to restore user session if a token exists.
   * It relies on `useFetch` to handle token-related errors (401/403) by clearing the token.
   */
  const checkUserStatus = useCallback(async () => {
    // Check if a token exists. If not, no need to make an API call, just set user to null.
    if (!localStorage.getItem('jwtToken')) {
      setUser(null);
      setResMsg("No JWT token found. User is not logged in.");
      setInitialLoading(false);
      return;
    }

    try {
      // Attempt to fetch user data using the /me endpoint.
      // useFetch will automatically attach the JWT.
      const data = await request("/me");

      if (data?.user) {
        setUser(data.user); // Set user if API returns user data (token was valid)
        setResMsg(data.message || "Session active.");
      } else {
        // If data is received but it explicitly indicates no user,
        // it means the token might be there but invalid/expired for /me
        // (though useFetch should handle 401/403 by clearing token already).
        setUser(null);
        setResMsg(data?.message || "No active session found.");
        localStorage.removeItem('jwtToken'); // Ensure token is removed if backend says no user
      }
    } catch (err) {
      // This catch block handles network errors or other non-401/403 server errors
      // The useFetch hook already handles 401/403 by clearing the token and throwing an error.
      console.error("User status check error:", err);
      setUser(null); // Ensure user is null on any status check failure
      setResMsg(err.message || "Failed to check user status.");
    } finally {
      setInitialLoading(false); // User status check is complete
    }
  }, [request]);

  /**
   * `login` function to handle user authentication using JWT.
   * On successful login, the received JWT is stored in localStorage.
   * @param {string} username - User's username.
   * @param {string} password - User's password.
   * @returns {Promise<object|null>} The user object on success, or null on failure.
   */
  const login = useCallback(async (email, password) => {
    setResMsg(null); // Clear previous messages
    try {
      // Send login credentials to backend
      const data = await request("/login", "POST", { email, password });

      if (data?.token && data?.user) {
        // On successful login, store the JWT
        localStorage.setItem('jwtToken', data.token);
        setUser(data.user); // Set user data from the response
        setResMsg(data.message || "Login successful.");
        setInitialLoading(false); // Mark initial loading as complete after login
        return data.user; // Return user object for components that need it
      } else {
        setResMsg(data?.message || "Login failed: Invalid response.");
        setUser(null); // Ensure user is null if login was unsuccessful
        return null;
      }
    } catch (err) {
      console.error("Login error:", err);
      setResMsg(err.message || "An error occurred during login.");
      setUser(null); // Ensure user is null on login failure
      return null;
    }
  }, [request]);

  /**
   * `register` function to handle user registration.
   * Note: This assumes registration does NOT automatically log the user in and return a JWT.
   * If your backend's /signup *does* return a token and logs the user in,
   * you would add localStorage.setItem('jwtToken', data.token) here as well.
   * @param {string} username - User's chosen username.
   * @param {string} password - User's password.
   * @returns {Promise<object|null>} The registration response data on success, or null on failure.
   */
  const register = useCallback(async (username, password, email, age) => { // Removed email as per backend example
    setResMsg(null); // Clear previous messages
    try {
      const data = await request("/signup", "POST", { username, password, email, age });
      if (data?.message) { // Assuming backend sends a message on successful registration
        setResMsg(data.message || "Registration successful.");
        // If registration auto-logs in, add: localStorage.setItem('jwtToken', data.token); setUser(data.user);
        return data; // Return the response data, not necessarily a user object for non-auto-login
      } else {
        setResMsg(data?.message || "Registration failed.");
        return null;
      }
    } catch (err) {
      console.error("Registration error:", err);
      setResMsg(err.message || "An error occurred during registration.");
      return null;
    }
  }, [request]);

  /**
   * `logout` function to handle user logout.
   * Clears the JWT from localStorage and resets user state.
   * Optionally, makes a backend call to invalidate refresh tokens or perform server-side cleanup.
   */
  const logout = useCallback(async () => {
    setResMsg(null); // Clear previous messages
    try {
      // Clear JWT token from localStorage immediately on logout
      localStorage.removeItem('jwtToken');
      setUser(null); // Clear user state locally

      // Optional: Make a backend call to /logout for server-side cleanup (e.g., refresh token invalidation)
      // This call will likely no longer have a valid JWT attached, which is fine.
      const data = await request("/logout", "POST");
      if (data?.message) {
        setResMsg(data.message || "Logged out successfully.");
      } else {
        setResMsg("Logged out successfully (server response inconclusive).");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setResMsg(err.message || "An error occurred during logout.");
    } finally {
      setUser(null); // Always ensure user state is null after logout attempt
    }
  }, [request]);

  // Effect to run checkUserStatus only once when the component mounts
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]); // `checkUserStatus` is a dependency, but it's memoized by useCallback

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user, // Convenience flag to check if a user is logged in
    fetchLoading,
    fetchError,
    resMsg,
    initialLoading,
    register,
    login,
    logout,
    // checkUserStatus, // Expose checkUserStatus for manual re-checks if needed
  }), [user, fetchLoading, fetchError, resMsg, initialLoading, login, logout, register]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
