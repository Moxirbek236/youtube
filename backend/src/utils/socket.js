import jwt from "../utils/jwt.js";
import pool from "../databases/config.js";

export const socketAuth = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.accessToken;
      if (!token) return socket.disconnect();

      const user = jwt.verifyToken(token);
      if (!user) return socket.disconnect();

      // DB yangilanishi
      await pool.query(
        "UPDATE users SET socket_id = $1 WHERE id = $2",
        [socket.id, user.id]
      );

      console.log("User connected:", user.id, socket.id);

      socket.on("disconnect", async () => {
        await pool.query(
          "UPDATE users SET socket_id = NULL WHERE id = $1",
          [user.id]
        );
        console.log("User disconnected:", user.id);
      });

      next(); // middleware davom etadi
    } catch (err) {
      console.error(err);
      socket.disconnect();
    }
  });
};
