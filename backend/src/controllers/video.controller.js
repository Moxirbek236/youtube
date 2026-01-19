import videoService from "../services/video.service.js";
import checkToken from "../middlewares/checkToken.js";

class VideoController {
  constructor() {}
    async uploadVideo(req, res, next) {        
    try {
        const data = await videoService.uploadVideo(req, req.files.file);
        res.status(data.status).json(data);
    } catch (err) {
        next(err);
    }
    }
    async deleteVideo(req, res, next) {
        try {
            const data = await videoService.deleteVideo(req.params.id);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }
    async getAllVideos(req, res, next) {
        try {
            const data = await videoService.getAllVideos(req.query.search);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }

    async updateVideo(req, res, next) {
        const token = req.headers.token;
        try {
            let data = await videoService.updateVideo(req.params.id, req.body, token);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }

    async getVideoById(req, res, next) {
        try {
            const user_id = req.user.id;
            const data = await videoService.getVideoById(user_id);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }        
    }

    async downloadFile(req, res, next) {
        try {
            const data = await videoService.downloadFile(req.params.filename);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }

}
export default new VideoController();