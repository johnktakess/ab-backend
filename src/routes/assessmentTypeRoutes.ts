// src/routes/assessmentType.routes.ts
import { Router } from "express";
import {
  createAssessmentType,
  getAllAssessmentTypes,
  getAssessmentTypeById,
  updateAssessmentType,
  deleteAssessmentType,
} from "../controllers/assessmentTypeController";
import { authenticateAccessToken } from "../middleware/auth"

const router = Router();

router.post("/", authenticateAccessToken, createAssessmentType);
router.get("/", authenticateAccessToken, getAllAssessmentTypes);
router.get("/:id", authenticateAccessToken, getAssessmentTypeById);
router.put("/:id", authenticateAccessToken, updateAssessmentType);
router.delete("/:id", authenticateAccessToken, deleteAssessmentType);

export default router;
