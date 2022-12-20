import {validationResult} from "express-validator";
import {badRequest} from "../response";

export const checkErrors = (req, res, next) => {
  const error = validationResult(req).formatWith(({msg}) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    badRequest(res, {message: error.array()});
  } else {
    next();
  }
}
