import { rateLimit } from "express-rate-limit";

const keyGenerator = (req) => req.ip;

export const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator,
  message: { success: false, message: "Demasiadas peticiones, intenta más tarde." },
});

export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator,
  message: { success: false, message: "Demasiados intentos de inicio de sesión, intenta más tarde." },
});
