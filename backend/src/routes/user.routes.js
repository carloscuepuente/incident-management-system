import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import userController from "../controllers/user.controller.js";

import {
  validateCreateRider,
  validateUpdateRider,
  validateResetPassword,
} from "../validators/user.validator.js";

const router = express.Router();

//todas estas rutas requieren autenticación
router.use(authMiddleware);
// todas estas rutas requieren el rol de gestor
router.use(requireRole("gestor"));

router.get("/riders/stats", userController.getRiderStats);

//CRUD
router.get("/riders", userController.getAllRiders);
router.get("/riders/:id", userController.getRiderById);
router.post("/riders", validateCreateRider, userController.createRider);
router.put("/riders/:id", validateUpdateRider, userController.updateRider);

//acciones especiales del gestor para manejar los riders
router.post(
  "/riders/:id/reset-password",
  validateResetPassword,
  userController.resetPassword,
);
router.post("/riders/:id/deactivate", userController.deactivateRider);
router.post("/riders/:id/activate", userController.activateRider);

export default router;
