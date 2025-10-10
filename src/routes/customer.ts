import { Router } from "express";
import Customer from "../models/User";
import { authenticateAccessToken, AuthRequest } from "../middleware/auth";

const router = Router();

// ✅ Get all employees (only for authenticated users/clients)
router.get("/", authenticateAccessToken, async (req: AuthRequest, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create new employee (for demo)
/* router.post("/", authenticateAccessToken, async (req: AuthRequest, res) => {
  try {
    const { name, email, position } = req.body;
    const employee = new Customer({ name, email, position });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}); */

export default router;