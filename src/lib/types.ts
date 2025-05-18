
// User related types
export type UserRole = "viewer" | "creator" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  subscribers?: number;
  createdAt: string;
  suspended?: boolean;
}

// Video related types
export type VideoCategory = 
  | "Frontend" 
  | "Backend" 
  | "DevOps" 
  | "System Design" 
  | "Mobile" 
  | "Database"
  | "Machine Learning"
  | "Testing"
  | "Security"
  | "Career";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // This could be a direct URL or embed code
  creatorId: string;
  creator: User;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  tags: string[];
  category: VideoCategory;
  difficulty: DifficultyLevel;
  createdAt: string;
  averageWatchDuration?: number; // in seconds, mock data
  comments?: Comment[];
}

// Comment related types
export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user?: {
    id: string;
    username: string;
    avatarUrl: string;
    role?: UserRole;
    createdAt?: string;
  };
  content: string;
  likes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  createdAt: string;
  flagged?: boolean;
  isSpam?: boolean;
  isAnonymous?: boolean;
}

// Analytics related types
export interface CreatorAnalytics {
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  topPerformingVideo?: Video;
  likeDislikeRatio: number;
  viewsOverTime: { date: string; count: number }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  newUsersToday: number;
  totalVideos: number;
  newVideosToday: number;
  topTags: { tag: string; count: number }[];
  mostViewedCategory: { category: VideoCategory; views: number };
  dailyUploads: { date: string; count: number }[];
  flaggedComments: number;
}
