import express from "express";
import {
  cloneMasterEmployeeFieldGroupsToAssessment,
  createAssessmentEmployeeFieldGroup,
  getAllAssessmentEmployeeFieldGroups,
  getAssessmentEmployeeFieldGroupById,
  updateAssessmentEmployeeFieldGroup,
  deleteAssessmentEmployeeFieldGroup,
} from "../controllers/assessmentEmployeeFieldGroupController";
import { authenticateAccessToken } from "../middleware/auth"

const router = express.Router();

router.post("/save", cloneMasterEmployeeFieldGroupsToAssessment);
router.post("/", createAssessmentEmployeeFieldGroup);
router.get("/", getAllAssessmentEmployeeFieldGroups);
router.get("/:id", getAssessmentEmployeeFieldGroupById);
router.put("/:id", updateAssessmentEmployeeFieldGroup);
router.delete("/:id", deleteAssessmentEmployeeFieldGroup);

export default router;
