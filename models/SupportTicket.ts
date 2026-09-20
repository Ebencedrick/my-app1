import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITicketReply {
  senderRole: "admin" | "user";
  senderName: string;
  message: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  userId?: mongoose.Types.ObjectId;
  userEmail: string;
  userName?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  unreadByUser: boolean;
  unreadByAdmin: boolean;
  replies: ITicketReply[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketReplySchema = new Schema<ITicketReply>(
  {
    senderRole: { type: String, enum: ["admin", "user"], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    unreadByUser: { type: Boolean, default: false },
    unreadByAdmin: { type: Boolean, default: true },
    replies: [TicketReplySchema],
  },
  { timestamps: true }
);

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);

export default SupportTicket;
