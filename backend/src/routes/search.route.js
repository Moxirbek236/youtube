import { Router } from "express";
import pool from "../databases/config.js";

const router = Router();

router.get("/search", async (req, res) => {  
  
  let videosData, usersData;
  if (!req.query) {
    videosData = await pool.query(`SELECT * FROM videos`);
  } else if (req.query) {
    let { search } = req.query;
    videosData = await pool.query(
      `SELECT * FROM videos WHERE title ILIKE '%' || $1 || '%'`,
      [search]
    );
    usersData = await pool.query(
      `SELECT * FROM users WHERE full_name ILIKE '%' || $1 || '%'`,
      [search]
    );
  }
  console.log(videosData);
  
  res.json({ videos: videosData.rows, users: usersData.rows });
});

export default router;
