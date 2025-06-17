import { useState, useCallback } from "react";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Custom hook for making API requests with JWT authentication.
   * Automatically adds Authorization header if a JWT is found in localStorage.
   * Handles 401/403 responses by clearing the token.
   *
   * @param {string} url - The API endpoint path (e.g., "/me", "/movies").
   * @param {string} [method="GET"] - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param {object} [body=null] - The request body for POST/PUT/PATCH requests.
   * @returns {Promise<object|null>} The response data or null if an error occurred.
   */
  const request = useCallback(async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    // Base configuration for the fetch request
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      // IMPORTANT: Remove `credentials: "include"` as it's for session cookies.
      // JWTs are sent via the Authorization header, not automatically managed cookies.
      // credentials: "include", // <-- REMOVED THIS LINE
    };

    // Retrieve JWT from localStorage and add to Authorization header if present
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body for appropriate HTTP methods
    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      config.body = JSON.stringify(body);
    }

    try {
      // Construct the full API URL
      const fullUrl = "https://movie-recommendation-backend-0ens.onrender.com" + url;
      const res = await fetch(fullUrl, config);
      const data = await res.json(); // Always attempt to parse JSON, even on errors for message

      if (!res.ok) {
        // Handle specific unauthorized/forbidden responses for JWTs
        if (res.status === 401 || res.status === 403) {
          // If the token is invalid or expired, clear it from storage
          // and inform the user or redirect them to the login page.
          localStorage.removeItem('jwtToken');
          console.error("Authentication Error: Token invalid or expired. Please log in again.");
          // You might want to trigger a global state update or redirect here,
          // for example, using React Router's `navigate` or a simple window.location.href
          // window.location.href = '/login'; // Example of forced redirect
          throw new Error(data?.message || "Unauthorized access. Please log in again.");
        }
        // For other non-OK responses, throw a generic error
        throw new Error(data?.message || `Fetch failed with status: ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Fetch error in useFetch hook:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // useCallback dependencies: empty array means it memoizes once.

  return { request, loading, error };
};

export default useFetch;
