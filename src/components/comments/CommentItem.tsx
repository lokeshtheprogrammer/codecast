import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Comment } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
  onReply: (commentId: string, username: string) => void;
}

export function CommentItem({ 
  comment, 
  onDelete, 
  onLike, 
  onDislike, 
  onReply 
}: CommentItemProps) {
  const { user } = useAuth();
  const isOwner = user?.id === comment.user?.id;
  const isAdmin = user?.role === 'admin';
  const canModify = isOwner || isAdmin;

  return (
    <div className="flex space-x-3 group">
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage 
          src={comment.isAnonymous ? '' : comment.user?.avatarUrl} 
          alt={comment.isAnonymous ? 'Anonymous' : comment.user?.username} 
        />
        <AvatarFallback>
          {comment.isAnonymous ? 'A' : comment.user?.username?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {comment.isAnonymous ? 'Anonymous User' : comment.user?.username || 'Unknown User'}
            </span>
            {comment.isAnonymous && (
              <Badge variant="outline" className="text-xs">
                Anonymous
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          {canModify && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <p className="mt-1 text-sm">{comment.content}</p>
        
        <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
          <button 
            onClick={() => onLike(comment.id)}
            className={`flex items-center space-x-1 ${comment.isLiked ? 'text-blue-500' : 'hover:text-foreground'}`}
            disabled={!user}
            title={!user ? 'Sign in to like' : ''}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{comment.likes || 0}</span>
          </button>
          
          <button 
            onClick={() => onDislike(comment.id)}
            className={`flex items-center space-x-1 ${comment.isDisliked ? 'text-blue-500' : 'hover:text-foreground'}`}
            disabled={!user}
            title={!user ? 'Sign in to dislike' : ''}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onReply(comment.id, comment.isAnonymous ? 'Anonymous' : comment.user?.username || 'User')}
            className="flex items-center space-x-1 hover:text-foreground disabled:opacity-50"
            disabled={!user}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reply</span>
          </button>
        </div>
        
        {/* Nested replies would go here */}
      </div>
    </div>
  );
}
