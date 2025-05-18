
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import CommentSection from "@/components/CommentSection";
import VideoGrid from "@/components/VideoGrid";
import { getVideoById, videos } from "@/lib/data";
import { Video } from "@/lib/types";

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchedVideo = getVideoById(id);
    if (!fetchedVideo) {
      navigate("/");
      return;
    }

    setVideo(fetchedVideo);
    
    // Find related videos by matching tags or category
    const related = videos
      .filter((v) => v.id !== id)
      .filter((v) => {
        // Match by category
        if (v.category === fetchedVideo.category) {
          return true;
        }
        
        // Match by tags (at least one common tag)
        return v.tags.some((tag) => fetchedVideo.tags.includes(tag));
      })
      .slice(0, 4);
    
    setRelatedVideos(related);
    setIsLoading(false);
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <VideoPlayer video={video} />
            <CommentSection videoId={video.id} />
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Related videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Simple VideoCard for sidebar
const VideoCard: React.FC<{ video: Video }> = ({ video }) => (
  <div className="group flex gap-3">
    <div className="relative aspect-video w-40 flex-none overflow-hidden rounded-md">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-xs text-white">
        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
      </div>
    </div>
    <div className="flex-1">
      <h4 className="font-medium leading-tight line-clamp-2 group-hover:text-primary">
        {video.title}
      </h4>
      <p className="mt-1 text-sm text-muted-foreground">
        {video.creator.username}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {video.views.toLocaleString()} views
      </p>
    </div>
  </div>
);

export default Watch;
