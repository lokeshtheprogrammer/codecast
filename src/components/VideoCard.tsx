
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Video } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  video: Video;
  compact?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, compact = false }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  return (
    <Link to={`/watch/${video.id}`} className="group">
      <Card className={`overflow-hidden border-0 bg-transparent ${compact ? "" : "h-full"}`}>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(video.duration)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <CardContent className={`px-1 ${compact ? "py-2" : "py-3"}`}>
          <div className="space-y-1.5">
            <h3 className={`font-medium leading-tight line-clamp-2 ${compact ? "text-sm" : "text-base"}`}>
              {video.title}
            </h3>
            {!compact && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {video.creator.username}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{video.views.toLocaleString()} views</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs font-normal">
                {video.difficulty}
              </Badge>
              {video.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
              {video.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{video.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VideoCard;
