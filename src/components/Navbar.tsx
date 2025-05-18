
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAuthState, logout } from "@/lib/auth";
import { AuthState } from "@/lib/auth";
import { toast } from "sonner";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [authState, setAuthState] = useState<AuthState>(getAuthState());
  const { isAuthenticated, user } = authState;

  useEffect(() => {
    // Update auth state when it changes
    const checkAuth = () => {
      const currentAuthState = getAuthState();
      setAuthState(currentAuthState);
    };

    // Check on mount
    checkAuth();

    // Set up interval to check periodically
    const intervalId = setInterval(checkAuth, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthState(getAuthState());
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-codecast-purple"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <span className="hidden font-bold sm:inline-block">CodeCast</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/"
              className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Explore
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm items-center">
            <Input
              type="search"
              placeholder="Search videos..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
