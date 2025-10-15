import { Request, Response } from "express";
import { MasterFeedbackForm } from "../models/masterFeedback_form";

const generateFormId = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 8);
  const numberPart = String(Math.floor(Math.random() * 99) + 1).padStart(2, "0");
  return `form${numberPart}_${randomPart}`;
};

// Function to generate unique Question ID
let questionCounter = 1;
const generateQuestionId = (): string => {
  const id = `Ques${String(questionCounter).padStart(3, "0")}`;
  questionCounter++;
  return id;
};

// Recursive function to assign question IDs (including conditional follow-ups)
const assignQuestionIds = (questions: any[]) => {
  return questions.map((q) => {

    q.questionId = q.questionId || generateQuestionId();

    if (q.conditionalQuestions && Array.isArray(q.conditionalQuestions)) {
      q.conditionalQuestions.forEach((cond: any) => {
        if (cond.followUp) {
          cond.followUp.questionId = cond.followUp.questionId || generateQuestionId();
        }
      });
    }

    // Handle nested question groups (like 'specific' section)
    if (q.questions && Array.isArray(q.questions)) {
      q.questions = assignQuestionIds(q.questions);
    }

    return q;
  });
};

// 🟢 CREATE feedback form
export const createFeedbackForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    // Generate formId
    const formId = generateFormId();

    // Assign question IDs (including conditional and nested)
    const questionsWithIds = assignQuestionIds(data.questions || []);

    const feedbackForm = new MasterFeedbackForm({
      ...data,
      formId,
      questions: questionsWithIds,
    });

    await feedbackForm.save();
    res.status(201).json({ message: "Feedback form created successfully", feedbackForm });
  } catch (error) {
    console.error("Error creating feedback form:", error);
    res.status(500).json({ message: "Error creating feedback form", error });
  }
};

// ✅ READ ALL
export const getAllFeedbackForms = async (req: Request, res: Response) => {
  try {
    const forms = await MasterFeedbackForm.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error });
  }
};

// ✅ READ ONE
export const getFeedbackFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const form = await MasterFeedbackForm.findById(id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error fetching form", error });
  }
};

// ✅ UPDATE
export const updateFeedbackForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedForm = await MasterFeedbackForm.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedForm)
      return res.status(404).json({ message: "Form not found" });
    res.status(200).json({
      message: "Feedback form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating form", error });
  }
};

// ✅ DELETE
export const deleteFeedbackForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedForm = await MasterFeedbackForm.findByIdAndDelete(id);
    if (!deletedForm)
      return res.status(404).json({ message: "Form not found" });
    res.status(200).json({ message: "Feedback form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form", error });
  }
};
