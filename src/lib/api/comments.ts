import { Comment, CreateCommentData } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function createComment(commentData: CreateCommentData): Promise<Comment> {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create comment');
  }

  return response.json();
}

export async function getVideoComments(videoId: string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/videos/${videoId}/comments`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch comments');
  }

  return response.json();
}

export async function deleteComment(commentId: string): Promise<void> {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete comment');
  }
}

export async function likeComment(commentId: string): Promise<{ likes: number }> {
  const response = await fetch(`${API_URL}/comments/${commentId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to like comment');
  }

  return response.json();
}

export async function dislikeComment(commentId: string): Promise<{ likes: number }> {
  const response = await fetch(`${API_URL}/comments/${commentId}/dislike`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to dislike comment');
  }

  return response.json();
}

export async function reportComment(commentId: string, reason: string): Promise<void> {
  const response = await fetch(`${API_URL}/comments/${commentId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to report comment');
  }
}
