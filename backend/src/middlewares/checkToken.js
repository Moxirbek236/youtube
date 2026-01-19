import jwt from "../utils/jwt.js";
import {
  TokenExpried,
  JsonWebTokenError,
  UnauthorizedError
} from "../utils/errors.js";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new UnauthorizedError("No token provided", 401));
    }

    const decoded = jwt.verifyToken(token);
    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new TokenExpried("Token has expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new JsonWebTokenError("Invalid token", 401));
    }

    return next(error); 
  }
};
