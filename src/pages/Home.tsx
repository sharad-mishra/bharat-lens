import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setIsLoading(true);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      {/* Logo and Title */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          BharatLens
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Discover and compare Indian and global brands — make informed, conscious buying decisions
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} size="large" />
        </div>
      </div>

      {/* Subtle tagline */}
      <div className="mt-16 text-center animate-in fade-in duration-700 delay-300">
        <p className="text-sm text-muted-foreground">
          Powered by AI • Supporting Indian Excellence
        </p>
      </div>
    </div>
  );
};

export default Home;
