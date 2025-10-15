import express from "express";
import {
  createEmployeeFieldGroup,
  getAllEmployeeFieldGroups,
  getEmployeeFieldGroupById,
  updateEmployeeFieldGroup,
  deleteEmployeeFieldGroup,
} from "../controllers/employeeMasterFieldGroupController";
import { authenticateAccessToken } from "../middleware/auth"

const router = express.Router();

router.post("/", authenticateAccessToken, createEmployeeFieldGroup);
router.get("/", authenticateAccessToken, getAllEmployeeFieldGroups);
router.get("/:id", authenticateAccessToken, getEmployeeFieldGroupById);
router.put("/:id", authenticateAccessToken, updateEmployeeFieldGroup);
router.delete("/:id", authenticateAccessToken, deleteEmployeeFieldGroup);

export default router;
