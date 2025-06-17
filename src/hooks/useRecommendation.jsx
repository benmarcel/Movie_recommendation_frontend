// hooks/useRecommendations.js
import { useState, useEffect, useCallback } from 'react';
import useFetch from './useFetch'; 
import  useAuth  from './useAuth'; 

/**
 * Custom hook to fetch personalized movie recommendations.
 * Recommendations are typically user-specific, so it depends on an authenticated user.
 *
 * @returns {object} An object containing:
 * - recommendations: Array of recommended movie objects.
 * - loadingRecommendations: Boolean indicating if recommendations are being fetched.
 * - errorRecommendations: Error object if fetching recommendations fails.
 */
const useRecommendations = () => {
  const { request } = useFetch();
  const { user, initialLoading: authInitialLoading } = useAuth(); // Get user from AuthContext

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [errorRecommendations, setErrorRecommendations] = useState(null);

  /**
   * `fetchRecommendations` is a memoized function to fetch personalized movie data.
   * It only proceeds if a user is authenticated.
   */
  const fetchRecommendations = useCallback(async () => {
    // Only attempt to fetch recommendations if the user is authenticated
    if (!user) {
      setRecommendations([]);
      setLoadingRecommendations(false);
      setErrorRecommendations(null); // Clear any previous errors if not authenticated
      return;
    }

    setLoadingRecommendations(true);
    setErrorRecommendations(null);

    try {
      // Assuming a backend endpoint for personalized recommendations for the logged-in user
      // In a real app, this might pass user.id to the backend
      const data = await request(`/recommendations`);

      if (data) {
        setRecommendations(data.recommendations); // Ensure we set an empty array if no recommendations are found
        // console.log("Fetched recommendations:", data);
        
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setErrorRecommendations(err);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [user, request]); // Dependencies: depends on user (for authentication) and request (from useFetch)

  // Effect to trigger fetching recommendations when user status changes or component mounts
  useEffect(() => {
    // Only fetch if authentication is ready and user status is known
    if (!authInitialLoading) {
      fetchRecommendations();
    }
  }, [authInitialLoading, fetchRecommendations]); // Dependencies: authInitialLoading ensures auth state is stable

  return {
    recommendations,
    loadingRecommendations,
    errorRecommendations,
  };
};

export default useRecommendations;
