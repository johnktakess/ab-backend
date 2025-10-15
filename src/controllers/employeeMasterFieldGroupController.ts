import { Request, Response } from "express";
import { EmployeeFieldGroup } from "../models/masterEmployee_field_groups";

// 📘 Create a new Employee Field Group
export const createEmployeeFieldGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fieldId, groupName, groupDescription, rules } = req.body;

    const newGroup = new EmployeeFieldGroup({
      fieldId,
      groupName,
      groupDescription,
      rules,
    });

    const savedGroup = await newGroup.save();
    res.status(201).json({
      success: true,
      message: "Employee field group created successfully",
      data: savedGroup,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📘 Get all Employee Field Groups
export const getAllEmployeeFieldGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await EmployeeFieldGroup.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Employee field groups retrieved successfully",
      data: groups,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📘 Get a single Employee Field Group by ID
export const getEmployeeFieldGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const group = await EmployeeFieldGroup.findById(req.params.id);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }
    res.status(200).json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📘 Update an Employee Field Group
export const updateEmployeeFieldGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedGroup = await EmployeeFieldGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedGroup) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Employee field group updated successfully",
      data: updatedGroup,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📘 Delete an Employee Field Group
export const deleteEmployeeFieldGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedGroup = await EmployeeFieldGroup.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Employee field group deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
