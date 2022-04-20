import { validationResult } from "express-validator";

export const runValidation = (req:any, res:any, next:any) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.json({
        error: error.array()[0].msg,
      });
    }
    next();
  }
