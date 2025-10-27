import { Schema, model, Document } from "mongoose";

interface ILevel {
  levelId: string;
  levelName: string;
  levelNumber: string;
  role: string;
}

interface IField {
  fieldId: string;
  metaName: string;
  metaValue: string;
  groupName: string;
  condition: string;
  values: string[];
}

export interface IAssessmentStaffMember extends Document {
  staffId: string;
  assessmentId: string;
  level: ILevel;
  fields: IField[];
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const levelSchema = new Schema<ILevel>({
  levelId: { type: String, required: true },
  levelName: { type: String, required: true },
  levelNumber: { type: String, required: true },
  role: { type: String, required: true },
});

const fieldSchema = new Schema<IField>({
  fieldId: { type: String, required: true },
  metaName: { type: String, required: true },
  metaValue: { type: String, required: true },
  groupName: { type: String, default: "" },
  condition: { type: String, default: "" },
  values: { type: [String], default: [] },
});

const assessmentStaffMemberSchema = new Schema<IAssessmentStaffMember>(
  {
    staffId: { type: String, required: true },
    assessmentId: {
      type: String,
      required: true,
      ref: "Assessment", 
    },
    level: { type: levelSchema, required: true },
    fields: { type: [fieldSchema], default: [] },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: "ab_assessment_staff_members",
  }
);

export const AssessmentStaffMember = model<IAssessmentStaffMember>(
  "AssessmentStaffMember",
  assessmentStaffMemberSchema,
  "ab_assessment_staff_members"
);
