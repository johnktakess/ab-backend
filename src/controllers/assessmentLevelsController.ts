import { Request, Response } from "express";
import { AssessmentLevel } from "../models/assessmentLevels";

const generateLevelId = async (): Promise<string> => {
  const lastLevel = await AssessmentLevel.findOne().sort({ createdAt: -1 }).select("levelId");
  if (!lastLevel || !lastLevel.levelId) return "FLD001";

  const lastNumber = parseInt(lastLevel.levelId.replace("FLD", "")) || 0;
  const newNumber = (lastNumber + 1).toString().padStart(3, "0");
  return `FLD${newNumber}`;
};

export const createAssessmentLevel = async (req: Request, res: Response) => {
  try {
    const levelId = await generateLevelId();

    const newLevel = new AssessmentLevel({
      levelId,
      levelNumber: req.body.levelNumber,
      assessmentId: req.body.assessmentId,
      levelName: req.body.levelName,
      roles: req.body.options || [],
      status: req.body.status ?? 1,
    });

    await newLevel.save();
    res.status(201).json({ success: true, message: "Assessment level created successfully", data: newLevel });
  } catch (error: any) {
    console.error("Error creating Assessment level:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentLevelById = async (req: Request, res: Response) => {
  try {
    const level = await AssessmentLevel.findById(req.params.id);
    if (!level) return res.status(404).json({ success: false, message: "Assessment level not found" });

    res.status(200).json({ success: true, data: level });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssessmentLevel = async (req: Request, res: Response) => {
  try {
    const level = await AssessmentLevel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!level) return res.status(404).json({ success: false, message: "Assessment level not found" });

    res.status(200).json({ success: true, message: "Assessment level updated successfully", data: level });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAssessmentLevel = async (req: Request, res: Response) => {
  try {
    const level = await AssessmentLevel.findByIdAndDelete(req.params.id);
    if (!level) return res.status(404).json({ success: false, message: "Assessment level not found" });

    res.status(200).json({ success: true, message: "Assessment level deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
