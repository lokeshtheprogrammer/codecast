import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { IUser } from './User';

export interface IVideo extends Document {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  creator: Types.ObjectId | IUser;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  averageWatchDuration: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    averageWatchDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search
videoSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text',
  category: 'text'
});

// Virtual for comments (will be populated when needed)
videoSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'video',
});

// Add method to increment views
videoSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Add method to handle likes/dislikes
videoSchema.methods.handleReaction = async function(
  type: 'like' | 'dislike',
  action: 'add' | 'remove'
) {
  if (action === 'add') {
    this[type + 's'] += 1;
  } else {
    this[type + 's'] = Math.max(0, this[type + 's'] - 1);
  }
  return this.save();
};

// Create and export the model
export const Video: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>('Video', videoSchema);
