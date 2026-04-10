import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/login", authLimiter, authController.login);

// !Ojo que toda ruta que requiera auth tiene que ir aqui debajo
router.use(authMiddleware);
router.get("/profile", authController.getProfile);
router.post("/change-password", authController.changePassword);

export default router;
