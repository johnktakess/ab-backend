import express from "express";
import {
  createAssessmentStaffMember,
  getAllAssessmentStaffMembers,
  deleteAssessmentStaffMember,
  updateAssessmentStaffMember,
} from "../controllers/staffMemberController";

const router = express.Router();

router.post("/", createAssessmentStaffMember);
router.get("/:assessmentId", getAllAssessmentStaffMembers);
router.put("/:id", updateAssessmentStaffMember);
router.delete("/:id", deleteAssessmentStaffMember);

export default router;
