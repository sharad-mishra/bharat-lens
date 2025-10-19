import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  size?: "default" | "large";
}

export const SearchBar = ({ onSearch, isLoading = false, size = "default" }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const inputClasses = size === "large" 
    ? "h-14 text-lg pl-14 pr-6 rounded-full"
    : "h-12 pl-12 pr-4 rounded-full";

  const iconSize = size === "large" ? 24 : 20;
  const iconPosition = size === "large" ? "left-5" : "left-4";

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <Search 
        className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-muted-foreground`} 
        size={iconSize}
      />
      <Input
        type="text"
        placeholder="Search products, materials, brands..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={inputClasses}
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
        size={size === "large" ? "default" : "sm"}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};
