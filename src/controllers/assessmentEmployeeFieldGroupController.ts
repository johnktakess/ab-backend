import { Request, Response } from "express";
import { AssessmentEmployeeFieldGroup } from "../models/assessmentEmployee_field_group";


export const createAssessmentEmployeeFieldGroup = async (req: Request, res: Response) => {
  try {
    const { fieldId, assessmentId, groupName, groupDescription, rules, status } = req.body;

    const newGroup = new AssessmentEmployeeFieldGroup({
      fieldId,
      assessmentId,
      groupName,
      groupDescription,
      rules,
      status,
    });

    await newGroup.save();
    res.status(201).json({
      success: true,
      message: "Assessment Employee Field Group created successfully",
      data: newGroup,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAssessmentEmployeeFieldGroups = async (req: Request, res: Response) => {
  try {
    const groups = await AssessmentEmployeeFieldGroup.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Assessment Employee Field Groups retrieved successfully",
      data: groups,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentEmployeeFieldGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await AssessmentEmployeeFieldGroup.findById(id);
    if (!group)
      return res.status(404).json({ success: false, message: "Group not found" });

    res.status(200).json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssessmentEmployeeFieldGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedGroup = await AssessmentEmployeeFieldGroup.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedGroup)
      return res.status(404).json({ success: false, message: "Group not found" });

    res.status(200).json({
      success: true,
      message: "Assessment Employee Field Group updated successfully",
      data: updatedGroup,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAssessmentEmployeeFieldGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedGroup = await AssessmentEmployeeFieldGroup.findByIdAndDelete(id);

    if (!deletedGroup)
      return res.status(404).json({ success: false, message: "Group not found" });

    res.status(200).json({
      success: true,
      message: "Assessment Employee Field Group deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
