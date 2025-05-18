import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { IUser } from './User';
import { IVideo } from './Video';

export interface IComment extends Document {
  content: string;
  video: Types.ObjectId | IVideo;
  user: Types.ObjectId | IUser;
  isAnonymous: boolean;
  likes: number;
  isPinned: boolean;
  isFlagged: boolean;
  parentComment?: Types.ObjectId | IComment;
  replies: Types.Array<Types.ObjectId | IComment>;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
commentSchema.index({ video: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

// Add method to like a comment
commentSchema.methods.like = async function() {
  this.likes += 1;
  return this.save();
};

// Add method to unlike a comment
commentSchema.methods.unlike = async function() {
  this.likes = Math.max(0, this.likes - 1);
  return this.save();
};

// Add method to add a reply
commentSchema.methods.addReply = async function(replyId: Types.ObjectId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId);
    return this.save();
  }
  return this;
};

// Add method to remove a reply
commentSchema.methods.removeReply = async function(replyId: Types.ObjectId) {
  const index = this.replies.indexOf(replyId);
  if (index > -1) {
    this.replies.splice(index, 1);
    return this.save();
  }
  return this;
};

// Middleware to delete replies when a comment is deleted
commentSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    // Remove this comment from its parent's replies if it's a reply
    if (this.parentComment) {
      await this.model('Comment').updateOne(
        { _id: this.parentComment },
        { $pull: { replies: this._id } }
      );
    }
    
    // Delete all replies to this comment
    if (this.replies.length > 0) {
      await this.model('Comment').deleteMany({ _id: { $in: this.replies } });
    }
    
    next();
  } catch (err: any) {
    next(err);
  }
});

// Create and export the model
export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
