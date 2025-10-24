import { Schema, model, Document } from "mongoose";

interface IOrgContent {
  organisationName: string;
  industryType: string;
  describe: string;
  mission: string;
  vision: string;
  values: string;
  strategy: string;
}

interface IField {
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

export interface IAssessment extends Document {
  assessmentId: string;
  customerId: string;
  assessmentCode: string;
  assessmentName: string;
  description: string;
  purpose: string;
  desireOutcome: string;
  orgContent: IOrgContent;
  fields: IField[];
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const orgContentSchema = new Schema<IOrgContent>({
  organisationName: { type: String },
  industryType: { type: String },
  describe: { type: String },
  mission: { type: String },
  vision: { type: String },
  values: { type: String },
  strategy: { type: String },
});

const fieldSchema = new Schema<IField>(
  {
    fieldId: { type: String, required: true },
    metaId: { type: String, required: true },
    metaName: { type: String, required: true },
    metaType: { type: String, required: true },
    columnName: { type: String, default: "" },
    isChecked: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    isGroup: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    requireDisable: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const assessmentSchema = new Schema<IAssessment>(
  {
    assessmentId: { type: String, required: true },
    customerId: { type: String, required: true },
    assessmentCode: { type: String },
    assessmentName: { type: String, required: true },
    description: { type: String },
    purpose: { type: String },
    desireOutcome: { type: String },
    orgContent: orgContentSchema,
    fields: { type: [fieldSchema], default: [] },
    status: { type: Number, default: 1 },
  },
  { timestamps: true, collection: "ab_assessments" }
);

export const Assessment = model<IAssessment>(
  "Assessment",
  assessmentSchema,
  "ab_assessments"
);
