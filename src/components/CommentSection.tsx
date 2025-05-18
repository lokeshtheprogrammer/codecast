
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Comment } from "@/lib/types";
import { getAuthState } from "@/lib/auth";
import { comments as allComments } from "@/lib/data";

interface CommentSectionProps {
  videoId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(
    allComments.filter((c) => c.videoId === videoId)
  );
  const { isAuthenticated, user } = getAuthState();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      videoId,
      userId: user?.id || "anonymous",
      content: comment,
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, we would send this to the backend
    // For the mock app, we'll just update the local state
    setComments([newComment, ...comments]);
    setComment("");
    toast.success("Comment posted successfully");
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold">{comments.length} Comments</h3>
      
      <form onSubmit={handleCommentSubmit} className="space-y-3">
        <Textarea
          placeholder={
            isAuthenticated
              ? "Add a comment..."
              : "Login to comment"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!isAuthenticated}
          className="min-h-[80px] resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isAuthenticated || !comment.trim()}
          >
            Comment
          </Button>
        </div>
      </form>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://ui-avatars.com/api/?name=Anonymous&background=9b87f5&color=fff" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Anonymous User</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground/90">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
