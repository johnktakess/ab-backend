import { Router } from "express";
import {
  createEmployeeField,
  getAllEmployeeFields,
  getEmployeeFieldById,
  updateEmployeeField,
  deleteEmployeeField,
} from "../controllers/employeeMasterFieldController";

const router = Router();

router.post("/", createEmployeeField);
router.get("/", getAllEmployeeFields);
router.get("/:id", getEmployeeFieldById);
router.put("/:id", updateEmployeeField);
router.delete("/:id", deleteEmployeeField);

export default router;
