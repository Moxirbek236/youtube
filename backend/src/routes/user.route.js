import { Router } from "express";
import userController from "../controllers/user.controller.js";
import validations from "../middlewares/validation.js";
const router = Router();


router
  .post("/registry", validations.register, userController.registry)
  .post("/login", validations.login, userController.login)
  .put("/users/:id", validations.register, userController.updateUser)
  .get("/users", userController.getAllUsers);

export default router;