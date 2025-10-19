// Simplified API types for BharatLens application
import { SearchResult, ErrorResponse } from "./index";

/**
 * API status types
 */
export type ApiStatus = "idle" | "loading" | "success" | "error";

/**
 * Simple API response type
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: ErrorResponse;
  status: ApiStatus;
}