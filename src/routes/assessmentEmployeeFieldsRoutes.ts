import express from "express";
import {
    insertEmployeeFieldsIntoAssessment,
    appendAssessmentFields,
    getAssessmentFieldsWithGroups,
    getSpecificFieldWithGroups,
    deleteAssessmentField
} from "../controllers/assessmentEmployeeFieldsController";
import { authenticateAccessToken } from "../middleware/auth"

const router = express.Router();

router.post("/save", insertEmployeeFieldsIntoAssessment);
router.post("/", appendAssessmentFields);
router.get("/", getAssessmentFieldsWithGroups);
router.get("/fields", getSpecificFieldWithGroups);
router.delete("/:id", deleteAssessmentField);

export default router;
