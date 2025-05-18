import { Model } from 'mongoose';
import { IUser } from '@/models/User';
import { IVideo } from '@/models/Video';
import { IComment } from '@/models/Comment';

declare global {
  // Extend the NodeJS namespace to include custom properties
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
      };
    }
  }

  // Extend the Express namespace to include custom properties
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
    }
  }
}

// Extend the global mongoose object with our models
declare module 'mongoose' {
  interface Models {
    User: Model<IUser>;
    Video: Model<IVideo>;
    Comment: Model<IComment>;
  }

  // Add static methods to the Model interface
  interface Model<T extends Document, TQueryHelpers = {}, TMethods = {}> {
    // Add any additional static methods here if needed
  }

}

// Ensure the file is treated as a module
export {};
