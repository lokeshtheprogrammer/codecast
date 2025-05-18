
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VideoGrid from "@/components/VideoGrid";
import { Button } from "@/components/ui/button";
import { videos } from "@/lib/data";
import { VideoCategory, DifficultyLevel, Video } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Clock, 
  Star, 
  ArrowUp, 
  ArrowDown,
  ListFilter
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthState } from "@/lib/auth";

const categories: VideoCategory[] = [
  "Frontend",
  "Backend",
  "DevOps",
  "System Design",
  "Mobile",
  "Database",
  "Machine Learning",
  "Testing",
  "Security",
  "Career",
];

const difficultyLevels: DifficultyLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
  { value: "oldest", label: "Oldest" },
];

const Index: React.FC = () => {
  const { isAuthenticated, user } = getAuthState();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Handle search input with debounce
  useEffect(() => {
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.toLowerCase());
    }, 300);

    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Filter and sort videos
  const filteredVideos = videos.filter((video) => {
    let matchesCategory = true;
    let matchesDifficulty = true;
    let matchesSearch = true;

    if (selectedCategory) {
      matchesCategory = video.category === selectedCategory;
    }

    if (selectedDifficulty) {
      matchesDifficulty = video.difficulty === selectedDifficulty;
    }

    if (debouncedSearchQuery) {
      matchesSearch = video.title.toLowerCase().includes(debouncedSearchQuery) || 
                     video.description.toLowerCase().includes(debouncedSearchQuery) ||
                     video.tags.some(tag => tag.toLowerCase().includes(debouncedSearchQuery));
    }

    return matchesCategory && matchesDifficulty && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "popular":
        return b.views - a.views;
      case "trending":
        // Simple trending algorithm - combination of recency and views
        const recencyScoreA = new Date(a.createdAt).getTime() / (1000 * 60 * 60 * 24); // days since epoch
        const recencyScoreB = new Date(b.createdAt).getTime() / (1000 * 60 * 60 * 24);
        const viewScoreA = Math.log(a.views + 1);
        const viewScoreB = Math.log(b.views + 1);
        return (viewScoreB * recencyScoreB) - (viewScoreA * recencyScoreA);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Featured videos (top 3 by views)
  const featuredVideos = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  // Continue watching (for logged-in users)
  const continueWatching = isAuthenticated ? videos.slice(0, 4) : []; // Mock data - would come from user's watch history

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSortBy("recent");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <section className="mb-12 rounded-xl bg-codecast-dark-bg p-8 text-white dark:bg-codecast-soft-bg dark:text-codecast-dark-bg hero-gradient">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Learn from the best developers in the industry
            </h1>
            <p className="text-lg opacity-90">
              Discover high-quality coding tutorials, system design walkthroughs, and technical deep-dives created by expert developers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                Explore videos
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 text-white hover:bg-white/20 dark:bg-black/10 dark:text-codecast-dark-bg dark:hover:bg-black/20"
                onClick={() => navigate('/upload')}
              >
                Start creating
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Videos Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-500" />
            <h2 className="text-2xl font-bold tracking-tight">Featured Videos</h2>
          </div>
          <VideoGrid videos={featuredVideos} columns={3} />
        </section>

        {/* Continue Watching Section - Only for logged in users */}
        {isAuthenticated && continueWatching.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-blue-500" />
              <h2 className="text-2xl font-bold tracking-tight">Continue Watching</h2>
            </div>
            <VideoGrid videos={continueWatching} columns={4} compact={true} />
          </section>
        )}

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Search size={20} /> 
              Search and Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span className="text-sm font-medium">Categories:</span>
              </div>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-7"
              >
                All
              </Button>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="h-7"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Difficulty:</span>
              <Button
                variant={selectedDifficulty === null ? "secondary" : "ghost"}
                size="sm"
                className="h-7 rounded-full"
                onClick={() => setSelectedDifficulty(null)}
              >
                All
              </Button>
              {difficultyLevels.map((level) => (
                <Button
                  key={level}
                  variant={selectedDifficulty === level ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 rounded-full"
                  onClick={() => setSelectedDifficulty(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
            
            {(selectedCategory || selectedDifficulty || debouncedSearchQuery || sortBy !== "recent") && (
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFilters}
                >
                  Clear filters
                </Button>
              </div>
            )}

            {filteredVideos.length === 0 && debouncedSearchQuery && (
              <div className="py-8 text-center">
                <h3 className="text-xl font-medium">No videos found matching "{debouncedSearchQuery}"</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filtered Videos Results */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {debouncedSearchQuery ? `Search Results (${filteredVideos.length})` : "Browse videos"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredVideos.length} videos</span>
              {sortBy === "recent" && <ArrowDown className="h-3 w-3" />}
              {sortBy === "oldest" && <ArrowUp className="h-3 w-3" />}
            </div>
          </div>
          <VideoGrid videos={filteredVideos} columns={4} />
        </section>
      </main>
    </div>
  );
};

export default Index;
