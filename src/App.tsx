
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watch from "./pages/Watch";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { UploadPage } from './pages/UploadPage';
import { VideoDetailPage } from './pages/VideoDetailPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';


// Import components from a root index file
export { default as Navbar } from "./components/Navbar";
export { default as VideoCard } from "./components/VideoCard";
export { default as VideoGrid } from "./components/VideoGrid";
export { default as VideoPlayer } from "./components/VideoPlayer";
export { default as CommentSection } from "./components/CommentSection";
export { default as CreatorDashboard } from "./components/CreatorDashboard";
export { default as AdminDashboard } from "./components/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/videos/:id" element={<VideoDetailPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
