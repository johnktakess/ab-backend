import mongoose, { Document, Schema } from 'mongoose';


export interface IUser extends Document {
    customerId?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    passwordHash: string;
    email?: string;
    refreshTokens: string[];
    role?: string;
    isActive?: number;
    createdAt: Date;
    updatedAt: Date;
}


const UserSchema = new Schema<IUser>({
    customerId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String },
    passwordHash: { type: String, required: true },
    email: { type: String },
    refreshTokens: { type: [String], default: [] },    
    role: { type: String },
    isActive: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},{ timestamps: true, collection: "ab_customers" });


UserSchema.pre<IUser>("save", async function (next) {
  if (this.isNew) {
    const lastUser = await mongoose
      .model<IUser>("User")
      .findOne({}, { customerId: 1 })
      .sort({ createdAt: -1 });

    let nextId = "CUST001"; // default if no users yet

    if (lastUser && lastUser.customerId) {
      const lastNum = parseInt(lastUser.customerId.replace("CUST", ""), 10);
      const newNum = lastNum + 1;
      nextId = "CUST" + newNum.toString().padStart(3, "0");
    }

    this.customerId = nextId;
  }
  next();
});
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "ab_customers");

//export default mongoose.model<IUser>('User', UserSchema, "ab_customers");
export default User;