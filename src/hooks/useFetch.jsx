import { useState, useCallback } from "react";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      config.body = JSON.stringify(body);
    }

    try {
      const res = await fetch("https://movie-recommendation-backend-0ens.onrender.com" + url, config);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Fetch failed: ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};

export default useFetch;
