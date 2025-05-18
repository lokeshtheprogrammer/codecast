import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Avatar, AvatarImage} from '@/components/ui/avatar';
import { Video, Comment, UserRole } from '@/lib/types';
import { getVideo, likeVideo, dislikeVideo } from '@/lib/api/videos';
import { createComment, getVideoComments, deleteComment, likeComment, dislikeComment } from '@/lib/api/comments';
import { CommentList } from '@/components/comments';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/hooks/use-auth';
import { AvatarFallback } from '@radix-ui/react-avatar';

export function VideoDetailPage() {
  return <VideoDetailPageContent />;
}

function VideoDetailPageContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      if (id) {
        const commentsData = await getVideoComments(id);
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments. Please try again.',
        variant: 'destructive',
      });
    }
  }, [id, toast]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const data = await getVideo(id!);
        setVideo(data);
        // Fetch comments separately
        await fetchComments();
      } catch (error) {
        console.error('Error fetching video:', error);
        toast({
          title: 'Error',
          description: 'Failed to load video. Please try again.',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate, toast, fetchComments]);

  const handleLike = async () => {
    if (!video) return;
    
    try {
      setIsLiking(true);
      const { likes } = await likeVideo(video.id);
      setVideo(prev => prev ? { ...prev, likes, isLiked: true, isDisliked: false } : null);
    } catch (error) {
      console.error('Error liking video:', error);
      toast({
        title: 'Error',
        description: 'Failed to like video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!video) return;
    
    try {
      setIsDisliking(true);
      const { dislikes } = await dislikeVideo(video.id);
      setVideo(prev => prev ? { ...prev, dislikes, isDisliked: true, isLiked: false } : null);
    } catch (error) {
      console.error('Error disliking video:', error);
      toast({
        title: 'Error',
        description: 'Failed to dislike video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDisliking(false);
    }
  };

  const handleCommentSubmit = async (content: string, isAnonymous: boolean) => {
    if (!id || !user) return;
    
    try {
      await createComment({
        videoId: id,
        content,
        isAnonymous,
      });
      
      // Refresh comments after submission
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCommentDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      // Refresh comments after deletion
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCommentLike = async (commentId: string) => {
    try {
      await likeComment(commentId);
      // Refresh comments after like
      await fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };
  
  const handleCommentDislike = async (commentId: string) => {
    try {
      await dislikeComment(commentId);
      // Refresh comments after dislike
      await fetchComments();
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };
  
  const handleReply = (commentId: string, username: string) => {
    // In a real app, this would focus the comment input and add @username
    console.log(`Replying to comment ${commentId} by ${username}`);
  };

  if (isLoading || !video) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Video Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <VideoPlayer 
              video={video} 
              autoPlay 
              controls 
              onEnded={() => {
                // Track video completion
                console.log('Video completed');
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{video.title}</h1>
                <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  variant={video.isLiked ? 'default' : 'outline'} 
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  <Icons.thumbsUp className="w-4 h-4 mr-2" />
                  {video.likes.toLocaleString()}
                </Button>
                <Button 
                  variant={video.isDisliked ? 'default' : 'outline'} 
                  size="sm"
                  onClick={handleDislike}
                  disabled={isDisliking}
                >
                  <Icons.thumbsDown className="w-4 h-4 mr-2" />
                  {video.dislikes.toLocaleString()}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={video.creator.avatarUrl} alt={video.creator.username} />
                  <AvatarFallback>
                    {video.creator.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{video.creator.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {video.creator.subscribers?.toLocaleString() || '0'} subscribers
                  </p>
                </div>
              </div>
              <Button variant="default">Subscribe</Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">About this video</CardTitle>
                  <div className="flex-1 h-px bg-border" />
                  <Button variant="ghost" size="sm">
                    Show more
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">{video.difficulty}</Badge>
                  <Badge variant="secondary" className="text-xs">{video.category}</Badge>
                  {video.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="whitespace-pre-line">{video.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">Comments</CardTitle>
                <div className="flex-1 h-px bg-border" />
              </div>
            </CardHeader>
            <CardContent>
              <CommentList
                videoId={id!}
                initialComments={comments}
                onCommentSubmit={handleCommentSubmit}
                onCommentDelete={handleCommentDelete}
                onCommentLike={handleCommentLike}
                onCommentDislike={handleCommentDislike}
                onReply={handleReply}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Videos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Related Videos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* In a real app, map through related videos */}
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Related videos will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}