import { Router } from "express";
import videoController from "../controllers/video.controller.js";
import validations from "../middlewares/validation.js";
import checkToken from "../middlewares/checkToken.js";
import { join } from "path";
import Logger from "../logs/logger.js";
const router = Router();

router
  .post("/video", validations.validateVideo, checkToken, videoController.uploadVideo)
  .delete("/video/:id", videoController.deleteVideo)
  .put("/video/:id", validations.validateTitle, videoController.updateVideo)
  .get("/video/oneUser",checkToken , videoController.getVideoById)
  .get("/files", videoController.getAllVideos)
  .get("/download/:filename", videoController.downloadFile)
  .get("/video/:id", videoController.getVideoById);
export default router;
