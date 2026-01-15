import { Router } from "express";
import pool from "../databases/config.js";

const router = Router();

router.get("/search", async (req, res) => {  
  
  let usersData;
    let { search } = req.query;
    usersData = await pool.query(
      `SELECT * FROM users WHERE full_name ILIKE '%' || $1 || '%'`,
      [search]
    );
  
  res.json({ users: usersData.rows });
});

export default router;
