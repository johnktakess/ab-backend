import express from "express";
import {
  createEmployeeFieldGroup,
  getAllEmployeeFieldGroups,
  getEmployeeFieldGroupById,
  updateEmployeeFieldGroup,
  deleteEmployeeFieldGroup,
} from "../controllers/employeeMasterFieldGroupController";

const router = express.Router();

router.post("/", createEmployeeFieldGroup);
router.get("/", getAllEmployeeFieldGroups);
router.get("/:id", getEmployeeFieldGroupById);
router.put("/:id", updateEmployeeFieldGroup);
router.delete("/:id", deleteEmployeeFieldGroup);

export default router;
