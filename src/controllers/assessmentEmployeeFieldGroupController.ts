import { Request, Response } from "express";
import { AssessmentEmployeeFieldGroup } from "../models/assessmentEmployee_field_group";
import { EmployeeFieldGroup } from "../models/masterEmployee_field_groups"; // Master data model

export const cloneMasterEmployeeFieldGroupsToAssessment = async (req: Request, res: Response) => {
  try {
    const { assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId is required",
      });
    }

    const masterGroups = await EmployeeFieldGroup.find();

    if (!masterGroups.length) {
      return res.status(404).json({
        success: false,
        message: "No master employee field groups found",
      });
    }

    const assessmentGroups = masterGroups.map((group) => ({
      fieldId: group.fieldId,
      assessmentId: assessmentId,
      groupName: group.groupName,
      groupDescription: group.groupDescription,
      rules: group.rules,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const insertedGroups = await AssessmentEmployeeFieldGroup.insertMany(assessmentGroups);

    res.status(201).json({
      success: true,
      message: "Master employee field groups successfully copied to assessment",
      count: insertedGroups.length,
      data: insertedGroups,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

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
