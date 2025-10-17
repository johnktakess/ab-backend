import { Request, Response } from "express";
import { EmployeeField } from "../models/masterEmployee_fields";
import { EmployeeFieldGroup } from "../models/masterEmployee_field_groups";

const generateFieldId = async (): Promise<string> => {
  const lastField = await EmployeeField.findOne().sort({ createdAt: -1 }).select("fieldId");
  if (!lastField || !lastField.fieldId) return "FLD001";

  const lastNumber = parseInt(lastField.fieldId.replace("FLD", "")) || 0;
  const newNumber = (lastNumber + 1).toString().padStart(3, "0");
  return `FLD${newNumber}`;
};

export const createEmployeeField = async (req: Request, res: Response) => {
  try {
    const fieldId = await generateFieldId();

    const newField = new EmployeeField({
      fieldId,
      metaId: req.body.metaId,
      metaName: req.body.metaName,
      metaType: req.body.metaType,
      columnName: req.body.metaName,
      isChecked: req.body.isChecked ?? false,
      options: req.body.options || [],
      isGroup: req.body.isGroup ?? false,
      isRequired: req.body.isRequired ?? true,
      requireDisable: req.body.requireDisable ?? false,
      isCustom: req.body.isCustom ?? false,
      status: req.body.status ?? 1,
    });

    await newField.save();
    res.status(201).json({ success: true, message: "Employee Field created successfully", data: newField });
  } catch (error: any) {
    console.error("Error creating Employee Field:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEmployeeFields = async (req: Request, res: Response) => {
  try {
   
    const fields = await EmployeeField.aggregate([
      {
        $lookup: {
          from: "ab_master_employee_field_groups", 
          localField: "fieldId",
          foreignField: "fieldId",
          as: "groups",
        },
      },
      {
        $addFields: {
          groups: {
            $cond: {
              if: { $eq: ["$isGroup", true] },
              then: "$groups",
              else: [],
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Employee fields retrieved successfully",
      data: fields,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeFieldById = async (req: Request, res: Response) => {
  try {
    const field = await EmployeeField.findById(req.params.id);
    if (!field) return res.status(404).json({ success: false, message: "Employee Field not found" });

    res.status(200).json({ success: true, data: field });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployeeField = async (req: Request, res: Response) => {
  try {
    const field = await EmployeeField.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!field) return res.status(404).json({ success: false, message: "Employee Field not found" });

    res.status(200).json({ success: true, message: "Employee Field updated successfully", data: field });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEmployeeField = async (req: Request, res: Response) => {
  try {
    const field = await EmployeeField.findByIdAndDelete(req.params.id);
    if (!field) return res.status(404).json({ success: false, message: "Employee Field not found" });

    res.status(200).json({ success: true, message: "Employee Field deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
