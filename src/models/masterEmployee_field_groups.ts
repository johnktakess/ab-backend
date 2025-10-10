import { Schema, model, Document } from "mongoose";

interface IRule {
  ruleName: string;
  condition: string;
  values: string;
}

export interface IEmployeeFieldGroup extends Document {
  fieldId: string;
  groupName: string;
  groupDescription: string;
  rules: IRule[];
}

const ruleSchema = new Schema<IRule>({
  ruleName: { type: String },
  condition: { type: String },
  values: { type: String },
});

const employeeFieldGroupSchema = new Schema<IEmployeeFieldGroup>(
  {
    fieldId: { type: String, required: true },
    groupName: { type: String, required: true },
    groupDescription: { type: String },
    rules: { type: [ruleSchema], default: [] },
  },
  { collection: "ab_master_employee_field_groups" }
);

export const EmployeeFieldGroup = model<IEmployeeFieldGroup>(
  "EmployeeFieldGroup",
  employeeFieldGroupSchema,
  "ab_master_employee_field_groups"
);
