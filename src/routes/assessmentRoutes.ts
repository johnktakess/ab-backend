import { Router } from "express";
import { Assessment } from "../models/Assessment";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    const saved = await assessment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/", async (_req, res) => {
  const assessments = await Assessment.find();
  res.json(assessments);
});

// READ (by id)
router.get("/:id", async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ error: "Not found" });
    res.json(assessment);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Assessment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default router;