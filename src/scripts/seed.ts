import 'dotenv/config';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    // Connect to the database
    await db.connect();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      db.models.User.deleteMany({}),
      db.models.Video.deleteMany({}),
      db.models.Comment.deleteMany({}),
    ]);

    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await db.models.User.create({
      username: 'admin',
      email: 'admin@codecast.dev',
      password: adminPassword,
      role: 'admin',
      avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=8B5CF6&color=fff',
    });

    // Create a creator user
    const creatorPassword = await bcrypt.hash('creator123', 10);
    const creator = await db.models.User.create({
      username: 'sarah_coder',
      email: 'sarah@codecast.dev',
      password: creatorPassword,
      role: 'creator',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Coder&background=9b87f5&color=fff',
    });

    // Create a viewer user
    const viewerPassword = await bcrypt.hash('viewer123', 10);
    const viewer = await db.models.User.create({
      username: 'alex_viewer',
      email: 'alex@codecast.dev',
      password: viewerPassword,
      role: 'viewer',
      avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Viewer&background=D6BCFA&color=fff',
    });

    // Create some sample videos
    const video1 = await db.models.Video.create({
      title: 'Building a Scalable React Application',
      description: 'Learn how to structure large React applications for scalability and maintainability. We\'ll cover project structure, state management, performance optimization, and best practices.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=340',
      videoUrl: 'https://www.youtube.com/embed/5SWlnt-O-xg',
      creator: creator._id,
      duration: 1860, // 31 minutes
      views: 15430,
      likes: 1240,
      dislikes: 45,
      tags: ['React', 'JavaScript', 'Frontend', 'Architecture'],
      category: 'Frontend',
      difficulty: 'intermediate',
      averageWatchDuration: 1200,
      isPublished: true,
    });

    const video2 = await db.models.Video.create({
      title: 'System Design: Building a Microservices Architecture',
      description: 'In this comprehensive guide, we\'ll dive deep into microservices architecture, explaining when to use it and how to implement it effectively with real-world examples.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600&h=340',
      videoUrl: 'https://www.youtube.com/embed/SqcXvc3ZmRU',
      creator: creator._id,
      duration: 3840, // 64 minutes
      views: 24180,
      likes: 2870,
      dislikes: 120,
      tags: ['System Design', 'Microservices', 'Architecture', 'Backend'],
      category: 'System Design',
      difficulty: 'advanced',
      averageWatchDuration: 2100,
      isPublished: true,
    });

    // Create some sample comments
    const comment1 = await db.models.Comment.create({
      content: 'Great tutorial! Really helped me understand React architecture better.',
      video: video1._id,
      user: viewer._id,
      isAnonymous: true,
      likes: 42,
    });

    const comment2 = await db.models.Comment.create({
      content: 'Thanks for this! Could you do a follow-up on state management?',
      video: video1._id,
      user: admin._id,
      isAnonymous: false,
      likes: 15,
    });

    // Add a reply to the first comment
    await db.models.Comment.create({
      content: 'Glad you found it helpful!',
      video: video1._id,
      user: creator._id,
      isAnonymous: false,
      parentComment: comment1._id,
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
