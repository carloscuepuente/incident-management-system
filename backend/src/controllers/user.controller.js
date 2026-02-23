import userServices from "../services/user.services.js";
import responseUtils from "../utils/response.utils.js";

class UserController {
  getAllRiders = async (req, res, next) => {
    try {
      const { isActive, search } = req.query;

      const filters = {};

      if (isActive !== undefined) {
        filters.isActive = isActive === "true";
      }
      if (search && typeof search === "string") {
        filters.search = search.trim();
      }

      const riders = await userServices.getAllRiders(filters);

      return responseUtils.success(
        res,
        riders,
        "Riders obtenidos exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  getRiderById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const rider = await userServices.getRiderById(id);

      return responseUtils.success(res, rider, "Rider obtenido exitosamente");
    } catch (error) {
      next(error);
    }
  };

  createRider = async (req, res, next) => {
    try {
      const riderData = req.body;

      const createdById = req.user._id;

      const rider = await userServices.createRider(riderData, createdById);

      return responseUtils.success(res, rider, "Rider creado exitosamente");
    } catch (error) {
      next(error);
    }
  };

  updateRider = async (req, res, next) => {
    try {
      const { id } = req.params;

      const updateData = req.body;

      const rider = await userServices.updateRider(id, updateData);

      return responseUtils.success(
        res,
        rider,
        "Rider actualizado exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      await userServices.resetPassword(id, newPassword);

      return responseUtils.success(
        res,
        null,
        "Contraseña reseteada exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  deactivateRider = async (req, res, next) => {
    try {
      const { id } = req.params;

      await userServices.deactivateRider(id);

      return responseUtils.success(res, null, "Rider desactivado exitosamente");
    } catch (error) {
      next(error);
    }
  };

  activateRider = async (req, res, next) => {
    try {
      const { id } = req.params;

      await userServices.activateRider(id);

      return responseUtils.success(res, null, "Rider activado exitosamente");
    } catch (error) {
      next(error);
    }
  };

  getRiderStats = async (req, res, next) => {
    try {
      const stats = await userServices.getRiderStats();

      return responseUtils.success(
        res,
        stats,
        "Estadísticas obtenidas exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
