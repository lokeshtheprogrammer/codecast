import mongoose from 'mongoose';
import { IUser } from '@/models/User';
import { IVideo } from '@/models/Video';
import { IComment } from '@/models/Comment';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Database interface
export interface Database {
  connection: typeof mongoose.connection;
  models: {
    User: mongoose.Model<IUser>;
    Video: mongoose.Model<IVideo>;
    Comment: mongoose.Model<IComment>;
  };
  connect: () => Promise<typeof mongoose>;
}

// Import models
let User: mongoose.Model<IUser>;
let Video: mongoose.Model<IVideo>;
let Comment: mongoose.Model<IComment>;

// Database instance
export const db: Database = {
  connection: mongoose.connection,
  models: {
    get User() {
      if (!User) {
        User = require('@/models/User').User;
      }
      return User;
    },
    get Video() {
      if (!Video) {
        Video = require('@/models/Video').Video;
      }
      return Video;
    },
    get Comment() {
      if (!Comment) {
        Comment = require('@/models/Comment').Comment;
      }
      return Comment;
    },
  },
  connect: async () => {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
      
      // Initialize models after connection
      User = require('@/models/User').User;
      Video = require('@/models/Video').Video;
      Comment = require('@/models/Comment').Comment;
      
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  },
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// Export mongoose for models
export default mongoose;
