import userService from "../services/user.service.js";

class UserController {
  constructor() {}

  async registry(req, res, next) {
    try {
      const data = await userService.registry(req);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const data = await userService.login(req.body);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const data = await userService.getAllUsers();

      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const data = await userService.updateUser(
        req.params.id,
        req.body,
        req.files?.file
      );
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
