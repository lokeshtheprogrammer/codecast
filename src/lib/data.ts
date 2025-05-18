
import { User, Video, Comment, CreatorAnalytics, AdminAnalytics, UserRole } from "./types";

// Mock users data
export const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@codecast.dev",
    role: "admin",
    avatarUrl: "https://ui-avatars.com/api/?name=Admin+User&background=8B5CF6&color=fff",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    username: "sarah_coder",
    email: "sarah@codecast.dev",
    role: "creator",
    avatarUrl: "https://ui-avatars.com/api/?name=Sarah+Coder&background=9b87f5&color=fff",
    subscribers: 12500,
    createdAt: "2023-01-10T00:00:00.000Z",
  },
  {
    id: "3",
    username: "mike_dev",
    email: "mike@codecast.dev",
    role: "creator",
    avatarUrl: "https://ui-avatars.com/api/?name=Mike+Dev&background=9b87f5&color=fff",
    subscribers: 8500,
    createdAt: "2023-01-15T00:00:00.000Z",
  },
  {
    id: "4",
    username: "alex_viewer",
    email: "alex@example.com",
    role: "viewer",
    avatarUrl: "https://ui-avatars.com/api/?name=Alex+Viewer&background=D6BCFA&color=fff",
    createdAt: "2023-02-01T00:00:00.000Z",
  },
];

// Mock videos data
export const videos: Video[] = [
  {
    id: "1",
    title: "Building a Scalable React Application",
    description: "Learn how to structure large React applications for scalability and maintainability. We'll cover project structure, state management, performance optimization, and best practices.",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=340",
    videoUrl: "https://www.youtube.com/embed/5SWlnt-O-xg",
    creatorId: "2",
    creator: users[1],
    duration: 1860, // 31 minutes
    views: 15430,
    likes: 1240,
    dislikes: 45,
    tags: ["React", "JavaScript", "Frontend", "Architecture"],
    category: "Frontend",
    difficulty: "Intermediate",
    createdAt: "2023-04-15T12:00:00.000Z",
    averageWatchDuration: 1200,
  },
  {
    id: "2",
    title: "System Design: Building a Microservices Architecture",
    description: "In this comprehensive guide, we'll dive deep into microservices architecture, explaining when to use it and how to implement it effectively with real-world examples.",
    thumbnailUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600&h=340",
    videoUrl: "https://www.youtube.com/embed/SqcXvc3ZmRU",
    creatorId: "3",
    creator: users[2],
    duration: 3840, // 64 minutes
    views: 24180,
    likes: 2870,
    dislikes: 120,
    tags: ["System Design", "Microservices", "Architecture", "Backend"],
    category: "System Design",
    difficulty: "Advanced",
    createdAt: "2023-03-28T14:30:00.000Z",
    averageWatchDuration: 2100,
  },
  {
    id: "3",
    title: "Getting Started with TypeScript - A Beginner's Guide",
    description: "New to TypeScript? This tutorial will walk you through the basics and help you get started with type-safe JavaScript development.",
    thumbnailUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600&h=340",
    videoUrl: "https://www.youtube.com/embed/d56mG7DezGs",
    creatorId: "2",
    creator: users[1],
    duration: 1680, // 28 minutes
    views: 31520,
    likes: 2940,
    dislikes: 84,
    tags: ["TypeScript", "JavaScript", "Web Development", "Frontend"],
    category: "Frontend",
    difficulty: "Beginner",
    createdAt: "2023-05-10T09:15:00.000Z",
    averageWatchDuration: 1100,
  },
  {
    id: "4",
    title: "Containerization with Docker - From Zero to Hero",
    description: "Learn the fundamentals of Docker and how to containerize your applications for consistent development and deployment environments.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=340",
    videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE",
    creatorId: "3",
    creator: users[2],
    duration: 3120, // 52 minutes
    views: 19870,
    likes: 1870,
    dislikes: 65,
    tags: ["Docker", "DevOps", "Containers", "Backend"],
    category: "DevOps",
    difficulty: "Intermediate",
    createdAt: "2023-04-02T16:45:00.000Z",
    averageWatchDuration: 1850,
  },
  {
    id: "5",
    title: "Building a Full-Stack Application with Next.js and Supabase",
    description: "This tutorial demonstrates how to create a modern full-stack application using Next.js for the frontend and Supabase for the backend.",
    thumbnailUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=600&h=340",
    videoUrl: "https://www.youtube.com/embed/9qCz_KluPZk",
    creatorId: "2",
    creator: users[1],
    duration: 2760, // 46 minutes
    views: 11240,
    likes: 1340,
    dislikes: 38,
    tags: ["Next.js", "Supabase", "Full-Stack", "React"],
    category: "Frontend",
    difficulty: "Intermediate",
    createdAt: "2023-05-20T11:30:00.000Z",
    averageWatchDuration: 1700,
  },
  {
    id: "6",
    title: "Database Design Best Practices for Scalable Applications",
    description: "Learn how to design efficient, scalable database schemas that can grow with your application without sacrificing performance.",
    thumbnailUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=600&h=340",
    videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
    creatorId: "3",
    creator: users[2],
    duration: 2400, // 40 minutes
    views: 9750,
    likes: 940,
    dislikes: 32,
    tags: ["Database", "SQL", "NoSQL", "Performance"],
    category: "Database",
    difficulty: "Advanced",
    createdAt: "2023-03-15T13:20:00.000Z",
    averageWatchDuration: 1500,
  },
];

