import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId?: string;         // logged-in user
  action: string;          // e.g., "CREATE_POST", "DELETE_USER"
  method: string;          // HTTP method (POST, GET, PUT, DELETE)
  endpoint: string;        // API route
  ipAddress?: string;      // client IP
  userAgent?: string;      // frontend/browser
  statusCode?: number;     // response status
  timestamp: Date;         // when action happened
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: String },
  action: { type: String, required: true },
  method: { type: String, required: true },
  endpoint: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  statusCode: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);