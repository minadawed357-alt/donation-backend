import userModel from "../../database/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} from "../../email/email.js";

// تسجيل مستخدم جديد
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password, phone, age, gender } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) return next(new AppError("User already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
    phone,
    age,
    gender,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "20m",
  });

  await sendConfirmationEmail(email, token);

  return res.status(201).json({
    status: "success",
    data: {
      message: "Confirmation email sent to your email",
      user: newUser,
    },
  });
});

// تسجيل الدخول
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("Invalid email or password", 401));

  if (!user.active)
    return next(new AppError("User is not Confirmed Check Your Email", 401));

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return next(new AppError("Invalid email or password", 401));

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    status: "success",
    token,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// تأكيد البريد الإلكتروني
export const confirmEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) return next(new AppError("Invalid token", 400));

    await userModel.findByIdAndUpdate(decoded.id, { active: true });
    res.json({ status: "success", message: "Email confirmed" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const user = await userModel.findOne({ active: false });
      if (!user)
        return next(new AppError("Invalid or already activated account", 400));

      const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "20m",
      });
      await sendConfirmationEmail(user.email, newToken);

      return res.status(401).json({
        status: "error",
        message: "Token expired. A new confirmation email has been sent.",
      });
    }
    return next(new AppError("Invalid token", 400));
  }
});

// إعادة إرسال رابط التأكيد
export const resendConfirmation = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email, active: false });
  if (!user)
    return next(new AppError("Invalid email or account already activated", 400));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "20m",
  });
  await sendConfirmationEmail(user.email, token);

  res.status(200).json({
    status: "success",
    message: "Confirmation email has been resent",
  });
});

// نسيان كلمة المرور
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("Invalid email", 400));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "20m",
  });
  await sendResetPasswordEmail(user.email, token);

  res.status(200).json({
    status: "success",
    message: "Reset password email has been sent",
  });
});

// إعادة تعيين كلمة المرور
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) return next(new AppError("Invalid token", 400));
  if (!password) return next(new AppError("Enter your new password", 400));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.findByIdAndUpdate(
    decoded.id,
    { password: hashedPassword },
    { new: true }
  );
  if (!user) return next(new AppError("Invalid token", 400));

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully",
  });
});