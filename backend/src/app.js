import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import errorHandler from "./utils/error.handler.js";
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
import { socketAuth } from "./utils/socket.js";
dotenv.config();
const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

socketAuth(io);

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