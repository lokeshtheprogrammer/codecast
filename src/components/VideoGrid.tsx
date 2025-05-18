
import React from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/lib/types";

interface VideoGridProps {
  videos: Video[];
  title?: string;
  compact?: boolean;
  columns?: number;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  title,
  compact = false,
  columns = 4,
}) => {
  // Calculate grid columns based on the columns prop
  let gridCols = "";
  switch (columns) {
    case 1:
      gridCols = "grid-cols-1";
      break;
    case 2:
      gridCols = "grid-cols-1 sm:grid-cols-2";
      break;
    case 3:
      gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      break;
    case 4:
      gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      break;
    case 5:
      gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      break;
    default:
      gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }

  if (videos.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-xl font-medium">No videos found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      )}
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} compact={compact} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
