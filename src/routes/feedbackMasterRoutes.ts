import { Router } from "express";
import {
  createFeedbackForm,
  getAllFeedbackForms,
  getFeedbackFormById,
  updateFeedbackForm,
  deleteFeedbackForm,
} from "../controllers/feedbackMasterController";

const router = Router();

router.post("/", createFeedbackForm);
router.get("/", getAllFeedbackForms);
router.get("/:id", getFeedbackFormById);
router.put("/:id", updateFeedbackForm);
router.delete("/:id", deleteFeedbackForm);

export default router;
