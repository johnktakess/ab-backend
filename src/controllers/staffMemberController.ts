import { Request, Response } from "express";
import { AssessmentStaffMember } from "../models/staff_members";
import { AssessmentEmployeeFieldGroup } from "../models/assessmentEmployee_field_group";
import { Assessment } from "../models/Assessment";
import { v4 as uuidv4 } from "uuid";

/**
 * Helper: Evaluate rule condition
 */
const checkCondition = (condition: string, metaValue: string, ruleValues: string[]) => {
  switch (condition.toLowerCase()) {
    case "equals":
      return ruleValues.includes(metaValue);

    case "contains":
      return ruleValues.some(v => metaValue.includes(v));

    case "greater than":
      return parseFloat(metaValue) > parseFloat(ruleValues[0]);

    case "less than":
      return parseFloat(metaValue) < parseFloat(ruleValues[0]);

    case "range":
    case "between":
      if (ruleValues.length < 2) return false;
      const val = parseFloat(metaValue);
      return val >= parseFloat(ruleValues[0]) && val <= parseFloat(ruleValues[1]);

    default:
      return false;
  }
};

/**
 * CREATE staff member (rule validation + save)
 */
export const createAssessmentStaffMember = async (req: Request, res: Response) => {
  try {
    const { assessmentId, level, fields } = req.body;

    if (!assessmentId || !fields?.length) {
      return res.status(400).json({ success: false, message: "AssessmentId and fields are required" });
    }

    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    const validatedFields: any[] = [];

    for (const field of fields) {
      const { fieldId, metaName, metaValue } = field;

      // Check field exists in assessment.fields
      const assessmentField = assessment.fields.find((f: any) => f.fieldId === fieldId);
      if (!assessmentField) {
        return res.status(400).json({
          success: false,
          message: `FieldId ${fieldId} not found in assessment`,
        });
      }

      // If field has options, validate metaValue with options first
      if (assessmentField.options?.length > 0) {
        if (!assessmentField.options.includes(metaValue)) {
          return res.status(400).json({
            success: false,
            message: `Invalid value for ${metaName}. Expected one of: ${assessmentField.options.join(", ")}`,
          });
        }

        validatedFields.push({
          fieldId,
          metaName,
          metaValue,
          groupName: "",
          condition: "",
          values: [],
        });
      } else {
        // Fetch all group rules for this fieldId
        const fieldGroups = await AssessmentEmployeeFieldGroup.find({ fieldId, assessmentId });

        if (!fieldGroups.length) {
          return res.status(400).json({
            success: false,
            message: `No rule groups found for ${metaName}`,
          });
        }

        let matchedGroup = null;

        for (const group of fieldGroups) {
          const rule = group.rules;
          const isMatch = checkCondition(rule.condition, metaValue, rule.values);
          if (isMatch) {
            matchedGroup = group;
            break;
          }
        }

        if (!matchedGroup) {
          return res.status(400).json({
            success: false,
            message: `Value '${metaValue}' for ${metaName} did not match any group rule`,
          });
        }

        validatedFields.push({
          fieldId,
          metaName,
          metaValue,
          groupName: matchedGroup.groupName,
          condition: matchedGroup.rules.condition,
          values: matchedGroup.rules.values,
        });
      }
    }

    const newStaffMember = new AssessmentStaffMember({
      staffId: uuidv4(),
      assessmentId,
      level,
      fields: validatedFields,
      status: 1,
    });

    await newStaffMember.save();

    return res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      data: newStaffMember,
    });
  } catch (error: any) {
    console.error("Error creating staff member:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * READ all staff members
 */
export const getAllAssessmentStaffMembers = async (req: Request, res: Response) => {
  try {
    const data = await AssessmentStaffMember.find({ assessmentId: req.params.assessmentId});
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE staff member by ID
 */
export const updateAssessmentStaffMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assessmentId, level, fields } = req.body;

    if (!assessmentId || !fields?.length) {
      return res
        .status(400)
        .json({ success: false, message: "AssessmentId and fields are required" });
    }

    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    const validatedFields: any[] = [];

    for (const field of fields) {
      const { fieldId, metaName, metaValue } = field;

      const assessmentField = assessment.fields.find((f: any) => f.fieldId === fieldId);
      if (!assessmentField) {
        return res.status(400).json({
          success: false,
          message: `FieldId ${fieldId} not found in assessment`,
        });
      }

      if (assessmentField.options?.length > 0) {
        if (!assessmentField.options.includes(metaValue)) {
          return res.status(400).json({
            success: false,
            message: `Invalid value for ${metaName}. Expected: ${assessmentField.options.join(", ")}`,
          });
        }

        validatedFields.push({
          fieldId,
          metaName,
          metaValue,
          groupName: "",
          condition: "",
          values: [],
        });
      } else {
        const fieldGroups = await AssessmentEmployeeFieldGroup.find({ fieldId, assessmentId });
        if (!fieldGroups.length) {
          return res.status(400).json({
            success: false,
            message: `No rule groups found for ${metaName}`,
          });
        }

        let matchedGroup = null;
        for (const group of fieldGroups) {
          const rule = group.rules;
          const isMatch = checkCondition(rule.condition, metaValue, rule.values);
          if (isMatch) {
            matchedGroup = group;
            break;
          }
        }

        if (!matchedGroup) {
          return res.status(400).json({
            success: false,
            message: `Value '${metaValue}' for ${metaName} did not match any rule group`,
          });
        }

        validatedFields.push({
          fieldId,
          metaName,
          metaValue,
          groupName: matchedGroup.groupName,
          condition: matchedGroup.rules.condition,
          values: matchedGroup.rules.values,
        });
      }
    }

    const updated = await AssessmentStaffMember.findByIdAndUpdate(
      id,
      {
        assessmentId,
        level,
        fields: validatedFields,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Staff member not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Staff member updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating staff member:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE staff member by ID
 */
export const deleteAssessmentStaffMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await AssessmentStaffMember.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Staff member not found" });
    }
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
