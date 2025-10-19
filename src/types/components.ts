// Component prop types for BharatLens application
import { Brand, SearchResult } from "./index";

/**
 * Props for BrandCard component
 * Extends the Brand interface with optional display properties
 */
export interface BrandCardProps extends Brand {
  isIndian?: boolean;
}

/**
 * Props for SearchResults component
 * Simple interface for displaying search results
 */
export interface SearchResultsProps {
  results?: SearchResult;
  isLoading?: boolean;
  onNewSearch?: (query: string) => void;
}

/**
 * Props for SearchBar component
 */
export interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  defaultValue?: string;
}