import { useState, useEffect, useCallback, useMemo } from "react";
import useFetch from "../hooks/useFetch.jsx"; // Ensure correct path
import { AuthContext } from "./authContext.js"; // Ensure correct path

const AuthProvider = ({ children }) => {
  const { request, loading: fetchLoading, error: fetchError } = useFetch();

  const [user, setUser] = useState(null); // Stores the authenticated user object
  const [resMsg, setResMsg] = useState(null); // Stores messages from auth operations (e.g., login success, session expired)
  const [initialLoading, setInitialLoading] = useState(true); // True while checking session on app startup

  /**
   * `checkSession` attempts to retrieve user data from the server.
   * This is typically used on app load to restore user session.
   * It updates the `user`, `resMsg`, and `initialLoading` states.
   */
  const checkSession = useCallback(async () => {
    try {
      const data = await request("/me"); // API endpoint to get current user data
      if (data?.user) {
        setUser(data.user); // Set user if session is active
        setResMsg(data.message || "Session active."); // Set success message
        setInitialLoading(false); // Mark initial loading as complete
      } else {
        // If server explicitly returns no user or an error, clear user
        setUser(null);
        setResMsg(data?.message || "No active session found.");
        
      }
    } catch (err) {
      // This catch block handles network errors or server errors from /me endpoint
      console.error("Session check error:", err);
      setUser(null); // Ensure user is null on any session check failure
      setResMsg(err.message || "Failed to check session.");
      setInitialLoading(false); // Mark initial loading as complete
    } finally {
      setInitialLoading(false); // Session check is complete
    }
  }, [request]); // `request` is a dependency as it's used inside checkSession

  /**
   * `login` function to handle user authentication.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<object|null>} The user object on success, or null on failure.
   */
  const login = useCallback(async (email, password) => {
    setResMsg(null); // Clear previous messages
    try {
      const data = await request("/login", "POST", { email, password });
      if (data?.user) {
        setUser(data.user); // Set user on successful login
        setResMsg(data.message || "Login successful.");
        setInitialLoading(false); // Mark initial loading as complete after login
        // console.log(data.user); // Log user data for debugging
        
        return data; // Return user object
      } else {
        setResMsg(data?.message || "Login failed.");
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("Login error:", err);
      setResMsg(err.message || "An error occurred during login.");
      setUser(null);
      return null;
    }
  }, [request]);

  /**
   * `register` function to handle user registration.
   * @param {string} username - User's chosen username.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<object|null>} The user object on success, or null on failure.
   */
  const register = useCallback(async (username, email, password) => {
    setResMsg(null); // Clear previous messages
    try {
      const data = await request("/signup", "POST", { username, email, password });
      if (data) {
        setUser(data.user); // Set user on successful registration
        setResMsg(data.message || "Registration successful.");
        setInitialLoading(false); // Mark initial loading as complete after registration
        // console.log(data); // Log user data for debugging
        return data; // Return user object
      } else {
        setResMsg(data?.message || "Registration failed.");
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("Registration error:", err);
      setResMsg(err.message || "An error occurred during registration.");
      setUser(null);
      return null;
    }
  }
  , [request]);

  /**
   * `logout` function to handle user logout.
   * Clears the user state and potentially informs the backend.
   */
  const logout = useCallback(async () => {
    setResMsg(null); // Clear previous messages
    try {
      const data = await request("/logout", "POST"); // Inform backend about logout
      if (data?.message) {
        setUser(null); // Clear user state
        setResMsg(data.message || "Logged out successfully.");
      } else {
        setResMsg(data?.message || "Logout failed on server.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setResMsg(err.message || "An error occurred during logout.");
    } finally {
      setUser(null); // Always clear user state locally on logout attempt
    }
  }, [request]);

  // Effect to run checkSession only once when the component mounts
  useEffect(() => {
    checkSession();
  }, [checkSession]); // `checkSession` is a dependency, but it's memoized by useCallback

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const authContextValue = useMemo(() => ({
    user,
    fetchLoading, // Renamed from 'loading' in useFetch to avoid confusion with initialLoading
    fetchError,   // Renamed from 'error' in useFetch
    resMsg,
    initialLoading,
    register,
    login,
    logout,
    // checkSession, // Expose checkSession for manual re-checks if needed
  }), [user, fetchLoading, fetchError, resMsg, initialLoading, login, logout,  register]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;