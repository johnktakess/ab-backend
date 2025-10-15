import { Schema, model, Document } from "mongoose";

export interface IRule {
  ruleName: string;
  condition: string; // e.g., "equals", "range", etc.
  values: string[];  // Array of allowed values or range
}

export interface IEmployeeFieldGroup extends Document {
  fieldId: string; // Reference to EmployeeField
  groupName: string;
  groupDescription: string;
  rules: IRule;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const ruleSchema = new Schema<IRule>(
  {
    ruleName: { type: String, required: true },
    condition: { type: String, required: true },
    values: { type: [String], default: [] },
  },
  { _id: false }
);

const employeeFieldGroupSchema = new Schema<IEmployeeFieldGroup>(
  {
    fieldId: { type: String, required: true },
    groupName: { type: String, required: true },
    groupDescription: { type: String, default: "" },
    rules: { type: ruleSchema, required: true },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: "ab_master_employee_field_groups",
  }
);

export const EmployeeFieldGroup = model<IEmployeeFieldGroup>(
  "EmployeeFieldGroup",
  employeeFieldGroupSchema,
  "ab_master_employee_field_groups"
);
