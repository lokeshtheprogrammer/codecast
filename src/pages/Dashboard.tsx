
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreatorDashboard from "@/components/CreatorDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAuthState, hasRole } from "@/lib/auth";
import VideoGrid from "@/components/VideoGrid";
import { videos } from "@/lib/data";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = getAuthState();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access this page");
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  const isCreator = hasRole("creator") || hasRole("admin");
  
  // For viewers, show recent watched and saved videos
  const recentlyWatched = videos.slice(0, 3); // Mock data
  const savedVideos = videos.slice(2, 5); // Mock data

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {isCreator && (
            <Button onClick={() => navigate('/upload')}>
              Upload new video
            </Button>
          )}
        </div>

        {isCreator ? (
          <CreatorDashboard />
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Welcome, {user.username}!</CardTitle>
                <CardDescription>
                  Track your watched videos and manage your content
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="text-3xl font-semibold">
                    {recentlyWatched.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Videos watched</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="text-3xl font-semibold">
                    {savedVideos.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Videos saved</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="text-3xl font-semibold">5</div>
                  <p className="text-sm text-muted-foreground">Comments posted</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <VideoGrid
                videos={recentlyWatched}
                title="Recently Watched"
                columns={3}
              />
              <VideoGrid videos={savedVideos} title="Saved Videos" columns={3} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
