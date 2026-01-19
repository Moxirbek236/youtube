import pool from "../databases/config.js";
import { join, extname } from "path";
import jwt from "../utils/jwt.js";
import { hash_password, compare_password } from "../utils/bcrypt.js";
import {
  InternalServerError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/errors.js";

const rasmlar = ["jpg", "jpeg", "png", "bmp", "tiff", "svg"];

class UserService {
  constructor() {}

  async registry(req) {
    const { full_name, password, email } = req.body;
    const { file } = req.files;

    const users = await pool.query("SELECT * FROM users WHERE full_name = $1", [
      full_name,
    ]);

    if (users.rowCount > 0) {
      throw new ConflictError("User already exists", 409);
    }

    const hashedPassword = await hash_password(password);
    let newUser, accessToken;

    if (file) {
      const ext = extname(file.name).slice(1);

      if (!ext || !rasmlar.includes(ext)) {
        throw new BadRequestError("Invalid file type", 400);
      }

      const newFileName = `${Date.now()}-${Math.floor(
        Math.random() * 1e9,
      )}.${ext}`;
      const photoPath = join("src", "uploads", newFileName);
      const socket_id = process.socket.id;
      newUser = await pool.query(
        "INSERT INTO users (full_name, avatar_url,email, password, socket_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [full_name, newFileName, email, hashedPassword, socket_id],
      );

      await file.mv(photoPath);

      accessToken = jwt.generateToken({
        full_name,
        avatar_url: newFileName,
        id: newUser.rows[0].id,
      });
    } else {
      newUser = await pool.query(
        "INSERT INTO users (full_name, password) VALUES ($1, $2) RETURNING *",
        [full_name, hashedPassword],
      );

      accessToken = jwt.generateToken({
        full_name,
        id: newUser.rows[0].id,
      });
    }

    newUser.rows[0].accessToken = accessToken;

    return {
      status: 201,
      message: "User registered successfully",
      data: newUser.rows[0],
    };
  }

  async login(body) {
    const { full_name, password } = body;

    const user = await pool.query("SELECT * FROM users WHERE full_name = $1", [
      full_name,
    ]);

    if (user.rows.length === 0) {
      throw new NotFoundError("User not found", 404);
    }

    const isPasswordValid = await compare_password(
      password,
      user.rows[0].password,
    );

    const accessToken = jwt.generateToken({
      full_name,
      avatar_url: user.rows[0].avatar_url,
      id: user.rows[0].id,
    });

    user.rows[0].accessToken = accessToken;

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password", 401);
    }

    return {
      status: 200,
      message: "Login successful",
      data: user.rows[0],
    };
  }

  async getAllUsers() {
    const users = (await pool.query("SELECT * FROM users")).rows;

    if (!users.length) {
      throw new NotFoundError("No users found", 404);
    }

    return {
      status: 200,
      message: "Query OK",
      data: users,
    };
  }

  async updateUser(id, body, file) {
    if (!id) {
      throw new NotFoundError(404, "User ID is required");
    }

    const { full_name, password } = body;

    const hashedPassword = await hash_password(password);

    let phoroPath;
    if (file) {
      phoroPath = join("src", "uploads", `${(Date.now() * 1000) / 0.9}`);

      file.mv(phoroPath, (err) => {
        if (err) {
          throw new InternalServerError(500, err);
        }
      });
    }

    const updatedUser = await pool.query(
      "UPDATE users SET full_name = $1, password = $2, avatar_url = COALESCE($3, avatar_url) WHERE id = $4 RETURNING *",
      [full_name, hashedPassword, phoroPath, id],
    );

    return {
      status: 200,
      message: "User updated successfully",
      data: updatedUser.rows[0],
    };
  }
}

export default new UserService();
