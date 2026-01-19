import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import checkToken from "../middlewares/checkToken.js";
const router = Router();

router.post("/message/:to_id", checkToken, messageController.sendMessage);
router.get("/messages", checkToken, messageController.getMessages);

export default router;