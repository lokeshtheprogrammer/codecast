
import React, { useState } from "react";
import { Video } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { getAuthState } from "@/lib/auth";

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const { isAuthenticated } = getAuthState();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [dislikes, setDislikes] = useState(video.dislikes);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like videos");
      return;
    }

    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
      
      if (disliked) {
        setDisliked(false);
        setDislikes(dislikes - 1);
      }
    }
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to dislike videos");
      return;
    }

    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
    } else {
      setDisliked(true);
      setDislikes(dislikes + 1);
      
      if (liked) {
        setLiked(false);
        setLikes(likes - 1);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={video.videoUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold leading-tight">{video.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {video.difficulty}
            </Badge>
            {video.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {video.views.toLocaleString()} views
            </p>
            <span className="text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{likes}</span>
            </Button>
            <Button
              variant={disliked ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{dislikes}</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={video.creator.avatarUrl} alt={video.creator.username} />
              <AvatarFallback>{video.creator.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{video.creator.username}</p>
              <p className="text-sm text-muted-foreground">Creator</p>
            </div>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert">
          <p className="text-foreground/90">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
