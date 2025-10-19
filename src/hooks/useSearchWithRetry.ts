import { useState, useCallback } from "react";
import { toast } from "sonner";
import { SearchResult, ErrorResponse } from "@/types";
import {
  searchCache,
  generateCacheKey,
  shouldCacheQuery,
  debounce
} from "@/lib/performance";

interface UseSearchWithRetryReturn {
  isLoading: boolean;
  results: SearchResult | null;
  error: ErrorResponse | null;
  performSearch: (query: string) => Promise<void>;
  performDebouncedSearch: (query: string) => void;
}

export const useSearchWithRetry = (): UseSearchWithRetryReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const showErrorToast = (errorResponse: ErrorResponse) => {
    const message = errorResponse.message || errorResponse.error || "Something went wrong. Please try again.";
    toast.error(message, { duration: 4000 });
  };

  const performSearchInternal = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError({
        error: "Please enter a search query",
        message: "Please enter a search query"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Check cache first
      const cacheKey = generateCacheKey(query);
      if (shouldCacheQuery(query)) {
        const cachedResult = searchCache.get(cacheKey);
        if (cachedResult) {
          setResults(cachedResult);
          setError(null);
          setIsLoading(false);
          toast.success("Results loaded from cache", { duration: 2000 });
          return;
        }
      }

      // Call Express API
      const response = await fetch('http://localhost:3001/api/search-brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorResponse: ErrorResponse = {
          error: errorData.error || "Failed to fetch results. Please try again.",
          message: errorData.error || "Failed to fetch results. Please try again."
        };
        setError(errorResponse);
        showErrorToast(errorResponse);
        return;
      }

      const data = await response.json();

      // Check if response contains error
      if (data.error) {
        const errorResponse = data as ErrorResponse;
        setError(errorResponse);
        showErrorToast(errorResponse);
        return;
      }

      setResults(data);
      setError(null);

      // Cache successful results
      if (shouldCacheQuery(query)) {
        searchCache.set(cacheKey, data);
      }

    } catch (err) {
      console.error("Search error:", err);
      const unexpectedError: ErrorResponse = {
        error: "An unexpected error occurred. Please check your connection and try again.",
        message: "An unexpected error occurred. Please check your connection and try again."
      };
      setError(unexpectedError);
      showErrorToast(unexpectedError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create debounced search function
  const debouncedSearchInternal = useCallback(
    debounce((query: string) => {
      performSearchInternal(query);
    }, 300),
    [performSearchInternal]
  );

  const performSearch = useCallback(async (query: string) => {
    await performSearchInternal(query);
  }, [performSearchInternal]);

  const performDebouncedSearch = useCallback((query: string) => {
    debouncedSearchInternal(query);
  }, [debouncedSearchInternal]);

  return {
    isLoading,
    results,
    error,
    performSearch,
    performDebouncedSearch
  };
};