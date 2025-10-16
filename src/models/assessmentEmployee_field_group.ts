import { Schema, model, Document } from "mongoose";

export interface IAssessmentEmployeeFieldGroup extends Document {
  fieldId: string;
  assessmentId: string;
  groupName: string;
  groupDescription: string;
  rules: {
    ruleName: string;
    condition: string;
    values: string;
  };
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentEmployeeFieldGroupSchema = new Schema<IAssessmentEmployeeFieldGroup>(
  {
    fieldId: { type: String, required: true },
    assessmentId: { type: String, required: true },
    groupName: { type: String, required: true },
    groupDescription: { type: String, required: true },
    rules: {
      ruleName: { type: String, required: true },
      condition: { type: String, required: true },
      values: { type: String, required: true },
    },
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "ab_assessment_employee_field_groups" }
);

export const AssessmentEmployeeFieldGroup = model<IAssessmentEmployeeFieldGroup>(
  "AssessmentEmployeeFieldGroup",
  assessmentEmployeeFieldGroupSchema,
  "ab_assessment_employee_field_groups"
);
