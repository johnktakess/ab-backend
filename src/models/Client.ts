import mongoose, { Document, Schema } from 'mongoose';


export interface IClient extends Document {
    clientId: string;
    clientSecretHash: string;
    clientName?: string;
    redirectUris?: string[];
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
}


const ClientSchema = new Schema<IClient>({
    clientId: { type: String, required: true, unique: true, index: true },
    clientSecretHash: { type: String, required: true },
    clientName: { type: String },
    redirectUris: { type: [String], default: [] },
    refreshTokens: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},{ timestamps: true, collection: "ab_clients" });

export default mongoose.model<IClient>('Client', ClientSchema, "ab_clients");

/* ClientSchema.pre<IClient>("save", async function (next) {
  if (this.isNew) {
    const lastClient = await mongoose
      .model<IClient>("Client")
      .findOne({}, { clientId: 1 })
      .sort({ createdAt: -1 });

    let nextId = "CLNT001"; // default if no users yet

    if (lastClient && lastClient.clientId) {
      const lastNum = parseInt(lastClient.clientId.replace("CLNT", ""), 10);
      const newNum = lastNum + 1;
      nextId = "CLNT" + newNum.toString().padStart(3, "0");
    }

    this.clientId = nextId;
  }
  next();
});
const Client = mongoose.models.User || mongoose.model<IClient>("Client", ClientSchema, "ab_clients");
export default Client; */

