import pool from "../databases/config.js";
import path, { extname } from "path";
import fs from "fs";
import jwt from "../utils/jwt.js";
import {
  InternalServerError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  TokenExpried,
  BadRequestError,
} from "../utils/errors.js";

class VideoService {
  constructor() {}

  async uploadVideo(body, file) {
    const user_id = body.user.id;

    body = body.body;
    const { title } = body;
    const videoExists = ["mp4", "avi", "mov", "wmv", "flv", "mkv"];

    if (
      path.extname(file.name) === "" ||
      !videoExists.includes(path.extname(file.name).slice(1))
    ) {
      throw new BadRequestError("Invalid file type", 400);
    }
    const newFileName = `${Date.now()}-${Math.floor(
      Math.random() * 1e9
    )}${extname(file.name)}`;
    const videoPath = path.join("src", "uploads", `${newFileName}`);
    await file.mv(videoPath, (err) => {
      if (err) {
        throw new InternalServerError("Internal Server Error", 500);
      }
    });
    const newVideo = await pool.query(
      "INSERT INTO videos (title, user_id, avatar_url) VALUES ($1, $2, $3) RETURNING *",
      [title, user_id, newFileName]
    );
    return {
      status: 201,
      message: "Video uploaded successfully",
      data: newVideo.rows[0],
    };
  }
  async deleteVideo(id) {
    if (!id) {
      throw new NotFoundError("Video ID is required", 404);
    }

    const deletedVideo = await pool.query(
      "DELETE FROM videos WHERE id = $1 RETURNING *",
      [id]
    );
    return {
      status: 200,
      message: "Video deleted successfully",
      data: deletedVideo.rows[0],
    };
  }
  async getAllVideos(search) {
    let videos;

    if (!search) {
      const result = await pool.query("SELECT * FROM videos");
      videos = result.rows;
    } else {
      const result = await pool.query(
        "SELECT * FROM videos WHERE title ILIKE '%' || $1 || '%'",
        [search]
      );
      videos = result.rows;
    }
    

    return {
      status: 200,
      message: "Query OK",
      data: videos,
    };
  }
  async updateVideo(id, body, token) {
    let decoded;

    try {
      decoded = jwt.verifyToken(token);
    } catch (err) {
      throw new TokenExpried("Token expired or invalid", 401);
    }

    const user_id = decoded.id;

    if (!user_id) {
      throw new UnauthorizedError("Unauthorized", 401);
    }

    if (!user_id) {
      throw new UnauthorizedError("Unauthorized", 401);
    }

    let video = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);

    if (video.rows.length === 0) {
      throw new NotFoundError("Video not found", 404);
    }

    if (video.rows[0].user_id != user_id) {
      throw new UnauthorizedError("Unauthorized", 401);
    }

    if (!id) {
      throw new NotFoundError("Video ID is required", 404);
    }

    const { title } = body;

    const updatedVideo = await pool.query(
      "UPDATE videos SET title = $1 WHERE id = $2 RETURNING *",
      [title, id]
    );
    return {
      status: 200,
      message: "Video updated successfully",
      data: updatedVideo.rows[0],
    };
  }

  async getVideoById(user_id) {
    const video = await pool.query("SELECT * FROM videos WHERE user_id = $1", [
      user_id,
    ]);
    return {
      status: 200,
      message: "Query OK",
      data: video.rows,
    };
  }
}

export default new VideoService();
