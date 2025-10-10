import { Router } from "express";
import {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
} from "../controllers/countryController";
import { authenticateAccessToken } from "../middleware/auth"

const router = Router();

router.post("/", authenticateAccessToken, createCountry);
router.get("/", authenticateAccessToken, getAllCountries);
router.get("/:id", authenticateAccessToken, getCountryById);
router.put("/:id", authenticateAccessToken, updateCountry);
router.delete("/:id", authenticateAccessToken, deleteCountry);

export default router;
