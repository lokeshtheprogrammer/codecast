import { Video, VideoCategory, DifficultyLevel } from '../types';
import { getAuthState } from '../auth';

// In a real app, replace this with actual API calls
const API_BASE_URL = '/api/v1';

export interface CreateVideoData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  tags: string[];
  category: VideoCategory;
  difficulty: DifficultyLevel;
  views?: number;
  likes?: number;
  dislikes?: number;
  createdAt?: string;
}

export const createVideo = async (videoData: CreateVideoData): Promise<Video> => {
  const authState = getAuthState();
  if (!authState.user) {
    throw new Error('You must be logged in to upload videos');
  }

  // In a real app, this would be an API call
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      ...videoData,
      creatorId: authState.user.id,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload video');
  }

  return response.json();
};

export const getVideo = async (id: string): Promise<Video> => {
  const response = await fetch(`${API_BASE_URL}/videos/${id}`);
  if (!response.ok) {
    throw new Error('Video not found');
  }
  return response.json();
};

export const getVideos = async (params?: {
  page?: number;
  limit?: number;
  category?: VideoCategory;
  difficulty?: DifficultyLevel;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'trending';
}): Promise<{ videos: Video[]; total: number }> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  const response = await fetch(`${API_BASE_URL}/videos?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
};

export const likeVideo = async (videoId: string): Promise<{ likes: number }> => {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to like video');
  }
  return response.json();
};

export const dislikeVideo = async (videoId: string): Promise<{ dislikes: number }> => {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/dislike`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to dislike video');
  }
  return response.json();
};