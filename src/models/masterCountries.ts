import { Schema, model, Document } from "mongoose";

export interface ICountry extends Document {
  countryName: string;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new Schema<ICountry>(
  {
    countryName: { type: String, required: true },
    countryCode: { type: String, required: true },
  },
  { timestamps: true, collection: "ab_master_countries" }
);

export const Country = model<ICountry>(
  "Country",
  countrySchema,
  "ab_master_countries"
);
