// Enhanced data interfaces for BharatLens application

// Re-export all types for easy importing
export * from "./components";
export * from "./api";

/**
 * Simplified Brand interface
 * Contains only essential brand properties
 */
export interface Brand {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  website?: string; // Brand's official website
}

/**
 * Simplified search result interface
 * Contains only essential search result data
 */
export interface SearchResult {
  summary: string;
  indianBrands: Brand[];
  globalBrands: Brand[];
}

/**
 * Simplified search request interface
 */
export interface SearchRequest {
  query: string;
}

/**
 * Simplified error response interface
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

