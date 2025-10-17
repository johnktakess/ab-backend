import { Router } from "express";
import {
  createAssessmentLevel,
  getAssessmentLevelById,
  updateAssessmentLevel,
  deleteAssessmentLevel,
} from "../controllers/assessmentLevelsController";
import { authenticateAccessToken } from "../middleware/auth"

const router = Router();

router.post("/", authenticateAccessToken, createAssessmentLevel);
router.get("/:id", authenticateAccessToken, getAssessmentLevelById);
router.put("/:id", authenticateAccessToken, updateAssessmentLevel);
router.delete("/:id", authenticateAccessToken, deleteAssessmentLevel);

export default router;
