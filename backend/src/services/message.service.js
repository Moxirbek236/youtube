import pool from "../databases/config.js";
import { BadRequestError } from "../utils/errors.js";
import path from "path";
class MessageService {
    constructor() { }
    async sendMessage(req) {
        let file, message
        // console.log(req.body, req);
        if (req.body) {            
            message = req.body.message
        }
        const { to_id } = req.params;
        if (req.files) {                                                          
            file = req.files.file
        }        
        const user_id = req.user.id;
        if (!to_id) {
            throw new BadRequestError("to_id is required");
        }
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [to_id]);
        const newFileName = file ? `${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(file.name)}`: message
        const filePath = file ? path.join(process.cwd(), "src", "uploads", newFileName) : null;
        const newMessage = await pool.query("INSERT INTO message (message, user_id_from, user_id_to, type) VALUES ($1, $2, $3, $4) RETURNING *", [file? newFileName : message, user_id, to_id, file ? file.mimetype : "plan/text"]);

        process.io.to(user.rows[0].socket_id).emit("send_message", newMessage.rows[0].message);
        
        file? await file.mv(filePath) : null
    
        return {
            status: 200,
            message: "Message sent successfully",
            data: newMessage.rows[0]
        };
    }
    async getMessages(req) {
        const user_id = req.user.id;
        const { to_id } = req.params;
        if (!user_id) {
            throw new BadRequestError("User ID is required");
        }
        const messages = await pool.query(`
            SELECT * FROM message WHERE 
            (user_id_from = $1 AND user_id_to = $2) OR
            (user_id_from = $2 AND user_id_to = $1)
        `, [user_id, to_id]);
        return {
            status: 200,
            message: "Messages fetched successfully",
            data: messages.rows.map(message => ({
                id: message.id,
                message: message.message,
                user_id_from: message.user_id_from,
                user_id_to: message.user_id_to,
                created_at: message.created_at
            }))
        };
    }
}
export default new MessageService();