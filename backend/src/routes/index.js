import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API esta funcinando correctamente",
    timestamp: new Date(),
  });
});

export default router;
