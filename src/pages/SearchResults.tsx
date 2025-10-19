import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { BrandCard } from "@/components/BrandCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { useSearchWithRetry } from "@/hooks/useSearchWithRetry";
import { sanitizeText } from "@/lib/security";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const { isLoading, results, error, performSearch } = useSearchWithRetry();

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };



  const renderErrorState = () => {
    if (!error) return null;

    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Something Went Wrong</h3>
          <p className="text-muted-foreground max-w-md">{error.error}</p>
          <p className="text-sm text-muted-foreground/80">{error.message}</p>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={() => handleNewSearch(query)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header with search */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/")}
              className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              BharatLens
            </button>
            <div className="flex-1">
              <SearchBar onSearch={handleNewSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </header>

      {/* Results Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Analyzing brands for you...</p>
          </div>
        ) : error ? (
          renderErrorState()
        ) : results ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Summary */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">AI Overview</h2>
                  <p className="text-foreground/90 leading-relaxed">{sanitizeText(results.summary)}</p>
                </div>
              </div>
            </Card>

            {/* Indian Brands Section */}
            {results.indianBrands.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary">🇮🇳</span>
                  Indian Brands
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.indianBrands.map((brand, idx) => (
                    <BrandCard key={idx} {...brand} isIndian />
                  ))}
                </div>
              </section>
            )}

            {/* Global Brands Section */}
            {results.globalBrands.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-accent">🌍</span>
                  Global Brands
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.globalBrands.map((brand, idx) => (
                    <BrandCard key={idx} {...brand} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No Results Found</h3>
              <p className="text-muted-foreground">Try a different search term or check your spelling.</p>
            </div>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="mt-4"
            >
              Start New Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
