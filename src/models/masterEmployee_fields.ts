import { Schema, model, Document } from "mongoose";

export interface IEmployeeField extends Document {
  fieldId: string;
  metaId: string;
  metaName: string;
  metaType: string;
  columnName: string;
  isChecked: boolean;
  options: string[];
  isGroup: boolean;
  isRequired: boolean;
  requireDisable: boolean;
  isCustom: boolean;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const employeeFieldSchema = new Schema<IEmployeeField>(
  {
    fieldId: { type: String, required: true },
    metaId: { type: String, required: true },
    metaName: { type: String, required: true },
    metaType: { type: String, required: true },
    columnName: { type: String, required: true },
    isChecked: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    isGroup: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: true },
    requireDisable: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "ab_master_employee_fields" }
);

export const EmployeeField = model<IEmployeeField>(
  "EmployeeField",
  employeeFieldSchema,
  "ab_master_employee_fields"
);
