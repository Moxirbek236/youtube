import JWT from "jsonwebtoken";

class JWTService {
  generateToken(payload) {
    return JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: "5m" });
  }

  verifyToken(token) {
    return JWT.verify(token, process.env.SECRET_KEY);
  }
}

export default new JWTService();
