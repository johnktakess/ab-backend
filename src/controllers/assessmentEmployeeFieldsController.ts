import { Request, Response } from "express";
import { Assessment } from "../models/Assessment";
import { EmployeeField } from "../models/masterEmployee_fields";
import { AssessmentEmployeeFieldGroup, IAssessmentEmployeeFieldGroup  } from "../models/assessmentEmployee_field_group"; // import this model


const generateFieldId = (index: number): string => {
  return `FLD${index.toString().padStart(3, "0")}`;
};

// ⬇️ Insert ab_master_employee_fields data into ab_assessment.fields
export const insertEmployeeFieldsIntoAssessment = async (req: Request, res: Response) => {
  try {
    const { assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId is required in request body",
      });
    }

    // Step 1: Fetch all master employee fields
    const masterFields = await EmployeeField.find({ status: 1 }).lean();

    if (!masterFields.length) {
      return res.status(404).json({
        success: false,
        message: "No master employee fields found to insert",
      });
    }

    // Step 2: Transform masterFields to match ab_assessments field structure
    const formattedFields = masterFields.map((field: any) => ({
      fieldId: field.fieldId,
      metaId: field.metaId || "",
      metaName: field.metaName,
      metaType: field.metaType,
      columnName: field.columnName || "",
      isChecked: field.isChecked || false,
      options: field.options || [],
      isGroup: field.isGroup || false,
      isRequired: field.isRequired || false,
      requireDisable: field.requireDisable || false,
      isCustom: field.isCustom || false,
      status: field.status || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Step 3: Update the Assessment document’s fields array
    const updatedAssessment = await Assessment.findOneAndUpdate(
      { assessmentId },
      { $set: { fields: formattedFields } },
      { new: true }
    );

    if (!updatedAssessment) {
      return res.status(404).json({
        success: false,
        message: `Assessment with assessmentId ${assessmentId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee fields inserted successfully into assessment",
      data: updatedAssessment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ⬇️ Append new field(s) to existing assessment
export const appendAssessmentFields = async (req: Request, res: Response) => {
  try {
    const { assessmentId } = req.params;
    const fieldsFromFrontend = req.body.fields;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId is required in params",
      });
    }

    if (!fieldsFromFrontend || !Array.isArray(fieldsFromFrontend)) {
      return res.status(400).json({
        success: false,
        message: "fields (array) is required in request body",
      });
    }

    // Find the assessment
    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: `Assessment with assessmentId ${assessmentId} not found`,
      });
    }

    // Generate new field IDs
    const existingCount = assessment.fields?.length || 0;

    const newFields = fieldsFromFrontend.map((field: any, index: number) => ({
      fieldId: generateFieldId(existingCount + index + 1),
      metaId: field.metaId || "",
      metaName: field.metaName,
      metaType: field.metaType,
      columnName: field.columnName || "",
      isChecked: field.isChecked ?? false,
      options: field.options || [],
      isGroup: field.isGroup ?? false,
      isRequired: field.isRequired ?? false,
      requireDisable: field.requireDisable ?? false,
      isCustom: field.isCustom ?? false,
      status: field.status ?? 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Append the new fields to the existing ones
    assessment.fields = [...assessment.fields, ...newFields];

    await assessment.save();

    res.status(200).json({
      success: true,
      message: "Fields appended successfully to assessment",
      data: assessment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getAssessmentFieldsWithGroups = async (req: Request, res: Response) => {
  try {
    const { assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId is required in params",
      });
    }

    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: `Assessment with ID ${assessmentId} not found`,
      });
    }

    const mappedFields = await Promise.all(
      assessment.fields.map(async (field: any) => {
        if (field.isGroup) {

          const groups = await AssessmentEmployeeFieldGroup.find({
            fieldId: field.fieldId,
            assessmentId: assessmentId,
          });

          return {
            ...field.toObject(),
            groups: groups.length > 0 ? groups : [],
          };
        } else {
          return {
            ...field.toObject(),
            groups: [],
          };
        }
      })
    );

    const enrichedAssessment = {
      ...assessment.toObject(),
      fields: mappedFields,
    };

    res.status(200).json({
      success: true,
      data: enrichedAssessment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getSpecificFieldWithGroups = async (req: Request, res: Response) => {
  try {
    const { fieldId, assessmentId } = req.body;

    if (!assessmentId || !fieldId) {
      return res.status(400).json({
        success: false,
        message: "Both assessmentId (params) and fieldId (body) are required",
      });
    }

    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: `Assessment with ID ${assessmentId} not found`,
      });
    }

    const field = assessment.fields.find((f: any) => f.fieldId === fieldId);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: `Field with ID ${fieldId} not found in assessment ${assessmentId}`,
      });
    }

    const groups = await AssessmentEmployeeFieldGroup.find({
      assessmentId,
      fieldId,
    });

    const fieldWithGroups = {
      ...field,
      groups: groups.length > 0 ? groups : [],
    };

    res.status(200).json({
      success: true,
      data: {
        assessmentId,
        field: fieldWithGroups,
      },
    });
  } catch (error: any) {
    console.error("Error fetching field with groups:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const deleteAssessmentField = async (req: Request, res: Response) => {
  try {
    const { fieldId, assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId is required in params",
      });
    }

    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: "fieldId is required in request body",
      });
    }

    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: `Assessment with ID ${assessmentId} not found`,
      });
    }

    const fieldExists = assessment.fields.some(
      (field: any) => field.fieldId === fieldId
    );

    if (!fieldExists) {
      return res.status(404).json({
        success: false,
        message: `Field with ID ${fieldId} not found in this assessment`,
      });
    }

    assessment.fields = assessment.fields.filter(
      (field: any) => field.fieldId !== fieldId
    );

    await assessment.save();

    await AssessmentEmployeeFieldGroup.deleteMany({ fieldId, assessmentId });

    res.status(200).json({
      success: true,
      message: `Field ${fieldId} and related field group data deleted successfully`,
      data: assessment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
