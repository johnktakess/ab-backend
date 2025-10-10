import { Schema, model, Document } from "mongoose";

export interface IIndustry extends Document {
  industryName: string;
  industryType: string;
  createdAt: Date;
  updatedAt: Date;
}

const industrySchema = new Schema<IIndustry>(
  {
    industryName: { type: String, required: true },
    industryType: { type: String, required: true },
  }, 
  {timestamps: true, collection: "ab_master_industries" }
);

export const Industry = model<IIndustry>(
  "Industry",
  industrySchema,
  "ab_master_industries"
);
