import mongoose, { Types } from "mongoose";

interface IMessage {
  content: string;
  userId: Types.ObjectId
}

const msgSchema = new mongoose.Schema<IMessage>({
  content: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, 
{timestamps: true});

export const Message = mongoose.models.Message || mongoose.model('Message', msgSchema);