// Mock comments data
export const comments: Comment[] = [
  {
    id: "1",
    videoId: "1",
    userId: "4",
    content: "This was incredibly helpful, especially the section on state management best practices!",
    createdAt: "2023-04-16T09:30:00.000Z",
  },
  {
    id: "2",
    videoId: "1",
    userId: "3",
    content: "Great content! Would love to see a follow-up on testing strategies for large React apps.",
    createdAt: "2023-04-16T14:15:00.000Z",
  },
  {
    id: "3",
    videoId: "2",
    userId: "4",
    content: "The diagrams really helped me understand the concepts better. Thank you!",
    createdAt: "2023-03-29T08:45:00.000Z",
  },
  {
    id: "4",
    videoId: "2",
    userId: "2",
    content: "Excellent explanation of the trade-offs between monolithic and microservices architectures.",
    createdAt: "2023-03-30T11:20:00.000Z",
  },
  {
    id: "5",
    videoId: "3",
    userId: "4",
    content: "As someone new to TypeScript, this was exactly what I needed. Very clear explanations!",
    createdAt: "2023-05-11T15:10:00.000Z",
  },
  {
    id: "6",
    videoId: "4",
    userId: "2",
    content: "The section on Docker Compose was particularly helpful for my current project.",
    createdAt: "2023-04-03T17:30:00.000Z",
  },
  {
    id: "7",
    videoId: "5",
    userId: "3",
    content: "I've been looking for a good Next.js + Supabase tutorial for ages. This is perfect!",
    createdAt: "2023-05-21T10:05:00.000Z",
  },
  {
    id: "8",
    videoId: "6",
    userId: "4",
    content: "The performance optimization tips for queries are gold. Already implementing them!",
    createdAt: "2023-03-16T09:40:00.000Z",
    flagged: true,
  },
];

// Mock Creator Analytics
export const creatorAnalytics: CreatorAnalytics = {
  totalViews: 58190,
  totalLikes: 5520,
  totalDislikes: 167,
  totalComments: 8,
  topPerformingVideo: videos[2], // TypeScript beginner guide
  likeDislikeRatio: 33.05,
  viewsOverTime: [
    { date: "2023-05-14", count: 1240 },
    { date: "2023-05-15", count: 1580 },
    { date: "2023-05-16", count: 1420 },
    { date: "2023-05-17", count: 1650 },
    { date: "2023-05-18", count: 2100 },
  ],
};

// Mock Admin Analytics
export const adminAnalytics: AdminAnalytics = {
  totalUsers: 457,
  newUsersToday: 24,
  totalVideos: 87,
  newVideosToday: 5,
  topTags: [
    { tag: "React", count: 42 },
    { tag: "JavaScript", count: 38 },
    { tag: "TypeScript", count: 31 },
    { tag: "Backend", count: 27 },
    { tag: "Frontend", count: 25 },
  ],
  mostViewedCategory: { category: "Frontend", views: 48750 },
  dailyUploads: [
    { date: "2023-05-14", count: 3 },
    { date: "2023-05-15", count: 5 },
    { date: "2023-05-16", count: 4 },
    { date: "2023-05-17", count: 7 },
    { date: "2023-05-18", count: 5 },
  ],
  flaggedComments: 3,
};

// Current user simulation (for authentication mock)
let currentUser: User | null = null;

export function getCurrentUser(): User | null {
  return currentUser;
}

export function setCurrentUser(user: User | null): void {
  currentUser = user;
}

export function login(email: string, password: string): User | null {
  // In a real app, we would validate credentials against a backend
  // For mock purposes, we'll just check if the email exists in our users array
  const user = users.find((u) => u.email === email);
  if (user) {
    currentUser = user;
    return user;
  }
  return null;
}

export function logout(): void {
  currentUser = null;
}

export function register(username: string, email: string, password: string, role: UserRole): User | null {
  // In a real app, we would send this data to a backend
  // For mock purposes, we'll just create a new user
  const newUser: User = {
    id: String(users.length + 1),
    username,
    email,
    role,
    avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=9b87f5&color=fff`,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  currentUser = newUser;
  return newUser;
}

// Video specific functions
export function getVideoById(id: string): Video | undefined {
  return videos.find((video) => video.id === id);
}

export function getVideosByCreatorId(creatorId: string): Video[] {
  return videos.filter((video) => video.creatorId === creatorId);
}

export function getCommentsByVideoId(videoId: string): Comment[] {
  return comments.filter((comment) => comment.videoId === videoId);
}

// Search and filter functions
export function searchVideos(query: string): Video[] {
  const lowerCaseQuery = query.toLowerCase();
  return videos.filter((video) => 
    video.title.toLowerCase().includes(lowerCaseQuery) ||
    video.description.toLowerCase().includes(lowerCaseQuery) ||
    video.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
}

export function filterVideosByTag(tag: string): Video[] {
  return videos.filter((video) => video.tags.includes(tag));
}

export function filterVideosByCategory(category: string): Video[] {
  return videos.filter((video) => video.category === category);
}

export function filterVideosByDifficulty(difficulty: string): Video[] {
  return videos.filter((video) => video.difficulty === difficulty);
}

// Analytics functions
export function getCreatorAnalytics(creatorId: string): CreatorAnalytics {
  // In a real app, we would calculate this based on actual data
  // For mock purposes, we'll just return our pre-defined analytics
  return creatorAnalytics;
}

export function getAdminAnalytics(): AdminAnalytics {
  // In a real app, we would calculate this based on actual data
  // For mock purposes, we'll just return our pre-defined analytics
  return adminAnalytics;
}
