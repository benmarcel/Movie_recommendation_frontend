
import { useState, useEffect, useCallback, useMemo } from 'react';
import useFetch from './useFetch';

const useMovieSearch = () => {
  const { request, fetchLoading, fetchError } = useFetch();

  const [movies, setMovies] = useState([]);
  const [baseApiResults, setBaseApiResults] = useState([]);

  const [filters, setFilters] = useState({
    query: '',
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc',
  });


  const loading = fetchLoading;
  const error = fetchError;

  const fetchMovies = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    try {
      const data = await request(`/movies?${params.toString()}`);
      if (data && data.results) {
        setBaseApiResults(data.results);
        setMovies(data.results); // Initially populate movies from base results
      } else {
        setBaseApiResults([]);
        setMovies([]);
      }
    } catch (err) {
      console.error("Error fetching filtered movies:", err);
      setBaseApiResults([]);
      setMovies([]);
    }
  }, [filters.genre, filters.year, filters.rating, filters.sortBy, request]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Only call the API if query is empty (i.e., not doing client-side search)
      if (!filters.query) {
        fetchMovies();
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [filters.query, filters.genre, filters.year, filters.rating, filters.sortBy, fetchMovies]);

  const displayedMovies = useMemo(() => {
    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      return baseApiResults.filter(movie =>
        movie.title?.toLowerCase().includes(lowerQuery)
      );
    }
    return movies;
  }, [filters.query, baseApiResults, movies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    console.log('Filter changed:', name, value);
  };

  return {
    filters,
    handleChange,
    displayedMovies,
    loading,
    error,
  };
};



export default useMovieSearch;
