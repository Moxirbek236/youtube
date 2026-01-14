import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import cors from "cors";
import { userRouter, videoRouter, searchRouter } from "./routes/index.routes.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use("/uploads", express.static(path.join("src", "uploads")));
app.use(userRouter);
app.use(videoRouter);
app.use(searchRouter);

app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("src", "uploads", filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({ message: "Error downloading file" });
    }
  });
});

app.use((err, req, res, next) => {    
  if (err) {
    if (err.status > 500 || !err.status) {
      res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
      });
      fs.appendFileSync(
        path.join("src", "logs", "errors.log"),
        `[${new Date().toISOString()}] - [ERROR] - [${err.status || 500}] ${err.message}\n\t${err.stack}\n`
      );
    } else if (err.status <= 500) {
      res.status(err.status).json({
        status: err.status,
        message: err.message,
        name: err.name,
      });
    }
    
  }
});

app.listen(PORT, () => console.log(`Server is runned on ${PORT}`));
