import { Schema, model, Document } from "mongoose";

export interface IFollowUp {
  questionId: string;
  label: string;
  placeholder?: string;
  inputType: string; // e.g. "text", "textarea"
}

export interface IConditionalQuestion {
  conditionValue: string;
  followUp: IFollowUp;
}

export interface IInnerQuestion {
  questionId: string;
  label: string;
  placeholder?: string;
  inputType: string; // e.g. "text", "textarea"
}

export interface IQuestion {
  questionId?: string;
  label: string;
  questionType?: string; // e.g. "Options", "Text", "Heading"
  inputType?: string; // e.g. "text", "textarea", "radio", "checkbox"
  options?: string[];
  groupElement?: string; // e.g. "experience", "specific", "optional"
  conditionalQuestions?: IConditionalQuestion[];
  questions?: IInnerQuestion[];
}

export interface IMasterFeedbackForm extends Document {
  formId: string;
  assessmentCode?: string;
  stepNumber: number;
  formTitle: string;
  description?: string;
  questions: IQuestion[];
  totalQuestions: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>({
  questionId: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String },
  inputType: { type: String, required: true },
});

const conditionalQuestionSchema = new Schema<IConditionalQuestion>({
  conditionValue: { type: String, required: true },
  followUp: { type: followUpSchema, required: true },
});

const innerQuestionSchema = new Schema<IInnerQuestion>({
  questionId: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String },
  inputType: { type: String, required: true },
});

const questionSchema = new Schema<IQuestion>({
  questionId: { type: String },
  label: { type: String, required: true },
  questionType: { type: String },
  inputType: { type: String },
  options: [{ type: String }],
  groupElement: { type: String },
  conditionalQuestions: [conditionalQuestionSchema],
  questions: [innerQuestionSchema],
});

const masterFeedbackFormSchema = new Schema<IMasterFeedbackForm>(
  {
    formId: { type: String, required: true },
    assessmentCode: { type: String },
    stepNumber: { type: Number, required: true },
    formTitle: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    totalQuestions: { type: Number, required: true },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: "ab_master_feedback_form",
  }
);

export const MasterFeedbackForm = model<IMasterFeedbackForm>(
  "MasterFeedbackForm",
  masterFeedbackFormSchema,
  "ab_master_feedback_form"
);
