import userSchema from "../validations/validations.js";
import { BadRequestError } from "../utils/errors.js";

class Validations {
  register(req, res, next) {
    const { error } = userSchema.userSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  }

  login(req, res, next) {
    const { error } = userSchema.registerSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  }

  validateVideo(req, res, next) {
    const { error } = userSchema.videoSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  }

  validateTitle(req, res, next) {
    const { error } = userSchema.titleSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  }
}
export default new Validations();
