import userModel from "../database/models/user.model.js";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { promisify } from "util";

export const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AppError("You are not logged in.", 401));
  }

  const decodedToken = await promisify(jwt.verify)(
    authorization,
    process.env.JWT_SECRET
  );

  const user = await userModel.findById(decodedToken.id);
  if (!user) {
    return next(new AppError("User no longer exists.", 401));
  }

  req.user = user;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission.", 403));
    }
    next();
  };
};