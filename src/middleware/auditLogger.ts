import { Request, Response, NextFunction } from "express";
import AuditLog from "../models/AuditLog";

export const auditLogger = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Capture response after it's sent
  res.on("finish", async () => {
    try {
      const log = new AuditLog({
        userId: (req as any).user?.id || "guest", // from auth middleware
        action: `${req.method} ${req.originalUrl}`,
        method: req.method,
        endpoint: req.originalUrl,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        statusCode: res.statusCode,
        timestamp: new Date(),
      });

      await log.save();
      console.log("Audit Log:", log);
    } catch (err) {
      console.error("Error saving audit log:", err);
    }
  });

  next();
};