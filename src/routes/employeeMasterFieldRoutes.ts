import { Router } from "express";
import {
  createEmployeeField,
  getAllEmployeeFields,
  getEmployeeFieldById,
  updateEmployeeField,
  deleteEmployeeField,
} from "../controllers/employeeMasterFieldController";
import { authenticateAccessToken } from "../middleware/auth"

const router = Router();

router.post("/", authenticateAccessToken, createEmployeeField);
router.get("/", authenticateAccessToken, getAllEmployeeFields);
router.get("/:id", authenticateAccessToken, getEmployeeFieldById);
router.put("/:id", authenticateAccessToken, updateEmployeeField);
router.delete("/:id", authenticateAccessToken, deleteEmployeeField);

export default router;
