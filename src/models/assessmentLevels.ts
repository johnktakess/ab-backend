import { Schema, model, Document } from "mongoose";

export interface IAssessmentLevel extends Document {
  levelId: string;
  levelNumber: string;
  assessmentId: string;
  levelName: string;
  roles: string[];
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentLevelSchema = new Schema<IAssessmentLevel>(
  {
    levelId: { type: String, required: true },
    levelNumber: { type: String, required: true },
    assessmentId: { type: String, required: true },
    levelName: { type: String, required: true },
    roles: { type: [String], default: [] },
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "ab_assessment_levels" }
);

export const AssessmentLevel = model<IAssessmentLevel>(
  "AssessmentLevel",
  assessmentLevelSchema,
  "ab_assessment_levels"
);
