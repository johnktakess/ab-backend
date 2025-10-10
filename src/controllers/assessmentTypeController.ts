import { Request, Response } from "express";
import { AssessmentType } from "../models/masterAssessment_Types";
// import { generateAssessmentCode } from "../utils/generateAssessmentCode";

export const generateAssessmentCode = (name: string): string => {
  const prefix = name.split(" ")[0].substring(0, 5).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toLowerCase();
  return `${prefix}_${randomSuffix}`;
};

export const createAssessmentType = async (req: Request, res: Response) => {
  try {
    const { assessmentName } = req.body;

    if (!assessmentName) {
      return res.status(400).json({
        success: false,
        message: "assessmentName is required",
      });
    }

    const assessmentCode = generateAssessmentCode(assessmentName);

    const newAssessment = new AssessmentType({
      assessmentName,
      assessmentCode,
      status: 1,
    });

    await newAssessment.save();

    res.status(201).json({ success: true, data: newAssessment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating assessment type",
      error,
    });
  }
};

export const getAllAssessmentTypes = async (_req: Request, res: Response) => {
  try {
    const assessments = await AssessmentType.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assessment types",
      error,
    });
  }
};

export const getAssessmentTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = await AssessmentType.findById(id);

    if (!assessment)
      return res.status(404).json({
        success: false,
        message: "Assessment type not found",
      });

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assessment type",
      error,
    });
  }
};

export const updateAssessmentType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assessmentName, status } = req.body;

    const updatedData: any = { status };
    if (assessmentName) {
      updatedData.assessmentName = assessmentName;
      updatedData.assessmentCode = generateAssessmentCode(assessmentName);
    }

    const updatedAssessment = await AssessmentType.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedAssessment)
      return res.status(404).json({
        success: false,
        message: "Assessment type not found",
      });

    res.status(200).json({ success: true, data: updatedAssessment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating assessment type",
      error,
    });
  }
};

export const deleteAssessmentType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await AssessmentType.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({
        success: false,
        message: "Assessment type not found",
      });

    res.status(200).json({
      success: true,
      message: "Assessment type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting assessment type",
      error,
    });
  }
};

