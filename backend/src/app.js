import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import errorHandler from "./utils/error.handler.js";
import pool from "./databases/config.js";
import {Server} from "socket.io";
import http from "http";
import {join} from "path";
import {
  userRouter,
  videoRouter,
  searchRouter,
  messageRouter,
  otpRouter,
} from "./routes/index.routes.js";
import jwt from "./utils/jwt.js";
import Logger from "./logs/logger.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

io.on("connection", async (socket) => {
try {
    process.io = io;
  process.socketId = socket.id;
  const token = socket.handshake.auth.token;
  
  const user = jwt.verifyToken(token);
  await pool.query("UPDATE users SET socket_id = $1 WHERE id = $2", [socket.id, user.id]);  

} catch (error) {
  socket.emit("error", error);
}
});


app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use("/uploads", express.static(join(process.cwd(), "src", "uploads")));
app.use(userRouter);
app.use(videoRouter);
app.use(searchRouter);
app.use(messageRouter);
app.use(otpRouter);
app.use(errorHandler);


server.listen(PORT, () => console.log(`Server is runned on ${PORT}`));