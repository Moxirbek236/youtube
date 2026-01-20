import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class JWTService {
  generateToken(payload) {
    return JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  }

  verifyToken(token) {
    return JWT.verify(token, process.env.SECRET_KEY);
  }
}

export default new JWTService();
