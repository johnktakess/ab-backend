import { Schema, model, Document } from "mongoose";

export interface IAssessmentType extends Document {
  assessmentName: string;
  assessmentCode: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentTypeSchema = new Schema<IAssessmentType>(
  {
    assessmentName: { type: String, required: true },
    assessmentCode: { type: String, required: true },
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "ab_master_assessment_types" }
);

export const AssessmentType = model<IAssessmentType>(
  "AssessmentType",
  assessmentTypeSchema,
  "ab_master_assessment_types"
);
