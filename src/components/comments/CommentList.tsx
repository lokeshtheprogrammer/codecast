import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/lib/types';
import { CommentItem } from './CommentItem';
import { useAuth } from '@/lib/hooks/use-auth';
import { Icons } from '@/components/icons';

interface CommentListProps {
  videoId: string;
  initialComments: Comment[];
  onCommentSubmit: (content: string, isAnonymous: boolean) => Promise<void>;
  onCommentDelete: (commentId: string) => Promise<void>;
  onCommentLike: (commentId: string) => Promise<void>;
  onCommentDislike: (commentId: string) => Promise<void>;
  onReply: (commentId: string, username: string) => void;
}

export function CommentList({
  videoId,
  initialComments,
  onCommentSubmit,
  onCommentDelete,
  onCommentLike,
  onCommentDislike,
  onReply,
}: CommentListProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      setIsSubmitting(true);
      await onCommentSubmit(commentText, isAnonymous);
      
      // Reset form
      setCommentText('');
      commentInputRef.current?.focus();
      
      // In a real app, we would refetch the comments to get the latest data
      // For now, we'll just add a temporary comment that will be replaced on refresh
      const tempComment: Comment = {
        id: `temp-${Date.now()}`,
        videoId,
        userId: user.id,
        user: {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: new Date().toISOString(),
        },
        content: commentText,
        likes: 0,
        isLiked: false,
        isDisliked: false,
        isAnonymous,
        createdAt: new Date().toISOString(),
      };
      
      setComments(prev => [tempComment, ...prev]);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await onCommentDelete(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await onCommentLike(commentId);
      
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          const wasLiked = comment.isLiked;
          const wasDisliked = comment.isDisliked;
          
          return {
            ...comment,
            likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !wasLiked,
            isDisliked: wasLiked ? comment.isDisliked : false,
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      await onCommentDislike(commentId);
      
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          const wasDisliked = comment.isDisliked;
          const wasLiked = comment.isLiked;
          
          return {
            ...comment,
            isDisliked: !wasDisliked,
            isLiked: wasDisliked ? comment.isLiked : false,
            likes: wasLiked ? comment.likes - 1 : comment.likes,
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.username} />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <form onSubmit={handleSubmit} className="space-y-2">
              <Textarea
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? 'Add a comment...' : 'Please sign in to comment'}
                className="min-h-[100px]"
                disabled={!user || isSubmitting}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={!user}
                  />
                  <label 
                    htmlFor="anonymous" 
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Post as anonymous
                  </label>
                </div>
                <Button 
                  type="submit" 
                  disabled={!commentText.trim() || isSubmitting || !user}
                >
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : 'Comment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDelete}
                onLike={handleLike}
                onDislike={handleDislike}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
