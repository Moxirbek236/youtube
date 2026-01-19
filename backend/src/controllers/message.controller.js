import messageService from "../services/message.service.js";
class MessageController {
    constructor() {}
    async sendMessage(req, res, next) {
        try {
            const data = await messageService.sendMessage(req);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }
    async getMessages(req, res, next) {
        try {
            const data = await messageService.getMessages(req);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }
}
export default new MessageController();