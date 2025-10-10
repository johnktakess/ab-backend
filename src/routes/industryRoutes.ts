// src/routes/industry.routes.ts
import { Router } from "express";
import {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
} from "../controllers/industryController";
import { authenticateAccessToken } from "../middleware/auth"

const router = Router();

router.post("/", authenticateAccessToken, createIndustry);
router.get("/", authenticateAccessToken, getAllIndustries);
router.get("/:id",authenticateAccessToken, getIndustryById);
router.put("/:id", authenticateAccessToken, updateIndustry);
router.delete("/:id", authenticateAccessToken, deleteIndustry);

export default router;
